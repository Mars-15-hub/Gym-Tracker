import {
  useCallback,
  useEffect,
  useState,
} from "react";

import WorkoutEditForm from "./WorkoutEditForm";
import WorkoutSummary from "./WorkoutSummary";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

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

  const [editing, setEditing] =
    useState(false);

  const [expanded, setExpanded] =
    useState(false);

  const [details, setDetails] =
    useState([]);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(true);

  const [
    detailsError,
    setDetailsError,
  ] = useState("");

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [deleting, setDeleting] =
    useState(false);

  const loadDetails = useCallback(
    async () => {
      try {
        setDetailsLoading(true);
        setDetailsError("");

        const data =
          await getWorkoutExercises(
            workout._id,
            token
          );

        setDetails(data);
      } catch (error) {
        setDetailsError(
          error.message
        );
      } finally {
        setDetailsLoading(false);
      }
    },
    [workout._id, token]
  );

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${workout.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setActionError("");

      await deleteWorkout(
        workout._id,
        token
      );

      onWorkoutDeleted(
        workout._id
      );
    } catch (error) {
      setActionError(
        error.message
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdated = async (
    updatedWorkout
  ) => {
    onWorkoutUpdated(
      updatedWorkout
    );

    await loadDetails();

    setEditing(false);
  };

  const exerciseCount =
    details.length;

  const setCount = details.reduce(
    (total, workoutExercise) =>
      total +
      workoutExercise.sets.length,
    0
  );

  const totalVolume = details.reduce(
    (workoutTotal, workoutExercise) =>
      workoutTotal +
      workoutExercise.sets.reduce(
        (setTotal, set) =>
          setTotal +
          set.weight * set.reps,
        0
      ),
    0
  );

  if (editing) {
    return (
      <article className="workout-card">
        <WorkoutEditForm
          workout={workout}
          workoutExercises={details}
          onWorkoutUpdated={
            handleUpdated
          }
          onCancel={() =>
            setEditing(false)
          }
        />
      </article>
    );
  }

  return (
    <article className="workout-card">
      <div className="workout-card-header">
        <div>
          <h3>{workout.name}</h3>

          <div className="workout-meta">
            <span>
              {new Date(
                workout.date
              ).toLocaleDateString()}
            </span>

            <span>•</span>

            <span>
              {Math.round(
                (workout.duration || 0) /
                  60
              )}{" "}
              min
            </span>
          </div>
        </div>
      </div>

      {detailsLoading ? (
        <LoadingSpinner message="Loading workout details..." />
      ) : detailsError ? (
        <ErrorMessage
          message={detailsError}
          onRetry={loadDetails}
        />
      ) : (
        <>
          <WorkoutSummary
            exerciseCount={
              exerciseCount
            }
            setCount={setCount}
            totalVolume={
              totalVolume
            }
          />

          {details.length > 0 && (
            <button
              type="button"
              className="details-toggle"
              onClick={() =>
                setExpanded(
                  (current) =>
                    !current
                )
              }
              aria-expanded={
                expanded
              }
            >
              {expanded
                ? "Hide Exercises"
                : "View Exercises"}
            </button>
          )}

          {expanded && (
            <div className="workout-details">
              {details.map(
                (
                  workoutExercise
                ) => (
                  <div
                    className="workout-exercise-display"
                    key={
                      workoutExercise._id
                    }
                  >
                    <div className="exercise-title">
                      <strong>
                        {
                          workoutExercise
                            .exercise
                            .name
                        }
                      </strong>

                      <span>
                        {
                          workoutExercise
                            .exercise
                            .muscleGroup
                        }
                      </span>
                    </div>

                    {workoutExercise
                      .sets.length ===
                    0 ? (
                      <p className="muted-text">
                        No sets
                        recorded.
                      </p>
                    ) : (
                      <div className="sets-display">
                        <div className="sets-display-header">
                          <span>
                            Set
                          </span>
                          <span>
                            Weight
                          </span>
                          <span>
                            Reps
                          </span>
                        </div>

                        {workoutExercise.sets.map(
                          (set) => (
                            <div
                              className="sets-display-row"
                              key={
                                set._id
                              }
                            >
                              <span>
                                {
                                  set.setNumber
                                }
                              </span>

                              <span>
                                {
                                  set.weight
                                }{" "}
                                kg
                              </span>

                              <span>
                                {
                                  set.reps
                                }
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      {actionError && (
        <ErrorMessage
          message={actionError}
        />
      )}

      <div className="workout-actions">
        <button
          className="edit-button"
          onClick={() =>
            setEditing(true)
          }
          disabled={
            detailsLoading ||
            Boolean(detailsError)
          }
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
    </article>
  );
};

export default WorkoutCard;