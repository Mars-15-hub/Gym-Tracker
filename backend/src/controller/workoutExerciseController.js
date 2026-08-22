import Workout from "../model/schema/workoutSchema.js";
import Exercise from "../model/schema/exerciseSchema.js";
import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";

const createWorkoutExercise = async (req, res, next) => {
  try {
    const { exercise, order } = req.body;
    const { workoutId } = req.params;

    if (!exercise) {
      return res.status(400).json({
        message: "Exercise is required",
      });
    }

    const workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const existingExercise = await Exercise.findById(exercise);

    if (!existingExercise) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    const workoutExercise = await WorkoutExercise.create({
      workout: workoutId,
      exercise,
      order: order || 1,
    });

    const populatedWorkoutExercise =
      await workoutExercise.populate("exercise");

    res.status(201).json(populatedWorkoutExercise);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout or exercise ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid workout exercise data",
        error: error.message,
      });
    }

    next(error);
  }
};

const deleteWorkoutExercise = async (req, res, next) => {
  try {
    const { workoutId, exerciseId } = req.params;

    const workoutExercise = await WorkoutExercise.findOneAndDelete({
      workout: workoutId,
      _id: exerciseId,
    });

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Workout exercise not found",
      });
    }

    res.status(200).json({
      message: "Exercise removed from workout successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout or workout exercise ID",
      });
    }

    next(error);
  }
};

export {
  createWorkoutExercise,
  deleteWorkoutExercise,
};