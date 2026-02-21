const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const imageModel = require("../database/models/imageModel");

const router = express.Router();

// Load environment variables
require("dotenv").config();

cloudinary.config({
  cloud_name: "dtuwnmpoe",
  api_key: "781677795381688",
  api_secret: "Jae3q33hDTjodSgHgLm3zJmeF_s",
  secure: true,
});

// Multer setup (temporary storage)
const upload = multer({ dest: "uploads/" });

// Upload API
router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    const filePath = req.file?.path;
    const { userId } = req.body;
    const { date, reason } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "medical_reports",
      });

      // Delete temp file
      fs.unlinkSync(filePath);

      const newImage = imageModel.create({
        userId,
        imageUrl: result.secure_url,
        date,
        reason,
      });

      return res.json({
        message: "File uploaded successfully",
        imageUrl: result.secure_url,
        userId,
        date,
        reason,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res
        .status(500)
        .json({ error: "Upload failed", details: error.message });
    } finally {
      // Ensure temp file is deleted
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);

router.post("/images", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const images = imageModel.find(
      { userId },
      { select: "date reason imageUrl" }
    );

    return res.json(images);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = router;
