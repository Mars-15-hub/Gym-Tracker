import { useState } from "react";
import { updateWorkout } from "../services/workoutService";
import useAuth from "../hooks/useAuth";

const WorkoutEditForm = ({
  workout,
  onWorkoutUpdated,
  onCancel,
}) => {
  const { token } = useAuth();

  const [name, setName] = useState(workout.name);

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Workout name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError(
        "Workout name must contain at least 2 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const updatedWorkout = await updateWorkout(
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

      onWorkoutUpdated(updatedWorkout);
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
        <p className="form-error">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor={`name-${workout._id}`}>
            Workout Name
          </label>

          <input
            id={`name-${workout._id}`}
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor={`date-${workout._id}`}>
            Date
          </label>

          <input
            id={`date-${workout._id}`}
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor={`duration-${workout._id}`}>
            Duration (minutes)
          </label>

          <input
            id={`duration-${workout._id}`}
            type="number"
            min="0"
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value)
            }
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="create-workout-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutEditForm;