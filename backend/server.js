import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import tenderRoutes from "./routes/tenderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/tender", tenderRoutes);

// ✅ TEST ROUTE (VERY IMPORTANT FOR DEBUG)
app.get("/", (req, res) => {
  res.send("API Running ✅");
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});