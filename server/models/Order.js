import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  paid: { type: Boolean, default: false },
  paymentId: { type: String },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
