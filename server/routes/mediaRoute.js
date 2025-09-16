import express from "express";
import { singleUpload } from "../middleware/multer.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/upload-video", singleUpload, async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileUri = getDataUri(file);

    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",   // force mp4 as video
      chunk_size: 6000000,      // optional: large file support (6MB chunks)
    });

    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        url: result.secure_url,   // use secure https link
        publicId: result.public_id,
        duration: result.duration, // Cloudinary gives video length too
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading video file",
      error: error.message,
    });
  }
});

export default router;
