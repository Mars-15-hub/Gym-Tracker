const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-state" aria-live="polite">
      <div className="spinner"></div>
      <span>{message}</span>
    </div>
  );
};

export default LoadingSpinner;