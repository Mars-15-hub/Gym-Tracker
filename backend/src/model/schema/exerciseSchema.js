import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  muscleGroup: {
    type: String,
    required: true,
    enum: [
      "Chest",
      "Back",
      "Shoulders",
      "Biceps",
      "Triceps",
      "Legs",
      "Glutes",
      "Core",
      "Cardio",
    ],
  },

  timeCreated: {
    type: Date,
    default: Date.now,
  },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;