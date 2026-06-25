import express from "express";
import Tender from "../models/Tender.js";
import Bill from "../models/Bill.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await Tender.findOne({ email, password });
    let role = "tender";
    if (!user) {
      user = await Bill.findOne({ email, password });
      role = "bill";
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role
      },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role,
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;