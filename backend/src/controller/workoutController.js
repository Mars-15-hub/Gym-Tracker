import Workout from "../model/schema/workoutSchema.js";
import User from "../model/schema/userSchema.js";

const createWorkout = async (req, res, next) => {
  try {
    const { user, name, date, duration } = req.body;

    if (!user || !name) {
      return res.status(400).json({
        message: "User and workout name are required",
      });
    }

    const workout = await Workout.create({
      user,
      name,
      date,
      duration,
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
};

const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find()
      .populate("user")
      .sort({ date: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate("user");

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const { name, date, duration } = req.body;

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name,
        date,
        duration,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user");

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json(workout);
  } catch (error) {
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

    res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout
};