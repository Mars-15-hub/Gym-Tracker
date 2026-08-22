import { useEffect, useState } from "react";

import WorkoutEditForm from "./WorkoutEditForm";

import {
  deleteWorkout,
  getWorkoutExercises,
} from "../services/workoutService";

import useAuth from "../hooks/useAuth";

const WorkoutCard = ({
  workout,
  onWorkoutUpdated,
  onWorkoutDeleted,
}) => {
  const { token } = useAuth();

  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getWorkoutExercises(
          workout._id,
          token
        );

        setDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [workout, token]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteWorkout(
        workout._id,
        token
      );

      onWorkoutDeleted(workout._id);
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdated = async (
    updatedWorkout
  ) => {
    onWorkoutUpdated(updatedWorkout);

    try {
      const updatedDetails =
        await getWorkoutExercises(
          updatedWorkout._id,
          token
        );

      setDetails(updatedDetails);
      setEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  if (editing) {
    return (
      <div className="workout-card">
        <WorkoutEditForm
          workout={workout}
          workoutExercises={details}
          onWorkoutUpdated={handleUpdated}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="workout-card">
      <div className="workout-card-header">
        <div>
          <h3>{workout.name}</h3>

          <p>
            Date:{" "}
            {new Date(
              workout.date
            ).toLocaleDateString()}
          </p>

          <p>
            Duration:{" "}
            {Math.round(
              (workout.duration || 0) / 60
            )}{" "}
            minutes
          </p>
        </div>
      </div>

      <div className="workout-details">
        <h4>Exercises</h4>

        {detailsLoading ? (
          <p>Loading exercises...</p>
        ) : details.length === 0 ? (
          <p>No exercises added.</p>
        ) : (
          details.map((workoutExercise) => (
            <div
              className="workout-exercise-display"
              key={workoutExercise._id}
            >
              <div className="exercise-title">
                <strong>
                  {workoutExercise.exercise.name}
                </strong>

                <span>
                  {
                    workoutExercise.exercise
                      .muscleGroup
                  }
                </span>
              </div>

              {workoutExercise.sets.length ===
              0 ? (
                <p>No sets recorded.</p>
              ) : (
                <div className="sets-display">
                  <div className="sets-display-header">
                    <span>Set</span>
                    <span>Weight</span>
                    <span>Reps</span>
                  </div>

                  {workoutExercise.sets.map(
                    (set) => (
                      <div
                        className="sets-display-row"
                        key={set._id}
                      >
                        <span>
                          {set.setNumber}
                        </span>

                        <span>
                          {set.weight} kg
                        </span>

                        <span>{set.reps}</span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <div className="workout-actions">
        <button
          className="edit-button"
          onClick={() => setEditing(true)}
          disabled={detailsLoading}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;