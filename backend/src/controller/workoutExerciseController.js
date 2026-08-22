import Workout from "../model/schema/workoutSchema.js";
import Exercise from "../model/schema/exerciseSchema.js";
import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";
import Set from "../model/schema/setSchema.js";

const createWorkoutExercise = async (req, res) => {
  try {
    const { exercise, order } = req.body;
    const { workoutId } = req.params;

    if (!exercise) {
      return res.status(400).json({
        message: "Exercise is required",
      });
    }

    const workout = await Workout.findOne({
      _id: workoutId,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const exerciseExists = await Exercise.findById(exercise);

    if (!exerciseExists) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    const existingWorkoutExercise =
      await WorkoutExercise.findOne({
        workout: workoutId,
        exercise,
      });

    if (existingWorkoutExercise) {
      return res.status(409).json({
        message: "Exercise is already part of this workout",
      });
    }

    let exerciseOrder = order;

    if (exerciseOrder === undefined) {
      const count = await WorkoutExercise.countDocuments({
        workout: workoutId,
      });

      exerciseOrder = count + 1;
    }

    const workoutExercise = await WorkoutExercise.create({
      workout: workoutId,
      exercise,
      order: exerciseOrder,
    });

    await workoutExercise.populate("exercise");

    res.status(201).json(workoutExercise);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout or exercise ID",
      });
    }

    res.status(500).json({
      message: "Failed to add exercise to workout",
      error: error.message,
    });
  }
};

const updateWorkoutExercise = async (req, res) => {
  try {
    const { workoutExerciseId } = req.params;
    const { exercise, order } = req.body;

    if (!exercise) {
      return res.status(400).json({
        message: "Exercise is required",
      });
    }

    const workoutExercise = await WorkoutExercise.findById(
      workoutExerciseId
    );

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Workout exercise not found",
      });
    }

    const workout = await Workout.findOne({
      _id: workoutExercise.workout,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const exerciseExists = await Exercise.findById(exercise);

    if (!exerciseExists) {
      return res.status(404).json({
        message: "Exercise not found",
      });
    }

    const duplicateExercise = await WorkoutExercise.findOne({
      workout: workout._id,
      exercise,
      _id: { $ne: workoutExerciseId },
    });

    if (duplicateExercise) {
      return res.status(409).json({
        message: "Exercise is already part of this workout",
      });
    }

    workoutExercise.exercise = exercise;

    if (order !== undefined) {
      workoutExercise.order = order;
    }

    await workoutExercise.save();

    await workoutExercise.populate("exercise");

    res.status(200).json(workoutExercise);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout exercise ID",
      });
    }

    res.status(500).json({
      message: "Failed to update workout exercise",
      error: error.message,
    });
  }
};

const deleteWorkoutExercise = async (req, res) => {
  try {
    const { workoutId, workoutExerciseId } = req.params;

    const workout = await Workout.findOne({
      _id: workoutId,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const workoutExercise = await WorkoutExercise.findOne({
      _id: workoutExerciseId,
      workout: workoutId,
    });

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Workout exercise not found",
      });
    }

    await Set.deleteMany({
      workoutExercise: workoutExercise._id,
    });

    await WorkoutExercise.findByIdAndDelete(
      workoutExercise._id
    );

    res.status(200).json({
      message: "Exercise removed from workout successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout exercise ID",
      });
    }

    res.status(500).json({
      message: "Failed to remove exercise from workout",
      error: error.message,
    });
  }
};

export {
  createWorkoutExercise,
  updateWorkoutExercise,
  deleteWorkoutExercise,
};