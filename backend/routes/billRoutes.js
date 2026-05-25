import express from "express";

import {

  generateBillId,

  createBill,

  getAllBills,

  loginBillUser

} from "../controllers/billController.js";

const router = express.Router();

/* GENERATE ID */
router.get(
  "/generate-id",
  generateBillId
);

/* CREATE BILL */
router.post(
  "/create",
  createBill
);

/* GET ALL */
router.get(
  "/all",
  getAllBills
);
/* LOGIN */
router.post(
  "/login",
  loginBillUser
);
export default router;