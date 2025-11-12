import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// Auto-delete after 10 minutes (optional)
chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model("Chat", chatSchema);
