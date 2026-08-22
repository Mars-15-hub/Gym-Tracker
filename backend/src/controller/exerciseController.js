import Exercise from "../model/schema/exerciseSchema.js";

const getExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });

    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
};

export { getExercises };
