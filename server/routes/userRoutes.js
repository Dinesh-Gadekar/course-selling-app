import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/profile", protect, (req, res) => {
  // req.user is set by protect middleware
  res.json(req.user);
});

export default router;
