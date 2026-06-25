import Bill from "../models/Bill.js";
import bcrypt from "bcrypt";
export const generateBillId = async (req, res) => {

  try {

    const year = new Date().getFullYear();

    const lastBill =
      await Bill.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

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

    if (
      !id ||
      !billTitle ||
      !department ||
      !status ||
      !location ||
      !wardNo ||
      !targetDate ||
      !budget ||
      !summary ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const username = email.split("@")[0];

    const rawPassword =
      username.substring(0, 4) +
      id.slice(-4);

    const pin = (
      Math.floor(Math.random() * 900000) + 100000
    ).toString();

    const bill = await Bill.create({
      id,
      billTitle,
      department,
      status,
      location,
      wardNo,
      targetDate,
      budget,
      summary,
      email: email.toLowerCase(),
      password: rawPassword,
      pin
    });

    return res.status(201).json({
      success: true,
      billId: bill.id,
      password: rawPassword,
      pin
    });

  } catch (error) {
    console.log("CREATE BILL ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

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


export const loginBillUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await Bill.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "Bill User Not Found"
      });

    }

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

export const getBillById = async (req, res) => {
  try {

    const { id } = req.params;

    const bill = await Bill.findOne({
      id: id
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found"
      });
    }

    res.status(200).json({
      success: true,
      data: bill
    });

  } catch (error) {

    console.log("GET BILL ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};