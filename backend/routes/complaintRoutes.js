import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import imagekit from "../config/imagekit.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

let billCount = 1;
let tenderCount = 1;

function generateCode(type) {
  const year = new Date().getFullYear();

  if (type === "bill") {
    return `B${year}_${String(billCount++).padStart(4, "0")}`;
  }

  return `T${year}_${String(tenderCount++).padStart(4, "0")}`;
}

router.post("/", upload.array("images", 4), async (req, res) => {
  try {
    let { description, itemId, itemTitle, itemType } = req.body;

    itemId = Array.isArray(itemId) ? itemId[0] : itemId;
    itemTitle = Array.isArray(itemTitle) ? itemTitle[0] : itemTitle;
    itemType = Array.isArray(itemType) ? itemType[0] : itemType;

    if (!description || !itemId || !itemTitle || !itemType) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const itemCode = generateCode(itemType);

    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({
        message: "At least 1 image required",
      });
    }

    const uploadedImages = await Promise.all(
      files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
        })
      )
    );
    const complaint = await Complaint.create({
      itemId,
      itemCode,  
      itemTitle,
      itemType,
      description,
      images: uploadedImages.map((img) => ({
        url: img.url,
        fileId: img.fileId,
      })),
    });

    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {
    console.error("COMPLAINT ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    return res.status(200).json(complaints);

  } catch (err) {
    console.error("GET COMPLAINTS ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;