import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  tenderId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: String, required: true }
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
