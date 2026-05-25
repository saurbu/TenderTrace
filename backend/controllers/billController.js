import Bill from "../models/Bill.js";
import bcrypt from "bcrypt";

/* -----------------------------
   GENERATE BILL ID
----------------------------- */
export const generateBillId = async (req, res) => {

  try {

    const year = new Date().getFullYear();

    const lastBill =
      await Bill.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    // ✅ IMPORTANT FIX
    if (lastBill && lastBill.id) {

      const parts = lastBill.id.split("_");

      nextNumber =
        parseInt(parts[1]) + 1;

    }

    const billId =
      `B${year}_${String(nextNumber).padStart(4, "0")}`;

    res.json({
      success: true,
      billId
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

/* -----------------------------
   CREATE BILL
----------------------------- */
export const createBill = async (req, res) => {

  try {

    const {
      id,
      billTitle,
      department,
      status,
      location,
      wardNo,
      targetDate,
      budget,
      summary,
      email
    } = req.body;

    // ✅ PASSWORD
    const rawPassword =
      email.split("@")[0] + id.slice(-4);

    // ❌ DO NOT HASH HERE
    // MODEL WILL HASH AUTOMATICALLY

    // ✅ PIN
    const pin =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    const bill = new Bill({

      id,

      billTitle,

      department,

      status,

      location,

      wardNo,

      targetDate,

      budget,

      summary,

      email: email.trim().toLowerCase(),

      password: rawPassword,

      pin

    });

    await bill.save();

    res.json({

      success: true,

      message: "Bill Created Successfully",

      billId: id,

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

/* -----------------------------
   GET ALL BILLS
----------------------------- */
export const getAllBills = async (req, res) => {

  try {

    const { email } = req.query;

    const query =
      email
        ? {
            email:
              email.trim().toLowerCase()
          }
        : {};

    const bills =
      await Bill.find(query)
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bills
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

/* -----------------------------
   BILL LOGIN
----------------------------- */

export const loginBillUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // CHECK USER
    const user = await Bill.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "Bill User Not Found"
      });

    }

    // COMPARE PASSWORD
    const isMatch =
      await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      });

    }

    res.json({

      success: true,

      message: "Login Successful",

      user: {
        id: user.id,
        email: user.email,
        billTitle: user.billTitle
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};