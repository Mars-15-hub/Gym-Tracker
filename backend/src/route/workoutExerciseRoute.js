import express from "express";

import {
  getSets,
  createSet,
} from "../controller/setController.js";

const router = express.Router();

router.get("/:workoutExerciseId/sets", getSets);
router.post("/:workoutExerciseId/sets", createSet);

export default router;