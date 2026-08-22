import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";
import Set from "../model/schema/setSchema.js";

const getSets = async (req, res, next) => {
  try {
    const { workoutExerciseId } = req.params;

    const workoutExercise = await WorkoutExercise.findById(workoutExerciseId);

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

    next(error);
  }
};

const createSet = async (req, res, next) => {
  try {
    const { setNumber, weight, reps } = req.body;
    const { workoutExerciseId } = req.params;

    if (setNumber === undefined || weight === undefined || reps === undefined) {
      return res.status(400).json({
        message: "Set number, weight and reps are required",
      });
    }

    if (setNumber < 1) {
      return res.status(400).json({
        message: "Set number must be at least 1",
      });
    }

    if (weight < 0) {
      return res.status(400).json({
        message: "Weight cannot be negative",
      });
    }

    if (reps < 1) {
      return res.status(400).json({
        message: "Reps must be at least 1",
      });
    }

    const workoutExercise = await WorkoutExercise.findById(workoutExerciseId);

    if (!workoutExercise) {
      return res.status(404).json({
        message: "Workout exercise not found",
      });
    }

    const newSet = await Set.create({
      workoutExercise: workoutExerciseId,
      setNumber,
      weight,
      reps,
    });

    res.status(201).json(newSet);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout exercise ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid set data",
        error: error.message,
      });
    }

    next(error);
  }
};

const updateSet = async (req, res, next) => {
  try {
    const { setNumber, weight, reps } = req.body;

    if (setNumber === undefined || weight === undefined || reps === undefined) {
      return res.status(400).json({
        message: "Set number, weight and reps are required",
      });
    }

    if (setNumber < 1 || weight < 0 || reps < 1) {
      return res.status(400).json({
        message: "Invalid set values",
      });
    }

    const updatedSet = await Set.findByIdAndUpdate(
      req.params.id,
      {
        setNumber,
        weight,
        reps,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSet) {
      return res.status(404).json({
        message: "Set not found",
      });
    }

    res.status(200).json(updatedSet);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid set ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid set data",
        error: error.message,
      });
    }

    next(error);
  }
};

const deleteSet = async (req, res, next) => {
  try {
    const deletedSet = await Set.findByIdAndDelete(req.params.id);

    if (!deletedSet) {
      return res.status(404).json({
        message: "Set not found",
      });
    }

    res.status(200).json({
      message: "Set deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid set ID",
      });
    }

    next(error);
  }
};

export { getSets, createSet, updateSet, deleteSet };
