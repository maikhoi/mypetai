import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Message } from "./models/Message";

const app = express();

// 🌏 Setup CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 🧩 Root route for health check
app.get("/", (_, res) => res.send("🐾 MyPetAI Chat Server is live."));

// 🚀 HTTP + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// ✅ Connect Mongo
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// 📨 REST: recent messages
app.get("/api/messages/:channelId", async (req, res) => {
  const { channelId } = req.params;
  const items = await Message.find({ channelId }).sort({ createdAt: 1 }).limit(200);
  res.json(items);
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

// 🧠 Track users in each room
const roomUsers: Record<string, Set<string>> = {}; // ✅ Add this line at the top of your socket section

// 💬 WebSocket logic
io.on("connection", (socket) => {
  const { channelId, senderName } = socket.handshake.query;
  let currentRoom: string | null = null;
  const displayName = senderName || "Guest";
  const socketId = socket.id;

  // 🚫 Block guests from private room
  if (channelId !== "general" && (!displayName || (displayName as string).startsWith("Guest"))) {
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
  });
});

// 🧩 Dynamic port for Render
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Chat backend on :${PORT}`));
