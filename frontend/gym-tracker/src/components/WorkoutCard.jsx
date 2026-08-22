import { useState } from "react";

import WorkoutEditForm from "./WorkoutEditForm";

import { deleteWorkout } from "../services/workoutService";

import useAuth from "../hooks/useAuth";

const WorkoutCard = ({
  workout,
  onWorkoutUpdated,
  onWorkoutDeleted,
}) => {
  const { token } = useAuth();

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  const handleUpdated = (updatedWorkout) => {
    onWorkoutUpdated(updatedWorkout);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="workout-card">
        <WorkoutEditForm
          workout={workout}
          onWorkoutUpdated={handleUpdated}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="workout-card">
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

      {error && (
        <p className="form-error">{error}</p>
      )}

      <div className="workout-actions">
        <button
          className="edit-button"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;