
import express from "express";
import multer from "multer";
import imagekit from "../config/imagekit.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
      });

      res.json({
        success: true,
        url: result.url,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
      });
    }
  }
);

export default router;