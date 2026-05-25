import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import tenderRoutes from "./routes/tenderRoutes.js";
import billRoutes from "./routes/billRoutes.js";

// REMOVE THESE IF FILES DON'T EXIST
// import complaintRoutes from "./routes/complaintRoutes.js";
// import workerRoutes from "./routes/workerRoutes.js";
// import billRoutes from "./routes/billRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/bills", billRoutes)

/* ================= ROUTES ================= */

app.use("/api/tenders", tenderRoutes);

// ENABLE ONLY IF FILE EXISTS
// app.use("/api/bills", billRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/workers", workerRoutes);

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("API Running ✅");
});

/* ================= SERVER ================= */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});