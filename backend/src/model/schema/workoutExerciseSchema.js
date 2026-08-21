import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WorkoutExerciseSchema = new Schema({
  workout: {
    type: Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },

  exercise: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },

  order: {
    type: Number,
    required: true,
    min: 1,
  },

  timeCreated: {
    type: Date,
    default: Date.now,
  },
});

const WorkoutExercise = mongoose.model(
  "WorkoutExercise",
  WorkoutExerciseSchema
);

export default WorkoutExercise;