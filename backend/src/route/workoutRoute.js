import express from "express";

import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutExercises,
} from "../controller/workoutController.js";

import {
  createWorkoutExercise,
  deleteWorkoutExercise,
} from "../controller/workoutExerciseController.js";

const router = express.Router();

router.post("/", createWorkout);
router.get("/", getWorkouts);
router.get("/:id/exercises", getWorkoutExercises);
router.get("/:id", getWorkoutById);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

router.post("/:workoutId/exercises", createWorkoutExercise);
router.delete(
  "/:workoutId/exercises/:exerciseId",
  deleteWorkoutExercise
);

export default router;