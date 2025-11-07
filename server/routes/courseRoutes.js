import express from "express";
import {
    createCourse, // ✅ make sure this is imported
    deleteCourse,
    enrollInCourse,
    getCourseById,
    getCourses,
    updateCourse,
} from "../controllers/courseController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// ✅ Admin route to create a new course
router.post("/", protect, adminOnly, createCourse);

// Admin routes for updating & deleting
router.put("/update/:id", protect, adminOnly, updateCourse);
router.delete("/delete/:id", protect, adminOnly, deleteCourse);

// User route: Enroll in course
router.post("/:id/enroll", protect, enrollInCourse);

export default router;
