const API_URL = "http://localhost:3001/api";

const getExercises = async (token) => {
  const response = await fetch(`${API_URL}/exercises`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch exercises"
    );
  }

  return data;
};

export { getExercises };