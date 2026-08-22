import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getSets,
  createSet,
} from "../controller/setController.js";

const router = express.Router();

router.get("/:workoutExerciseId/sets", protect, getSets);
router.post("/:workoutExerciseId/sets", protect, createSet);

export default router;