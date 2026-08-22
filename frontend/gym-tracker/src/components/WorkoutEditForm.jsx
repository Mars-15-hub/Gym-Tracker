import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";

import {
  updateWorkout,
  addExerciseToWorkout,
  updateWorkoutExercise,
  deleteWorkoutExercise,
  addSet,
  updateSet,
  deleteSet,
} from "../services/workoutService";

import {
  getExercises,
} from "../services/exerciseService";

const WorkoutEditForm = ({
  workout,
  workoutExercises,
  onWorkoutUpdated,
  onCancel,
}) => {
  const { token } = useAuth();

  const [name, setName] = useState(
    workout.name
  );

  const [date, setDate] = useState(
    workout.date
      ? new Date(workout.date)
          .toISOString()
          .split("T")[0]
      : ""
  );

  const [duration, setDuration] = useState(
    workout.duration
      ? Math.round(workout.duration / 60)
      : ""
  );

  const [availableExercises, setAvailableExercises] =
    useState([]);

  const [exerciseRows, setExerciseRows] =
    useState(() =>
      workoutExercises.map(
        (workoutExercise) => ({
          _id: workoutExercise._id,

          exercise:
            workoutExercise.exercise._id,

          sets: workoutExercise.sets.map(
            (set) => ({
              _id: set._id,
              weight: set.weight,
              reps: set.reps,
            })
          ),
        })
      )
    );

  const [
    removedWorkoutExercises,
    setRemovedWorkoutExercises,
  ] = useState([]);

  const [removedSets, setRemovedSets] =
    useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises(
          token
        );

        setAvailableExercises(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExercises();
  }, [token]);

  const handleExerciseChange = (
    exerciseIndex,
    value
  ) => {
    setExerciseRows((currentRows) =>
      currentRows.map((row, index) =>
        index === exerciseIndex
          ? {
              ...row,
              exercise: value,
            }
          : row
      )
    );
  };

  const handleSetChange = (
    exerciseIndex,
    setIndex,
    field,
    value
  ) => {
    setExerciseRows((currentRows) =>
      currentRows.map((row, index) => {
        if (index !== exerciseIndex) {
          return row;
        }

        return {
          ...row,

          sets: row.sets.map(
            (set, currentSetIndex) =>
              currentSetIndex === setIndex
                ? {
                    ...set,
                    [field]: value,
                  }
                : set
          ),
        };
      })
    );
  };

  const handleAddExercise = () => {
    setExerciseRows((currentRows) => [
      ...currentRows,
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

  const handleRemoveExercise = (
    exerciseIndex
  ) => {
    const row =
      exerciseRows[exerciseIndex];

    if (row._id) {
      setRemovedWorkoutExercises(
        (current) => [
          ...current,
          row._id,
        ]
      );
    }

    setExerciseRows((currentRows) =>
      currentRows.filter(
        (_, index) =>
          index !== exerciseIndex
      )
    );
  };

  const handleAddSet = (
    exerciseIndex
  ) => {
    setExerciseRows((currentRows) =>
      currentRows.map((row, index) =>
        index === exerciseIndex
          ? {
              ...row,
              sets: [
                ...row.sets,
                {
                  weight: "",
                  reps: "",
                },
              ],
            }
          : row
      )
    );
  };

  const handleRemoveSet = (
    exerciseIndex,
    setIndex
  ) => {
    const set =
      exerciseRows[exerciseIndex]
        .sets[setIndex];

    if (set._id) {
      setRemovedSets((current) => [
        ...current,
        set._id,
      ]);
    }

    setExerciseRows((currentRows) =>
      currentRows.map((row, index) => {
        if (index !== exerciseIndex) {
          return row;
        }

        return {
          ...row,
          sets: row.sets.filter(
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
      setError(
        "Workout name is required"
      );
      return;
    }

    if (exerciseRows.length === 0) {
      setError(
        "Workout must contain at least one exercise"
      );
      return;
    }

    const missingExercise =
      exerciseRows.some(
        (row) => !row.exercise
      );

    if (missingExercise) {
      setError(
        "Select an exercise for every row"
      );
      return;
    }

    const exerciseIds =
      exerciseRows.map(
        (row) => row.exercise
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

    const invalidSet =
      exerciseRows.some(
        (row) =>
          row.sets.length === 0 ||
          row.sets.some(
            (set) =>
              set.weight === "" ||
              set.reps === "" ||
              Number(set.weight) < 0 ||
              Number(set.reps) < 1
          )
      );

    if (invalidSet) {
      setError(
        "Every exercise must have valid sets"
      );
      return;
    }

    try {
      setLoading(true);

      const updatedWorkout =
        await updateWorkout(
          workout._id,
          {
            name: name.trim(),
            date: date || undefined,
            duration: duration
              ? Number(duration) * 60
              : 0,
          },
          token
        );

      for (const workoutExerciseId of removedWorkoutExercises) {
        await deleteWorkoutExercise(
          workout._id,
          workoutExerciseId,
          token
        );
      }

      for (const setId of removedSets) {
        await deleteSet(
          setId,
          token
        );
      }

      for (
        let exerciseIndex = 0;
        exerciseIndex <
        exerciseRows.length;
        exerciseIndex++
      ) {
        const row =
          exerciseRows[exerciseIndex];

        let workoutExerciseId =
          row._id;

        if (workoutExerciseId) {
          await updateWorkoutExercise(
            workoutExerciseId,
            {
              exercise: row.exercise,
              order:
                exerciseIndex + 1,
            },
            token
          );
        } else {
          const created =
            await addExerciseToWorkout(
              workout._id,
              {
                exercise:
                  row.exercise,
                order:
                  exerciseIndex + 1,
              },
              token
            );

          workoutExerciseId =
            created._id;
        }

        for (
          let setIndex = 0;
          setIndex < row.sets.length;
          setIndex++
        ) {
          const set =
            row.sets[setIndex];

          const setData = {
            setNumber: setIndex + 1,
            weight: Number(
              set.weight
            ),
            reps: Number(set.reps),
          };

          if (set._id) {
            await updateSet(
              set._id,
              setData,
              token
            );
          } else {
            await addSet(
              workoutExerciseId,
              setData,
              token
            );
          }
        }
      }

      onWorkoutUpdated(
        updatedWorkout
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-form">
      <h3>Edit Workout</h3>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Workout Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Duration (minutes)
          </label>

          <input
            type="number"
            min="0"
            value={duration}
            onChange={(event) =>
              setDuration(
                event.target.value
              )
            }
          />
        </div>

        <h3>Exercises</h3>

        {exerciseRows.map(
          (row, exerciseIndex) => (
            <div
              className="exercise-form"
              key={
                row._id ||
                `new-${exerciseIndex}`
              }
            >
              <div className="exercise-header">
                <h4>
                  Exercise{" "}
                  {exerciseIndex + 1}
                </h4>

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
              </div>

              <div className="form-group">
                <label>
                  Exercise
                </label>

                <select
                  value={row.exercise}
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
                        key={
                          exercise._id
                        }
                        value={
                          exercise._id
                        }
                      >
                        {exercise.name} -{" "}
                        {
                          exercise.muscleGroup
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="sets-header">
                <span>Set</span>
                <span>
                  Weight (kg)
                </span>
                <span>Reps</span>
                <span></span>
              </div>

              {row.sets.map(
                (set, setIndex) => (
                  <div
                    className="set-row"
                    key={
                      set._id ||
                      `new-set-${setIndex}`
                    }
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
                          event.target
                            .value
                        )
                      }
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
                          event.target
                            .value
                        )
                      }
                    />

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
                  </div>
                )
              )}

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  handleAddSet(
                    exerciseIndex
                  )
                }
              >
                + Add Set
              </button>
            </div>
          )
        )}

        <button
          type="button"
          className="secondary-button add-exercise-button"
          onClick={
            handleAddExercise
          }
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
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutEditForm;