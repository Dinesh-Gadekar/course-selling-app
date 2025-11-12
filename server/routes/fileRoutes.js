import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authMiddleware from "../middleware/authMiddleware.js";
import File from "../models/File.js";

const router = express.Router();

// Ensure upload folder exists
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ POST /api/files/upload
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileData = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user.id,
    });

    await fileData.save();

    res.json({ message: "File uploaded successfully", file: fileData });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET /api/files (fetch all uploaded files)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json({ files: files.map(f => f.filename) });
  } catch (err) {
    console.error("❌ Error fetching files:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
