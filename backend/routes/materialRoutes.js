import express from "express";
import MaterialReport from "../models/MaterialReport.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { date, materials, totalSpend, tenderId } = req.body;
    if (!date || !tenderId) {
      return res.status(400).json({ message: "date and tenderId required" });
    }
    const normalizedDate = new Date(date).toISOString().split("T")[0];
    const report = await MaterialReport.findOneAndUpdate(
      { tenderId, date: normalizedDate },
      {
        tenderId,
        date: normalizedDate,
        materials: materials || [],
        totalSpend: totalSpend || 0,
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/single/:tenderId/:date", async (req, res) => {
  const { tenderId, date } = req.params;

  const normalizedDate = new Date(date).toISOString().split("T")[0];

  const data = await MaterialReport.findOne({
    tenderId,
    date: normalizedDate,
  });

  res.json({
    success: true,
    data: data || null,
  });
});

router.get("/all/:tenderId", async (req, res) => {
  try {
    const data = await MaterialReport.find({
      tenderId: req.params.tenderId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;