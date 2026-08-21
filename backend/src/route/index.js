import express from "express";
import workoutRoutes from "./workoutRoute.js";

export const router = express.Router();

router.use("/api/workouts", workoutRoutes);
