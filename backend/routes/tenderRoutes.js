import express from "express";
import {
  getTenderId,
  createTender,
  loginConstructor,
  updateTender,
  getAllTenders
} from "../controllers/tenderController.js";

const router = express.Router();

router.get("/generate-id", getTenderId);
router.post("/create", createTender);
router.post("/login", loginConstructor);
router.put("/:id", updateTender);
router.get("/all", getAllTenders);

export default router;