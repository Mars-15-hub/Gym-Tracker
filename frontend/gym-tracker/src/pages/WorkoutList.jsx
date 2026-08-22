import { useEffect, useState } from "react";

import WorkoutCard from "../components/WorkoutCard";
import WorkoutForm from "../components/WorkoutForm";

import {
  getWorkouts,
} from "../services/workoutService";

import useAuth from "../hooks/useAuth";

const WorkoutList = () => {
  const { token } = useAuth();

  const [workouts, setWorkouts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);

        const data =
          await getWorkouts(token);

        setWorkouts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [token]);

  const handleWorkoutCreated = (workout) => {
    setWorkouts((currentWorkouts) => [
      workout,
      ...currentWorkouts,
    ]);

    setShowForm(false);
  };

  if (loading) {
    return <p>Loading workouts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <div className="page-header">
        <h1>My Workouts</h1>

        {!showForm && (
          <button
            className="create-workout-button"
            onClick={() => setShowForm(true)}
          >
            + Create Workout
          </button>
        )}
      </div>

      {showForm && (
        <WorkoutForm
          onWorkoutCreated={handleWorkoutCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {workouts.length === 0 ? (
        <div className="empty-workouts">
          <p>No workouts yet.</p>

          {!showForm && (
            <button
              className="create-workout-button"
              onClick={() => setShowForm(true)}
            >
              + Create Your First Workout
            </button>
          )}
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout._id}
              workout={workout}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default WorkoutList;