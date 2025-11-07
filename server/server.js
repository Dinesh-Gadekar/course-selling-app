import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// other routes...
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);



app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
