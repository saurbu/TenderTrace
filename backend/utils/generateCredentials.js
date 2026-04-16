import Tender from "../models/Tender.js";

// ✅ Generate Tender ID (T2026_0001)
export const generateTenderId = async () => {
  const year = new Date().getFullYear();

  const lastTender = await Tender.findOne({
    id: { $regex: `T${year}` }
  }).sort({ createdAt: -1 });

  let number = 1;

  if (lastTender) {
    const lastNum = parseInt(lastTender.id.split("_")[1]);
    number = lastNum + 1;
  }

  return `T${year}_${String(number).padStart(4, "0")}`;
};

// ✅ Generate Password
export const generatePassword = (email, tenderId) => {
  const prefix = email.substring(0, 4);
  const suffix = tenderId.slice(-4);
  return prefix + suffix;
};