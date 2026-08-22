import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getExercises } from "../controller/exerciseController.js";

const router = express.Router();

router.get("/", protect, getExercises);

export default router;