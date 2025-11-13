import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";

import Chat from "./models/Chat.js";
import User from "./models/User.js"; // ✅ Make sure you have User model imported
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Required for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB connection (only once)
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/courseSelling", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});


// ✅ Socket.IO Authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.warn("⚠️ No token provided in socket handshake");
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const user = await User.findById(decoded.id).select("name email");
    if (!user) return next(new Error("User not found"));
    socket.user = user;
    next();
  } catch (err) {
    console.error("❌ Invalid token in socket:", err.message);
    next(new Error("Authentication failed"));
  }
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.user?.name || socket.id);

  socket.on("sendMessage", async (data, callback) => {
    try {
      if (!socket.user) {
        console.warn("⚠️ Unauthorized message attempt");
        return callback({ error: "Unauthorized" });
      }

      const { message } = data;
      if (!message) return callback({ error: "Message content missing" });

      // ✅ Save chat to DB
      let newChat = await Chat.create({
        sender: socket.user._id,
        message,
      });

      // ✅ Populate sender before emitting
      newChat = await newChat.populate("sender", "name email");

      io.emit("receiveMessage", newChat);
      callback({ success: true });
    } catch (err) {
      console.error("❌ Error saving message:", err);
      callback({ error: "Server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user?.name || socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5720;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
