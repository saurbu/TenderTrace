import express from "express";

import {
  generateBillId,
  createBill,
  getAllBills,
  loginBillUser,
  getBillById
} from "../controllers/billController.js";

const router = express.Router();

router.get("/generate-id", generateBillId);

router.post("/create", createBill);

router.get("/all", getAllBills);

router.post("/login", loginBillUser);

router.get("/:id", getBillById);

export default router;