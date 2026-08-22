const WorkoutSummary = ({
  exerciseCount,
  setCount,
  totalVolume,
}) => {
  return (
    <div className="workout-summary">
      <div className="summary-item">
        <strong>{exerciseCount}</strong>
        <span>
          {exerciseCount === 1
            ? "Exercise"
            : "Exercises"}
        </span>
      </div>

      <div className="summary-item">
        <strong>{setCount}</strong>
        <span>
          {setCount === 1
            ? "Set"
            : "Sets"}
        </span>
      </div>

      <div className="summary-item">
        <strong>
          {Math.round(
            totalVolume
          ).toLocaleString()}
        </strong>
        <span>kg Volume</span>
      </div>
    </div>
  );
};

export default WorkoutSummary;