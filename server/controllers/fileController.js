import fs from "fs";
import path from "path";

const adminFolder = path.join(process.cwd(), "uploads/admin");

export const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
};

export const getFiles = (req, res) => {
  fs.readdir(adminFolder, (err, files) => {
    if (err) return res.status(500).json({ message: "Error reading folder" });
    res.status(200).json({ files });
  });
};
