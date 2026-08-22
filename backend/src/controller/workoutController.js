import Workout from "../model/schema/workoutSchema.js";
import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";
import Set from "../model/schema/setSchema.js";

const createWorkout = async (req, res) => {
  try {
    const { name, date, duration } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workout name is required",
      });
    }

    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        message:
          "Workout name must contain at least 2 characters",
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
      user: req.user._id,
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

    res.status(500).json({
      message: "Failed to create workout",
      error: error.message,
    });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .sort({ date: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workouts",
      error: error.message,
    });
  }
};

const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name email");

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

    res.status(500).json({
      message: "Failed to fetch workout",
      error: error.message,
    });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const { name, date, duration } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Workout name is required",
      });
    }

    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        message:
          "Workout name must contain at least 2 characters",
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

    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        name: name.trim(),
        date,
        duration,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

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

    res.status(500).json({
      message: "Failed to update workout",
      error: error.message,
    });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const workoutExercises =
      await WorkoutExercise.find({
        workout: workout._id,
      });

    const workoutExerciseIds =
      workoutExercises.map(
        (workoutExercise) =>
          workoutExercise._id
      );

    await Set.deleteMany({
      workoutExercise: {
        $in: workoutExerciseIds,
      },
    });

    await WorkoutExercise.deleteMany({
      workout: workout._id,
    });

    await Workout.findByIdAndDelete(
      workout._id
    );

    res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout ID",
      });
    }

    res.status(500).json({
      message: "Failed to delete workout",
      error: error.message,
    });
  }
};

const getWorkoutExercises = async (
  req,
  res
) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    const workoutExercises =
      await WorkoutExercise.find({
        workout: workout._id,
      })
        .populate("exercise")
        .sort({ order: 1 });

    const exercisesWithSets =
      await Promise.all(
        workoutExercises.map(
          async (workoutExercise) => {
            const sets = await Set.find({
              workoutExercise:
                workoutExercise._id,
            }).sort({ setNumber: 1 });

            return {
              ...workoutExercise.toObject(),
              sets,
            };
          }
        )
      );

    res.status(200).json(
      exercisesWithSets
    );
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid workout ID",
      });
    }

    res.status(500).json({
      message:
        "Failed to fetch workout exercises",
      error: error.message,
    });
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