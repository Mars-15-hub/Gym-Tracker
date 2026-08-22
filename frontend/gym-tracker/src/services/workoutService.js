const API_URL = "http://localhost:3001/api";

const getWorkouts = async (token) => {
  const response = await fetch(`${API_URL}/workouts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch workouts"
    );
  }

  return data;
};

const createWorkout = async (workout, token) => {
  const response = await fetch(`${API_URL}/workouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(workout),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create workout"
    );
  }

  return data;
};

const addExerciseToWorkout = async (
  workoutId,
  exercise,
  token
) => {
  const response = await fetch(
    `${API_URL}/workouts/${workoutId}/exercises`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exercise),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add exercise"
    );
  }

  return data;
};

const addSet = async (
  workoutExerciseId,
  set,
  token
) => {
  const response = await fetch(
    `${API_URL}/workout-exercises/${workoutExerciseId}/sets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(set),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add set"
    );
  }

  return data;
};

export {
  getWorkouts,
  createWorkout,
  addExerciseToWorkout,
  addSet,
};