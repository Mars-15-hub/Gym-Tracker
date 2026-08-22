import Workout from "../model/schema/workoutSchema.js";
import WorkoutExercise from "../model/schema/workoutExerciseSchema.js";
import Set from "../model/schema/setSchema.js";

const getWorkoutStats = async (req, res) => {
  try {
    const { muscleGroup } = req.query;

    const workouts = await Workout.find();

    let workoutExercises;

    if (muscleGroup) {
      workoutExercises = await WorkoutExercise.find()
        .populate({
          path: "exercise",
          match: {
            muscleGroup,
          },
        });

      workoutExercises = workoutExercises.filter(
        (workoutExercise) => workoutExercise.exercise
      );
    } else {
      workoutExercises = await WorkoutExercise.find();
    }

    const workoutExerciseIds = workoutExercises.map(
      (workoutExercise) => workoutExercise._id
    );

    const sets = await Set.find({
      workoutExercise: {
        $in: workoutExerciseIds,
      },
    });

    const totalSets = sets.length;

    const totalVolume = sets.reduce(
      (total, set) => total + set.weight * set.reps,
      0
    );

    res.status(200).json({
      totalWorkouts: workouts.length,
      totalSets,
      totalVolume,
      muscleGroup: muscleGroup || "All",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate workout statistics",
      error: error.message,
    });
  }
};

export {
  getWorkoutStats,
};