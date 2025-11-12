import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Chat.find({})
      .populate("sender", "name email")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Store message to DB
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const sender = req.user.id;
    if (!message) return res.status(400).json({ error: "Message is required" });
    const chat = await Chat.create({ sender, message });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
