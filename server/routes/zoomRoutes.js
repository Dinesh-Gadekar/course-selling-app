import express from "express";
import { createMeeting, getMeetings } from "../controllers/zoomController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createMeeting);
router.get("/", protect, getMeetings);

export default router;
