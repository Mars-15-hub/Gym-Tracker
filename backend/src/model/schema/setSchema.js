import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SetSchema = new Schema({
  workoutExercise: {
    type: Schema.Types.ObjectId,
    ref: "WorkoutExercise",
    required: true,
  },

  setNumber: {
    type: Number,
    required: true,
    min: 1,
  },

  weight: {
    type: Number,
    required: true,
    min: 0,
  },

  reps: {
    type: Number,
    required: true,
    min: 1,
  },

  timeCreated: {
    type: Date,
    default: Date.now,
  },
});

const Set = mongoose.model("Set", SetSchema);

export default Set;