import Chat from "../models/Chat.js";

export const sendMessage = async (req, res) => {
  console.log("📩 Incoming chat request body:", req.body);
  console.log("👤 Authenticated user:", req.user);

  try {
    const msg = await Chat.create({
      sender: req.user._id,
      receiver: req.body.receiver || req.user._id, // fallback if no receiver
      message: req.body.message,
    });

    res.json(msg);
  } catch (err) {
    console.error("❌ Chat create error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }).populate("sender receiver", "name email");
    res.json(chats);
  } catch (err) {
    console.error("❌ Fetch messages error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
