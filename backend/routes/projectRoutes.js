import express from "express";
import MaterialReport from "../models/MaterialReport.js";
import Attendance from "../models/Attendance.js";
import Tender from "../models/Tender.js";
import Bill from "../models/Bill.js";

const router = express.Router();

const getProject = async (id) => {
  return (
    (await Tender.findOne({ id }).lean()) ||
    (await Tender.findOne({ tenderId: id }).lean()) ||
    (await Bill.findOne({ id }).lean()) ||
    (await Bill.findOne({ billId: id }).lean())
  );
};

const getProjectId = (project) => {
  return project?.id || project?.tenderId || project?.billId;
};

router.get("/:id/details", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await getProject(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    const projectId = getProjectId(project);
    const materialHistory = await MaterialReport.find({
      tenderId: String(projectId),
    }).sort({ createdAt: -1 });

    const attendanceRecords = await Attendance.find({
      tenderId: String(projectId),
    }).lean();

    const morning = attendanceRecords.find((r) =>
      r.shift?.toLowerCase().includes("morning")
    );

    const evening = attendanceRecords.find((r) =>
      r.shift?.toLowerCase().includes("evening")
    );

    return res.json({
      success: true,
      data: {
        project,
        materialHistory,
        attendance: {
          morning: morning
            ? {
                total: morning.totalWorkers,
                present: morning.presentWorkers,
                absent: morning.absentWorkers,
                attendanceList: morning.records || [],
              }
            : null,

          evening: evening
            ? {
                total: evening.totalWorkers,
                present: evening.presentWorkers,
                absent: evening.absentWorkers,
                attendanceList: evening.records || [],
              }
            : null,
        },
      },
    });
  } catch (err) {
    console.error("DETAILS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/:id/details-by-date/:date", async (req, res) => {
  try {
    const id = req.params.id.trim();
    const dateParam = req.params.date.trim();
    const project = await getProject(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const projectId = getProjectId(project);

    const materialHistory = await MaterialReport.find({
      tenderId: String(projectId),
    }).sort({ createdAt: -1 });

    const dailyReport = await MaterialReport.findOne({
      tenderId: String(projectId),
      date: dateParam,
    });

    const startDate = new Date(`${dateParam}T00:00:00.000Z`);
    const endDate = new Date(`${dateParam}T23:59:59.999Z`);

    const attendanceRecords = await Attendance.find({
      tenderId: String(projectId),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    const morningRecords = attendanceRecords.filter((r) =>
      r.shift?.toLowerCase().includes("morning")
    );

    const eveningRecords = attendanceRecords.filter((r) =>
      r.shift?.toLowerCase().includes("evening")
    );

    const morning =
      morningRecords.length > 0 ? morningRecords[0] : null;

    const evening =
      eveningRecords.length > 0 ? eveningRecords[0] : null;

    return res.json({
      success: true,
      data: {
        project,
        materialHistory,
        dailyReport: dailyReport || null,

        attendance: {
          morning: morning
            ? {
                total: morning.totalWorkers,
                present: morning.presentWorkers,
                absent: morning.absentWorkers,
                attendanceList: morning.records || [],
                createdAt: morning.createdAt,
              }
            : null,

          evening: evening
            ? {
                total: evening.totalWorkers,
                present: evening.presentWorkers,
                absent: evening.absentWorkers,
                attendanceList: evening.records || [],
                createdAt: evening.createdAt,
              }
            : null,
        },
      },
    });
  } catch (err) {
    console.error("DETAILS-BY-DATE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;