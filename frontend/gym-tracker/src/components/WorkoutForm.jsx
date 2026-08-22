import { useState } from "react";
import { createWorkout } from "../services/workoutService";

const WorkoutForm = ({ onWorkoutCreated, onCancel }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Workout name is required");
      return;
    }

    try {
      setLoading(true);

      const workout = {
        user: "6a88538d6b07bd6a43ebeea3",
        name: name.trim(),
        date: date || undefined,
        duration: duration ? Number(duration) * 60 : undefined,
      };

      const createdWorkout = await createWorkout(workout);

      onWorkoutCreated(createdWorkout);

      setName("");
      setDate("");
      setDuration("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Workout</h2>

      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Workout Name</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Push Day"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>

          <input
            id="duration"
            type="number"
            min="0"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="60"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Workout"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;