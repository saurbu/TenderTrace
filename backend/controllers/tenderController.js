import Tender from "../models/Tender.js";
import bcrypt from "bcrypt";
import { generateTenderId, generatePassword } from "../utils/generateCredentials.js";

// ✅ Generate Tender ID
export const getTenderId = async (req, res) => {
  try {
    const tenderId = await generateTenderId();
    res.json({ tenderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL / FILTERED TENDERS
export const getAllTenders = async (req, res) => {
  try {
    const { email } = req.query;

    let tenders;

    if (email) {
      tenders = await Tender.find({ email }).sort({ createdAt: -1 });
    } else {
      tenders = await Tender.find().sort({ createdAt: -1 });
    }

    const formatted = tenders.map(t => {
      const startDate = new Date(t.createdAt);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (t.timePeriod || 0));

      return {
        id: t.id,
        tenderName: t.tenderName,
        companyName: t.companyName,
        date: startDate.toLocaleDateString('en-GB'),
        startDate: startDate.toLocaleDateString('en-GB'),
        endDate: endDate.toLocaleDateString('en-GB'),
        timePeriod: t.timePeriod,
        status: t.status,
        locationInfo: t.location,
        budget: `₹ ${(t.budget / 10000000).toFixed(2)} Cr`
      };
    });

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE TENDER (THIS WAS MISSING / BROKEN)
export const createTender = async (req, res) => {
  try {
    const {
      id,
      tenderName,
      companyName,
      email,
      budget,
      timePeriod,
      location
    } = req.body;

    const rawPassword = generatePassword(email, id);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const tender = new Tender({
      id,
      tenderName,
      companyName,
      email,
      password: hashedPassword,
      budget,
      timePeriod,
      location
    });

    await tender.save();

    res.json({
      message: "Tender Created",
      tenderId: id,
      password: rawPassword
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ LOGIN
export const loginConstructor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Tender.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};