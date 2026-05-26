import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  tenderId: { type: String, required: true },
  name: { type: String, required: true },
  aadhaar: { type: String, required: true },
  designation: { type: String, required: true },
  address: { type: String, required: true },
  imageUrl: { type: String, default: "" }
}, { timestamps: true });

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
