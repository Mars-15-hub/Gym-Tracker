const API_URL = "http://localhost:3001/api";

const getWorkouts = async () => {
  const response = await fetch(`${API_URL}/workouts`);

  if (!response.ok) {
    throw new Error("Failed to fetch workouts");
  }

  return response.json();
};

const createWorkout = async (workout) => {
  const response = await fetch(`${API_URL}/workouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create workout");
  }

  return response.json();
};

export { getWorkouts, createWorkout };