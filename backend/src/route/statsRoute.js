import express from "express";

import {
  getWorkoutStats,
} from "../controller/statsController.js";

const router = express.Router();

router.get("/workouts", getWorkoutStats);

export default router;