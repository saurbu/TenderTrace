import Tender from "../models/Tender.js";
import bcrypt from "bcrypt";
import {
  generateTenderId,
  generatePassword
} from "../utils/generateCredentials.js";
export const getTenderId = async (req, res) => {
  try {
    const tenderId = await generateTenderId();
    res.status(200).json({
      success: true,
      tenderId
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
export const getAllTenders = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {}
    if (email) {
      query.email = email.trim().toLowerCase();
    }
    const tenders = await Tender
      .find(query)
      .sort({ createdAt: -1 });
    const formatted = tenders.map((t) => {
      const startDate = new Date(t.createdAt);
      const endDate = new Date(startDate);
      endDate.setMonth(
        endDate.getMonth() + Number(t.timePeriod || 0)
      );
      return {

        _id: t._id,
        id: t.id,
        tenderName: t.tenderName,
        companyName: t.companyName,
        email: t.email,
        location: t.location,
        status: t.status || "Pending",
        pin: t.pin,
        budget: `₹ ${(Number(t.budget) / 10000000).toFixed(2)} Cr`,
        timePeriod: t.timePeriod,
        date: startDate.toLocaleDateString("en-GB"),
        startDate: startDate.toLocaleDateString("en-GB"),
        endDate: endDate.toLocaleDateString("en-GB")
      };
    });

    res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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


    if (
      !id ||
      !tenderName ||
      !companyName ||
      !email
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }
    const existingTender = await Tender.findOne({
      id
    });
    if (existingTender) {
      return res.status(400).json({
        success: false,
        message: "Tender ID already exists"
      });

    }
    const rawPassword = generatePassword(
      email,
      id
    );

    const hashedPassword = await bcrypt.hash(
      String(rawPassword),
      10
    );
    const pin = Math.floor(
      100000 + Math.random() * 900000
    ).toString();


    const tender = new Tender({
      id,
      tenderName,
      companyName,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      budget: Number(budget),
      timePeriod: Number(timePeriod),
      location,
      pin,
      status: "Pending"
    });
    await tender.save();
    res.status(201).json({
      success: true,
      message: "Tender Created Successfully",
      tenderId: id,
      password: rawPassword,
      pin
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const loginConstructor = async (req, res) => {

  try {
    const {
      email,
      password
    } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await Tender.findOne({
      email: email.trim().toLowerCase()
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }
    const isMatch = await bcrypt.compare(
      String(password),
      String(user.password)
    );
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });

    }

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        email: user.email,
        pin: user.pin
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
export const updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTender =
      await Tender.findOneAndUpdate(
        { id },
        req.body,
        { new: true }
      );

    if (!updatedTender) {

      return res.status(404).json({
        success: false,
        message: "Tender not found"
      });

    }

    res.status(200).json({
      success: true,
      data: updatedTender
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};