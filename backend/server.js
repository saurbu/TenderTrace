import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import tenderRoutes from "./routes/tenderRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import attendanceRoutes from "./routes/attendance.js";
import materialRoutes from "./routes/materialRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "https://tender-trace-h1y818ca0-ss0619963-5893s-projects.vercel.app",
    "https://tender-trace.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


app.use("/api/tenders", tenderRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/complaints", complaintRoutes);


app.get("/", (req, res) => {
  res.send("API Running ✅");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});