import { useEffect, useState } from "react";

import WorkoutCard from "../components/WorkoutCard";
import WorkoutForm from "../components/WorkoutForm";

import {
  getWorkouts,
} from "../services/workoutService";

import useAuth from "../hooks/useAuth";

const WorkoutList = () => {
  const { token } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [durationFilter, setDurationFilter] =
    useState("all");

  useEffect(() => {
    const fetchWorkouts = async (
      showLoading = false
    ) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const data = await getWorkouts(token);

        setWorkouts(data);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    fetchWorkouts(true);

    const interval = setInterval(() => {
      fetchWorkouts(false);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [token]);

  const handleWorkoutCreated = (workout) => {
    setWorkouts((currentWorkouts) => [
      workout,
      ...currentWorkouts,
    ]);

    setShowForm(false);
  };

  const handleWorkoutUpdated = (
    updatedWorkout
  ) => {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout._id === updatedWorkout._id
          ? updatedWorkout
          : workout
      )
    );
  };

  const handleWorkoutDeleted = (workoutId) => {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter(
        (workout) =>
          workout._id !== workoutId
      )
    );
  };

  const filteredWorkouts = workouts.filter(
    (workout) => {
      const matchesSearch =
        workout.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const durationMinutes =
        (workout.duration || 0) / 60;

      let matchesDuration = true;

      if (durationFilter === "short") {
        matchesDuration =
          durationMinutes <= 45;
      }

      if (durationFilter === "medium") {
        matchesDuration =
          durationMinutes > 45 &&
          durationMinutes <= 60;
      }

      if (durationFilter === "long") {
        matchesDuration =
          durationMinutes > 60;
      }

      return (
        matchesSearch && matchesDuration
      );
    }
  );

  if (loading) {
    return (
      <main>
        <p>Loading workouts...</p>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header">
        <h1>My Workouts</h1>

        {!showForm && (
          <button
            className="create-workout-button"
            onClick={() =>
              setShowForm(true)
            }
          >
            + Create Workout
          </button>
        )}
      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {showForm && (
        <WorkoutForm
          onWorkoutCreated={
            handleWorkoutCreated
          }
          onCancel={() =>
            setShowForm(false)
          }
        />
      )}

      {workouts.length > 0 && (
        <div className="workout-filters">
          <div className="filter-group">
            <label htmlFor="workout-search">
              Search
            </label>

            <input
              id="workout-search"
              type="text"
              placeholder="Search workouts..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="duration-filter">
              Duration
            </label>

            <select
              id="duration-filter"
              value={durationFilter}
              onChange={(event) =>
                setDurationFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Workouts
              </option>

              <option value="short">
                45 minutes or less
              </option>

              <option value="medium">
                46-60 minutes
              </option>

              <option value="long">
                Over 60 minutes
              </option>
            </select>
          </div>
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="empty-workouts">
          <p>No workouts yet.</p>

          {!showForm && (
            <button
              className="create-workout-button"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Create Your First Workout
            </button>
          )}
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="empty-workouts">
          <p>
            No workouts match your search.
          </p>
        </div>
      ) : (
        <div className="workout-list">
          {filteredWorkouts.map(
            (workout) => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                onWorkoutUpdated={
                  handleWorkoutUpdated
                }
                onWorkoutDeleted={
                  handleWorkoutDeleted
                }
              />
            )
          )}
        </div>
      )}
    </main>
  );
};

export default WorkoutList;