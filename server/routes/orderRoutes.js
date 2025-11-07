import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Course Selling API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
