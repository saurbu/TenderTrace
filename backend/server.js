import express from "express";
import cors from "cors";
import { resolve } from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import tenderRoutes from "./routes/tenderRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import attendanceRoutes from "./routes/attendance.js";
import materialRoutes from "./routes/materialRoutes.js"; 
import path from "path";
import imageRoutes from "./routes/imageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config({ path: resolve(process.cwd(), ".env") });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static(path.join(process.cwd(), "uploads"))
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
app.use("/api/complaints", complaintRoutes);