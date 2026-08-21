
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

import User from "./src/model/schema/userSchema.js";
import Exercise from "./src/model/schema/exerciseSchema.js";
import Workout from "./src/model/schema/workoutSchema.js";
import WorkoutExercise from "./src/model/schema/workoutExerciseSchema.js";
import Set from "./src/model/schema/setSchema.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Exercise.deleteMany();
    await Workout.deleteMany();
    await WorkoutExercise.deleteMany();
    await Set.deleteMany();

    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
      },
    ]);

    const exercises = await Exercise.insertMany([
      {
        name: "Bench Press",
        muscleGroup: "Chest",
      },
      {
        name: "Squat",
        muscleGroup: "Legs",
      },
      {
        name: "Deadlift",
        muscleGroup: "Back",
      },
      {
        name: "Shoulder Press",
        muscleGroup: "Shoulders",
      },
      {
        name: "Barbell Row",
        muscleGroup: "Back",
      },
      {
        name: "Bicep Curl",
        muscleGroup: "Biceps",
      },
      {
        name: "Tricep Pushdown",
        muscleGroup: "Triceps",
      },
      {
        name: "Leg Press",
        muscleGroup: "Legs",
      },
      {
        name: "Incline Dumbbell Press",
        muscleGroup: "Chest",
      },
      {
        name: "Plank",
        muscleGroup: "Core",
      },
    ]);

    const workouts = await Workout.insertMany([
      {
        user: users[0]._id,
        name: "Push Day",
        date: new Date("2026-08-18"),
        duration: 3600,
      },
      {
        user: users[0]._id,
        name: "Leg Day",
        date: new Date("2026-08-20"),
        duration: 4200,
      },
      {
        user: users[1]._id,
        name: "Upper Body",
        date: new Date("2026-08-19"),
        duration: 3600,
      },
    ]);

    const workoutExercises = await WorkoutExercise.insertMany([
      {
        workout: workouts[0]._id,
        exercise: exercises[0]._id,
        order: 1,
      },
      {
        workout: workouts[0]._id,
        exercise: exercises[8]._id,
        order: 2,
      },
      {
        workout: workouts[0]._id,
        exercise: exercises[3]._id,
        order: 3,
      },
      {
        workout: workouts[0]._id,
        exercise: exercises[6]._id,
        order: 4,
      },
      {
        workout: workouts[1]._id,
        exercise: exercises[1]._id,
        order: 1,
      },
      {
        workout: workouts[1]._id,
        exercise: exercises[7]._id,
        order: 2,
      },
      {
        workout: workouts[2]._id,
        exercise: exercises[4]._id,
        order: 1,
      },
      {
        workout: workouts[2]._id,
        exercise: exercises[5]._id,
        order: 2,
      },
    ]);

    await Set.insertMany([
      {
        workoutExercise: workoutExercises[0]._id,
        setNumber: 1,
        weight: 60,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[0]._id,
        setNumber: 2,
        weight: 70,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[0]._id,
        setNumber: 3,
        weight: 75,
        reps: 6,
      },
      {
        workoutExercise: workoutExercises[1]._id,
        setNumber: 1,
        weight: 20,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[1]._id,
        setNumber: 2,
        weight: 22.5,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[1]._id,
        setNumber: 3,
        weight: 22.5,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[2]._id,
        setNumber: 1,
        weight: 30,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[2]._id,
        setNumber: 2,
        weight: 35,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[3]._id,
        setNumber: 1,
        weight: 30,
        reps: 12,
      },
      {
        workoutExercise: workoutExercises[3]._id,
        setNumber: 2,
        weight: 35,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[4]._id,
        setNumber: 1,
        weight: 80,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[4]._id,
        setNumber: 2,
        weight: 90,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[4]._id,
        setNumber: 3,
        weight: 100,
        reps: 6,
      },
      {
        workoutExercise: workoutExercises[5]._id,
        setNumber: 1,
        weight: 120,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[5]._id,
        setNumber: 2,
        weight: 140,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[6]._id,
        setNumber: 1,
        weight: 50,
        reps: 10,
      },
      {
        workoutExercise: workoutExercises[6]._id,
        setNumber: 2,
        weight: 60,
        reps: 8,
      },
      {
        workoutExercise: workoutExercises[7]._id,
        setNumber: 1,
        weight: 12.5,
        reps: 12,
      },
      {
        workoutExercise: workoutExercises[7]._id,
        setNumber: 2,
        weight: 15,
        reps: 10,
      },
    ]);

    console.log("Gym tracker database seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();