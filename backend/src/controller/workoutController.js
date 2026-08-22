import Workout from "../model/schema/workoutSchema.js";
import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";
import Set from "../model/schema/setSchema.js";
import User from "../model/schema/userSchema.js";

const createWorkout = async (req, res, next) => {
  try {
    const { user, name, date, duration } = req.body;

    if (!user || !name) {
      return res.status(400).json({
        message: "User and workout name are required",
      });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        message: "Workout name must contain at least 2 characters",
      });
    }

    if (
      duration !== undefined &&
      (typeof duration !== "number" || duration < 0)
    ) {
      return res.status(400).json({
        message: "Duration must be a positive number",
      });
    }

    const workout = await Workout.create({
      user,
      name: name.trim(),
      date,
      duration,
    });

    res.status(201).json(workout);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid workout data",
        error: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    next(error);
  }
};

const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find().populate("user").sort({ date: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id).populate("user");

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json(workout);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout ID",
      });
    }

    next(error);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const { name, date, duration } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workout name is required",
      });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        message: "Workout name must contain at least 2 characters",
      });
    }

    if (
      duration !== undefined &&
      (typeof duration !== "number" || duration < 0)
    ) {
      return res.status(400).json({
        message: "Duration must be a positive number",
      });
    }

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        date,
        duration,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("user");

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json(workout);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid workout data",
        error: error.message,
      });
    }

    next(error);
  }
};

const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const workoutExercises = await WorkoutExercise.find({
      workout: req.params.id,
    });

    const workoutExerciseIds = workoutExercises.map(
      (workoutExercise) => workoutExercise._id,
    );

    await Set.deleteMany({
      workoutExercise: { $in: workoutExerciseIds },
    });

    await WorkoutExercise.deleteMany({
      workout: req.params.id,
    });

    res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout ID",
      });
    }

    next(error);
  }
};

const getWorkoutExercises = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const workoutExercises = await WorkoutExercise.find({
      workout: req.params.id,
    })
      .populate("exercise")
      .sort({ order: 1 });

    const exercisesWithSets = await Promise.all(
      workoutExercises.map(async (workoutExercise) => {
        const sets = await Set.find({
          workoutExercise: workoutExercise._id,
        }).sort({ setNumber: 1 });

        return {
          ...workoutExercise.toObject(),
          sets,
        };
      })
    );

    res.status(200).json(exercisesWithSets);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout ID",
      });
    }

    next(error);
  }
};


export {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutExercises,
};
