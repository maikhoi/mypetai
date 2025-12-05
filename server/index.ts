import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Message } from "./models/Message";
import LinkClick from "./models/LinkClick";


import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

Message.collection.createIndex({ channelId: 1, createdAt: -1 });

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

// 🌏 Setup CORS
const allowedOrigins = [
  "https://mypetai.app",
  "https://www.mypetai.app",
  "https://chat.mypetai.app",
  "http://localhost:3000"
];// hardcode allowed origin on chat server (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 🧩 Root route for health check
app.get("/", (_, res) => res.send("🐾 MyPetAI Chat Server is live."));

// 🚀 HTTP + Socket.IO setup
const server = http.createServer(app);

//const io = new Server(server, {
//  cors: { origin: allowedOrigins, credentials: true },
//});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
  pingInterval: 20000,  // every 20s
  pingTimeout: 60000,   // allow 60s silence
  allowEIO3: true, // fix for some browsers
  transports: ["websocket"],  // disable polling
});

io.engine.on("initial_headers", (headers, req) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
});

io.engine.on("headers", (headers, req) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
});


// ✅ Connect Mongo
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => console.error("❌ Mongo error:", err));



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------------------
// 📌 VIDEO UPLOAD ROUTE (PURE JS)
// ------------------------------
app.post("/api/upload-video", upload.single("file"), async (req, res) => {
  console.log("Uploading video from chat...");
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    if (!req.file.mimetype.startsWith("video/")) {
      return res
        .status(400)
        .json({ success: false, error: "Only video uploads allowed" });
    }

    // Upload using Cloudinary stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mypetai/chat-videos",
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary video error:", error);
          return res.status(500).json({ success: false, error: error.message });
        }

        res.json({
          success: true,
          url: (result as any).secure_url,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err: any) {
    console.error("Upload failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


  app.get("/api/tracking/link", async (req, res) => {
    try {
      const { encoded, target, ts } = req.query;
  
      await (LinkClick as any).create({
        encodedUrl: encoded,
        targetUrl: target,
        clientTs: Number(ts),
        serverTs: new Date(),
      });
  
      res.json({ ok: true });
    } catch (err) {
      if ((err as any).code === 11000) {
        console.log("⚠️ Duplicate click ignored (GET)");
        return res.json({ ok: true });
      }
      console.error("❌ Tracking error:", err);
      res.status(500).json({ ok: false });
    }
  });
  
  

// 📨 REST: recent messages
// 📨 REST: lazy-load messages with pagination
app.get("/api/messages/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const { before, limit = 30 } = req.query;

    const query: any = { channelId };
    if (before) query.createdAt = { $lt: new Date(before as string) };

    // 🕒 Sort newest → oldest, then reverse for chronological order
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    console.error("❌ Error fetching paginated messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// 🧹 DELETE message by ID
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const { senderId } = req.query; // we’ll send this from the client
    const isOwner = senderId === "Khoi Mai"; // 👑 your admin account
    console.log("Trying to delete:", messageId, "as sender:", senderId);

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    // ✅ Only the sender or owner can delete
    if (!isOwner && msg.senderId !== senderId && msg.senderName !== senderId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await msg.deleteOne();

    // Notify all users in the same room via socket
    io.to(msg.channelId).emit("chat:delete", { _id: msg._id });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

const trackingIO = io.of("/tracking");

trackingIO.on("connection", (socket) => {
  socket.on("track:linkClick", async (data) => {
    try {
      await (LinkClick as any).create({
        encodedUrl: data.encodedUrl,
        targetUrl: data.targetUrl,
        clientTs: data.ts,
        serverTs: new Date(),
      });
      console.log("🟢 Socket saved click");
    } catch (err:any) {
      if ((err as any).code === 11000) {
        console.log("⚠️ Duplicate click ignored (socket)");
      } else {
        console.error("❌ Socket tracking error:", err);
      }
    }
  });
});


// 🧠 Track users in each room
const roomUsers: Record<string, Set<string>> = {}; // ✅ Add this line at the top of your socket section

// 💬 WebSocket logic
io.on("connection", (socket) => {
  
  // Allow the client to update identity after login
  socket.on("chat:identify", ({ senderName, senderId }) => {
    
    console.log("🔐 Identity updated started:", senderName, senderId);
    socket.data.senderName = senderName;
    socket.data.senderId = senderId;
    console.log("🔐 Identity updated ended:", senderName, senderId);
  });
  
  const { channelId } = socket.handshake.query;  // room stays in handshake
  const displayName = getDisplayName();
  let currentRoom: string | null = null;
  const socketId = socket.id;

  // 🚫 Block guests from private (non-general) rooms
  const isGuest = !displayName || (displayName as string).startsWith("Guest");
  const isPublicRoom = typeof channelId === "string" && channelId.endsWith("general");

  if (isGuest && !isPublicRoom) {
    console.log(`❌ Guest ${displayName} tried to access private room ${channelId}`);
    socket.emit("error", { message: "This room is only for logged-in users." });
    socket.disconnect();
    return;
  }

  // ✅ Helper to broadcast room user list
  const broadcastUsers = (room: string) => {
    const users = Array.from(roomUsers[room] || []);
    io.to(room).emit("room:users", users);
  
    // 🧮 Emit room counts to everyone (for sidebar stats)
    const roomCounts = Object.fromEntries(
      Object.entries(roomUsers).map(([key, set]) => [key, set.size])
    );
    io.emit("room:counts", roomCounts);
  };
  

  // 🚪 Join room
  if (typeof channelId === "string") {
    currentRoom = channelId;
    socket.join(channelId);
    console.log(`👋 [${socketId}] ${displayName} joined room: ${channelId}`);
    
    // Add user to memory list
    if (!roomUsers[channelId]) roomUsers[channelId] = new Set();
    roomUsers[channelId].add(displayName as string);
    broadcastUsers(channelId);  
    
    // ✅ broadcast new user counts after join
    broadcastRoomCounts();
  }

  // 🔄 Switch rooms
  socket.on("chat:switchRoom", (newRoom: string) => {
    if (currentRoom) {
      // Remove user from old room
      roomUsers[currentRoom]?.delete(displayName as string);
      broadcastUsers(currentRoom);
      socket.leave(currentRoom);
    }
 
    socket.join(newRoom);
    currentRoom = newRoom;
    console.log(`🔁 ${displayName} switched to room: ${newRoom}`);

    // Add user to new room's user set
    if (!roomUsers[newRoom]) roomUsers[newRoom] = new Set();
    roomUsers[newRoom].add(displayName as string);
  
    // Update both user list + counts for the new room
    broadcastUsers(newRoom);
    
    broadcastRoomCounts();
  });

  // 💬 Send message
  socket.on("chat:send", async (msg) => {
    try {
      const newMsg = await Message.create({
        ...msg,
        createdAt: new Date(),
      });
      //console.log(`💬 ${msg.senderName}: ${msg.text || "[media]"} → ${msg.channelId}`);
      io.to(msg.channelId).emit("chat:new", newMsg);
      console.log(`✅ Saved 💬 message ID: ${newMsg._id}`);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("findMessageById", async (messageId) => {
    const msg = await Message.findById(messageId);
    if (msg) {
      const rangeMs = 5 * 60 * 1000; // 5 minutes

      const minTime = new Date(msg.createdAt.getTime() - rangeMs);
      const maxTime = new Date(msg.createdAt.getTime() + rangeMs);

      const nearby = await Message.find({
        channelId: msg.channelId,
        createdAt: { $gte: minTime, $lte: maxTime },
      }).sort({ createdAt: 1 });
      socket.emit("loadMessages", nearby);
    }
  });

  // ✍️ Typing indicator
  socket.on("chat:typing", (data) => {
    if (currentRoom) socket.to(currentRoom).emit("chat:typing", data);
  });

  // 🚪 Handle disconnect
  socket.on("disconnect", () => {
    if (currentRoom) {
      roomUsers[currentRoom]?.delete(displayName as string);
      broadcastUsers(currentRoom);
      socket.leave(currentRoom);
    }
    console.log(`❌ [${socketId}] ${displayName} left room: ${currentRoom || "unknown"}`);
    
    broadcastRoomCounts();
  });

  // 👉 new helper get User
  function getDisplayName() {
    return socket.data.senderName || socket.handshake.query.senderName || "Guest";
  }
  

  // 👉 new helper to calculate & send counts to everyone
  function broadcastRoomCounts() {
    const counts: Record<string, number> = {};
    for (const [roomName, users] of Object.entries(roomUsers)) {
      counts[roomName] = users.size;
    }
    io.emit("chat:roomUsers", counts);
  }
  
});

// 🧩 Dynamic port for Render
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Chat backend on :${PORT}`));
