import express from "express";

import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
} from "../controller/workoutController.js";

const router = express.Router();

router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;