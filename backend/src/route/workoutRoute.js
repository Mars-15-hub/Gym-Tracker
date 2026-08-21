import express from "express";

import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
} from "../controller/workoutController.js";

const router = express.Router();

router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);

export default router;