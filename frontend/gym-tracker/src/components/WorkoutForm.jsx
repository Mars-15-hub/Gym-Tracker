import { useEffect, useState } from "react";

import {
  createWorkout,
  addExerciseToWorkout,
  addSet,
} from "../services/workoutService";

import { getExercises } from "../services/exerciseService";

import useAuth from "../hooks/useAuth";

const WorkoutForm = ({
  onWorkoutCreated,
  onCancel,
}) => {
  const { token } = useAuth();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  const [availableExercises, setAvailableExercises] =
    useState([]);

  const [workoutExercises, setWorkoutExercises] =
    useState([
      {
        exercise: "",
        sets: [
          {
            weight: "",
            reps: "",
          },
        ],
      },
    ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exerciseLoading, setExerciseLoading] =
    useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises(token);

        setAvailableExercises(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setExerciseLoading(false);
      }
    };

    fetchExercises();
  }, [token]);

  const handleExerciseChange = (
    exerciseIndex,
    value
  ) => {
    setWorkoutExercises((currentExercises) =>
      currentExercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              exercise: value,
            }
          : exercise
      )
    );
  };

  const handleSetChange = (
    exerciseIndex,
    setIndex,
    field,
    value
  ) => {
    setWorkoutExercises((currentExercises) =>
      currentExercises.map((exercise, index) => {
        if (index !== exerciseIndex) {
          return exercise;
        }

        const updatedSets = exercise.sets.map(
          (set, currentSetIndex) =>
            currentSetIndex === setIndex
              ? {
                  ...set,
                  [field]: value,
                }
              : set
        );

        return {
          ...exercise,
          sets: updatedSets,
        };
      })
    );
  };

  const handleAddExercise = () => {
    setWorkoutExercises((currentExercises) => [
      ...currentExercises,
      {
        exercise: "",
        sets: [
          {
            weight: "",
            reps: "",
          },
        ],
      },
    ]);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    setWorkoutExercises((currentExercises) =>
      currentExercises.filter(
        (_, index) => index !== exerciseIndex
      )
    );
  };

  const handleAddSet = (exerciseIndex) => {
    setWorkoutExercises((currentExercises) =>
      currentExercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  weight: "",
                  reps: "",
                },
              ],
            }
          : exercise
      )
    );
  };

  const handleRemoveSet = (
    exerciseIndex,
    setIndex
  ) => {
    setWorkoutExercises((currentExercises) =>
      currentExercises.map((exercise, index) => {
        if (index !== exerciseIndex) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.filter(
            (_, currentSetIndex) =>
              currentSetIndex !== setIndex
          ),
        };
      })
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Workout name is required");
      return;
    }

    if (workoutExercises.length === 0) {
      setError(
        "Add at least one exercise to the workout"
      );
      return;
    }

    const missingExercise =
      workoutExercises.some(
        (exercise) => !exercise.exercise
      );

    if (missingExercise) {
      setError("Select an exercise");
      return;
    }

    const exerciseIds = workoutExercises.map(
      (exercise) => exercise.exercise
    );

    if (
      new Set(exerciseIds).size !==
      exerciseIds.length
    ) {
      setError(
        "The same exercise cannot be added twice"
      );
      return;
    }

    const invalidSet = workoutExercises.some(
      (exercise) =>
        exercise.sets.length === 0 ||
        exercise.sets.some(
          (set) =>
            set.weight === "" ||
            set.reps === "" ||
            Number(set.weight) < 0 ||
            Number(set.reps) < 1
        )
    );

    if (invalidSet) {
      setError(
        "Each exercise must have valid weight and reps"
      );
      return;
    }

    try {
      setLoading(true);

      const workout = await createWorkout(
        {
          name: name.trim(),
          date: date || undefined,
          duration: duration
            ? Number(duration) * 60
            : undefined,
        },
        token
      );

      for (
        let exerciseIndex = 0;
        exerciseIndex < workoutExercises.length;
        exerciseIndex++
      ) {
        const selectedExercise =
          workoutExercises[exerciseIndex];

        const createdWorkoutExercise =
          await addExerciseToWorkout(
            workout._id,
            {
              exercise:
                selectedExercise.exercise,
              order: exerciseIndex + 1,
            },
            token
          );

        for (
          let setIndex = 0;
          setIndex < selectedExercise.sets.length;
          setIndex++
        ) {
          const currentSet =
            selectedExercise.sets[setIndex];

          await addSet(
            createdWorkoutExercise._id,
            {
              setNumber: setIndex + 1,
              weight: Number(
                currentSet.weight
              ),
              reps: Number(
                currentSet.reps
              ),
            },
            token
          );
        }
      }

      onWorkoutCreated(workout);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Workout</h2>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Workout Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="e.g. Push Day"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">
            Duration (minutes)
          </label>

          <input
            id="duration"
            type="number"
            min="0"
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value)
            }
            placeholder="60"
          />
        </div>

        <h3>Exercises</h3>

        {exerciseLoading ? (
          <p>Loading exercises...</p>
        ) : (
          workoutExercises.map(
            (workoutExercise, exerciseIndex) => (
              <div
                className="exercise-form"
                key={exerciseIndex}
              >
                <div className="exercise-header">
                  <h4>
                    Exercise {exerciseIndex + 1}
                  </h4>

                  {workoutExercises.length > 1 && (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() =>
                        handleRemoveExercise(
                          exerciseIndex
                        )
                      }
                    >
                      Remove Exercise
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Exercise
                  </label>

                  <select
                    value={
                      workoutExercise.exercise
                    }
                    onChange={(event) =>
                      handleExerciseChange(
                        exerciseIndex,
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select exercise
                    </option>

                    {availableExercises.map(
                      (exercise) => (
                        <option
                          key={exercise._id}
                          value={exercise._id}
                        >
                          {exercise.name} -{" "}
                          {exercise.muscleGroup}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="sets-header">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span></span>
                </div>

                {workoutExercise.sets.map(
                  (set, setIndex) => (
                    <div
                      className="set-row"
                      key={setIndex}
                    >
                      <span>
                        {setIndex + 1}
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={set.weight}
                        onChange={(event) =>
                          handleSetChange(
                            exerciseIndex,
                            setIndex,
                            "weight",
                            event.target.value
                          )
                        }
                        placeholder="60"
                      />

                      <input
                        type="number"
                        min="1"
                        value={set.reps}
                        onChange={(event) =>
                          handleSetChange(
                            exerciseIndex,
                            setIndex,
                            "reps",
                            event.target.value
                          )
                        }
                        placeholder="10"
                      />

                      {workoutExercise.sets
                        .length > 1 && (
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() =>
                            handleRemoveSet(
                              exerciseIndex,
                              setIndex
                            )
                          }
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )
                )}

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleAddSet(exerciseIndex)
                  }
                >
                  + Add Set
                </button>
              </div>
            )
          )
        )}

        <button
          type="button"
          className="secondary-button add-exercise-button"
          onClick={handleAddExercise}
        >
          + Add Exercise
        </button>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-workout-button"
            disabled={
              loading || exerciseLoading
            }
          >
            {loading
              ? "Creating Workout..."
              : "Create Workout"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;