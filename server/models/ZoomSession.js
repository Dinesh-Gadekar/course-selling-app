import mongoose from "mongoose";

const zoomSessionSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ZoomSession", zoomSessionSchema);
