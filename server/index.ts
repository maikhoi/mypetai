import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import {Message} from "./models/Message";

const app = express();

app.use(cors({ origin: (process.env.CORS_ORIGIN||'http://localhost:3000').split(','), credentials: true }));
app.use(express.json());
app.use(cookieParser());


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Connect Mongo
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => console.error("Mongo error:", err));
  
// REST: get recent messages for a channel
app.get('/api/messages/:channelId', async (req, res) => {
    const { channelId } = req.params;
    const items = await Message.find({ channelId }).sort({ createdAt: 1 }).limit(200);
    res.json(items);
});

io.on("connection", (socket) => {
  let currentRoom: string | null = null;

  // Join the room based on query
  const { channelId } = socket.handshake.query;
  if (typeof channelId === "string") {
    currentRoom = channelId;
    socket.join(channelId);
    console.log(`👋 User joined room: ${channelId}`);
  }

  // Handle switching room dynamically (optional future feature)
  socket.on("chat:switchRoom", (newRoom: string) => {
    if (currentRoom) socket.leave(currentRoom);
    socket.join(newRoom);
    currentRoom = newRoom;
    console.log(`🔁 User switched to room: ${newRoom}`);
  });

  // Handle sending messages
  socket.on("chat:send", async (msg) => {
    try {
        const newMsg = await Message.create({
            ...msg,
            createdAt: new Date(), // ensure timestamp
          });
      // ✅ only send to users in that room
      io.to(msg.channelId).emit("chat:new", newMsg);      
        console.log("💬 received & saved message:", msg);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // ✅ When a user is typing
  socket.on("chat:typing", (data) => {
    if (!currentRoom) return;
    socket.to(currentRoom).emit("chat:typing", data); // send to others in same room
  });

  socket.on("disconnect", () => {
    if (currentRoom) socket.leave(currentRoom);
    console.log("❌ User disconnected");
  });
});

server.listen(4000, () => console.log("🚀 Chat backend on :4000"));
