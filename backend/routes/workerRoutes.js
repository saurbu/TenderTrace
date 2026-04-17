import express from "express";
import Worker from "../models/Worker.js";

const router = express.Router();

// Get all workers for a specific project workspace
router.get("/project/:tenderId", async (req, res) => {
  try {
    const workers = await Worker.find({ tenderId: req.params.tenderId }).sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Register a new worker
router.post("/", async (req, res) => {
  try {
    const worker = new Worker(req.body);
    const createdWorker = await worker.save();
    res.status(201).json(createdWorker);
  } catch (error) {
    res.status(400).json({ message: "Invalid Worker Data", error });
  }
});

// Delete a worker (optional utility)
router.delete("/:id", async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: "Worker removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting worker" });
  }
});

export default router;
