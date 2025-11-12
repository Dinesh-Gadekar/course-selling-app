import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";

import Chat from "./models/Chat.js"; // ✅ Make sure Chat model is imported
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ HTTP + Socket.IO setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ You can restrict this to your frontend URL later
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware to verify token in socket handshake
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.warn("⚠️ No token provided in socket handshake");
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid socket token:", err.message);
    next(new Error("Authentication error"));
  }
});

// ✅ Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });

  // ✅ Handle sending messages
  socket.on("sendMessage", async (data, callback) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !message) {
        console.warn("⚠️ Missing senderId or message in sendMessage");
        return callback?.({ error: "Missing senderId or message" });
      }

      // ✅ Save message to DB
      const chatMessage = await Chat.create({
        sender: senderId,
        receiver: receiverId,
        message,
      });

      // ✅ Broadcast to everyone (or targeted users)
      io.emit("receiveMessage", {
        senderId,
        receiverId,
        message,
        createdAt: chatMessage.createdAt,
      });

      callback?.({ success: true });
    } catch (err) {
      console.error("❌ Error saving message:", err);
      callback?.({ error: err.message });
    }
  });
});

const PORT = process.env.PORT || 5720;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
