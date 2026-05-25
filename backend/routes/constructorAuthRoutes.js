import express from "express";
import Tender from "../models/Tender.js";
import Bill from "../models/Bill.js";

const router = express.Router();

// LOGIN (check BOTH Tender + Bill)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check Tender collection
    let user = await Tender.findOne({ email, password });

    // 2. if not found, check Bill collection
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