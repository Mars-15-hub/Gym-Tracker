import Workout from "../model/schema/workoutSchema.js";
import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";
import Set from "../model/schema/setSchema.js";

const getOwnedWorkoutExercise = async (
  workoutExerciseId,
  userId
) => {
  const workoutExercise = await WorkoutExercise.findById(
    workoutExerciseId
  );

  if (!workoutExercise) {
    return null;
  }

  const workout = await Workout.findOne({
    _id: workoutExercise.workout,
    user: userId,
  });

  if (!workout) {
    return null;
  }

  return workoutExercise;
};

const getSets = async (req, res) => {
  try {
    const { workoutExerciseId } = req.params;

    const workoutExercise = await getOwnedWorkoutExercise(
      workoutExerciseId,
      req.user._id
    );

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Workout exercise not found",
      });
    }

    const sets = await Set.find({
      workoutExercise: workoutExerciseId,
    }).sort({ setNumber: 1 });

    res.status(200).json(sets);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout exercise ID",
      });
    }

    res.status(500).json({
      message: "Failed to fetch sets",
      error: error.message,
    });
  }
};

const createSet = async (req, res) => {
  try {
    const { workoutExerciseId } = req.params;
    const { setNumber, weight, reps } = req.body;

    if (
      setNumber === undefined ||
      weight === undefined ||
      reps === undefined
    ) {
      return res.status(400).json({
        message: "Set number, weight and reps are required",
      });
    }

    if (setNumber < 1 || weight < 0 || reps < 1) {
      return res.status(400).json({
        message: "Invalid set values",
      });
    }

    const workoutExercise = await getOwnedWorkoutExercise(
      workoutExerciseId,
      req.user._id
    );

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Workout exercise not found",
      });
    }

    const set = await Set.create({
      workoutExercise: workoutExerciseId,
      setNumber,
      weight,
      reps,
    });

    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create set",
      error: error.message,
    });
  }
};

const updateSet = async (req, res) => {
  try {
    const { setNumber, weight, reps } = req.body;

    if (
      setNumber === undefined ||
      weight === undefined ||
      reps === undefined
    ) {
      return res.status(400).json({
        message: "Set number, weight and reps are required",
      });
    }

    if (setNumber < 1 || weight < 0 || reps < 1) {
      return res.status(400).json({
        message: "Invalid set values",
      });
    }

    const set = await Set.findById(req.params.id);

    if (!set) {
      return res.status(404).json({
        message: "Set not found",
      });
    }

    const workoutExercise = await getOwnedWorkoutExercise(
      set.workoutExercise,
      req.user._id
    );

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Set not found",
      });
    }

    set.setNumber = setNumber;
    set.weight = weight;
    set.reps = reps;

    await set.save();

    res.status(200).json(set);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid set ID",
      });
    }

    res.status(500).json({
      message: "Failed to update set",
      error: error.message,
    });
  }
};

const deleteSet = async (req, res) => {
  try {
    const set = await Set.findById(req.params.id);

    if (!set) {
      return res.status(404).json({
        message: "Set not found",
      });
    }

    const workoutExercise = await getOwnedWorkoutExercise(
      set.workoutExercise,
      req.user._id
    );

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Set not found",
      });
    }

    await Set.findByIdAndDelete(set._id);

    res.status(200).json({
      message: "Set deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid set ID",
      });
    }

    res.status(500).json({
      message: "Failed to delete set",
      error: error.message,
    });
  }
};

export {
  getSets,
  createSet,
  updateSet,
  deleteSet,
};