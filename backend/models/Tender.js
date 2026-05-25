import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  tenderName: String,
  companyName: String,
  email: {
    type: String,
    required: true
  },
  password: String,
  budget: Number,
  timePeriod: Number,
  location: String,
  status: {
    type: String,
    default: "Pending"
  },
  // ✅ ADDED - was missing, caused pin to never save or return
  pin: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("Tender", tenderSchema);
