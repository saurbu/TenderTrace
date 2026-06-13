import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/*
  SAVE ATTENDANCE
*/
router.post("/submit", async (req, res) => {
  try {
    const {
      tenderId,
      date,
      shift,
      records,
      totalWorkers,
      presentWorkers,
      absentWorkers,
    } = req.body;

    if (!tenderId || !date || !shift) {
      return res.status(400).json({
        success: false,
        error: "tenderId, date and shift are required",
      });
    }

    const parsedRecords =
      typeof records === "string"
        ? JSON.parse(records)
        : records || [];

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      tenderId: String(tenderId),
      shift,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        error: "Attendance already submitted for this shift.",
      });
    }

    const attendance = await Attendance.create({
      tenderId: String(tenderId),
      date: startDate,
      shift,
      totalWorkers: Number(totalWorkers) || 0,
      presentWorkers: Number(presentWorkers) || 0,
      absentWorkers: Number(absentWorkers) || 0,
      records: parsedRecords,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance saved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("SAVE ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
  DASHBOARD SUMMARY
*/
router.get("/dashboard-summary/:tenderId", async (req, res) => {
  try {
    const { tenderId } = req.params;

    const data = await Attendance.find({
      tenderId: String(tenderId),
    })
      .select(
        "date shift totalWorkers presentWorkers absentWorkers"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
router.get("/status/:tenderId", async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { date } = req.query;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      tenderId: String(tenderId),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const morning = records.find(r =>
      r.shift?.toLowerCase().includes("morning")
    );

    const evening = records.find(r =>
      r.shift?.toLowerCase().includes("evening")
    );

    res.status(200).json({
      morning: morning
        ? {
            total: morning.totalWorkers,
            present: morning.presentWorkers,
          }
        : null,

      evening: evening
        ? {
            total: evening.totalWorkers,
            present: evening.presentWorkers,
          }
        : null,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});
/*
  GET SINGLE ATTENDANCE SHEET
*/
router.get("/:tenderId/:date/:shift", async (req, res) => {
  try {
    const { tenderId, date, shift } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      tenderId: String(tenderId),
      shift,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (!attendance) {
      return res.status(200).json({
        found: false,
      });
    }

    return res.status(200).json({
      found: true,
      shift: attendance.shift,
      totalWorkers: attendance.totalWorkers,
      presentWorkers: attendance.presentWorkers,
      absentWorkers: attendance.absentWorkers,
      attendanceList: attendance.records || [],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      found: false,
      error: error.message,
    });
  }
});

export default router;