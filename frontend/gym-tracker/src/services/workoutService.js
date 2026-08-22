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

const updateWorkout = async (
  workoutId,
  workout,
  token
) => {
  const response = await fetch(
    `${API_URL}/workouts/${workoutId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workout),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update workout"
    );
  }

  return data;
};

const deleteWorkout = async (
  workoutId,
  token
) => {
  const response = await fetch(
    `${API_URL}/workouts/${workoutId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete workout"
    );
  }

  return data;
};

const getWorkoutExercises = async (
  workoutId,
  token
) => {
  const response = await fetch(
    `${API_URL}/workouts/${workoutId}/exercises`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch workout exercises"
    );
  }

  return data;
};

const updateWorkoutExercise = async (
  workoutExerciseId,
  exerciseData,
  token
) => {
  const response = await fetch(
    `${API_URL}/workout-exercises/${workoutExerciseId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exerciseData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update exercise"
    );
  }

  return data;
};

const deleteWorkoutExercise = async (
  workoutId,
  workoutExerciseId,
  token
) => {
  const response = await fetch(
    `${API_URL}/workouts/${workoutId}/exercises/${workoutExerciseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to remove exercise"
    );
  }

  return data;
};

const updateSet = async (
  setId,
  set,
  token
) => {
  const response = await fetch(
    `${API_URL}/sets/${setId}`,
    {
      method: "PUT",
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
      data.message || "Failed to update set"
    );
  }

  return data;
};

const deleteSet = async (
  setId,
  token
) => {
  const response = await fetch(
    `${API_URL}/sets/${setId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete set"
    );
  }

  return data;
};

export {
  getWorkouts,
  getWorkoutExercises,
  createWorkout,
  addExerciseToWorkout,
  addSet,
  updateWorkout,
  deleteWorkout,
  updateWorkoutExercise,
  deleteWorkoutExercise,
  updateSet,
  deleteSet,
};