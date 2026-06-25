import express from "express";
import multer from "multer";
import Worker from "../models/Worker.js"; 

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get("/project/:id", async (req, res) => {
  try {
    const workers = await Worker.find({ tenderId: req.params.id }).sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve workforce profiles." });
  }
});

router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, mobile, aadhaar, designation, address, tenderId } = req.body;

    let imageUrl = "";
    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");
      imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const newWorker = new Worker({
      name,
      mobile,
      aadhaar,
      designation,
      address,
      tenderId,
      imageUrl 
    });

    const savedWorker = await newWorker.save();
    res.status(201).json(savedWorker);
  } catch (err) {
    console.error("Database save exception tracking layout:", err);
    res.status(500).json({ error: "Failed to securely write profile to system nodes." });
  }
});

router.post("/submit-attendance-summary", async (req, res) => {
  try {
    const { tenderId } = req.body;

    if (!tenderId) {
      return res.status(400).json({ error: "Missing active project Tender ID parameters." });
    }

    await Worker.updateMany(
      { tenderId: tenderId },
      { $set: { isPresentToday: true } }
    );

    res.status(200).json({ success: true, message: "Attendance registers updated successfully!" });
  } catch (err) {
    console.error("MongoDB verification exception:", err);
    res.status(500).json({ error: "Internal server infrastructure sync layout error." });
  }
});

export default router;