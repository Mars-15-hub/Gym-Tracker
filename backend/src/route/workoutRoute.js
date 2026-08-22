import express from "express";

import protect from "../middleware/authMiddleware.js";

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

router.post("/", protect, createWorkout);

router.get("/", protect, getWorkouts);

router.get(
  "/:id/exercises",
  protect,
  getWorkoutExercises
);

router.get(
  "/:id",
  protect,
  getWorkoutById
);

router.put(
  "/:id",
  protect,
  updateWorkout
);

router.delete(
  "/:id",
  protect,
  deleteWorkout
);

router.post(
  "/:workoutId/exercises",
  protect,
  createWorkoutExercise
);

router.delete(
  "/:workoutId/exercises/:workoutExerciseId",
  protect,
  deleteWorkoutExercise
);

export default router;