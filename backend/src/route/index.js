import express from "express";
import workoutRoutes from "./workoutRoute.js";
import workoutExerciseRoutes from "./workoutExerciseRoute.js";
import setRoutes from "./setRoute.js";


export const router = express.Router();

router.use("/api/workouts", workoutRoutes);
router.use("/api/workout-exercises", workoutExerciseRoutes);
router.use("/api/sets", setRoutes);
