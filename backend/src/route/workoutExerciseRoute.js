import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getSets,
  createSet,
} from "../controller/setController.js";

import {
  updateWorkoutExercise,
} from "../controller/workoutExerciseController.js";

const router = express.Router();

router.get(
  "/:workoutExerciseId/sets",
  protect,
  getSets
);

router.post(
  "/:workoutExerciseId/sets",
  protect,
  createSet
);

router.put(
  "/:workoutExerciseId",
  protect,
  updateWorkoutExercise
);

export default router;