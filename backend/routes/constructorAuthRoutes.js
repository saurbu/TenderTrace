import express from "express";
import Tender from "../models/Tender.js";
import Bill from "../models/Bill.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Tender.findOne({ email, password });
    if (!user) {
      user = await Bill.findOne({ email, password });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found or invalid credentials"
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        source: user.billId ? "bill" : "tender",
        id: user._id
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;