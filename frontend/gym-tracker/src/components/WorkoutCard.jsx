const WorkoutCard = ({ workout }) => {
  return (
    <div className="workout-card">
      <h3>{workout.name}</h3>

      <p>
        Date:{" "}
        {new Date(workout.date).toLocaleDateString()}
      </p>

      {workout.duration !== undefined && (
        <p>
          Duration: {Math.round(workout.duration / 60)} minutes
        </p>
      )}
    </div>
  );
};

export default WorkoutCard;