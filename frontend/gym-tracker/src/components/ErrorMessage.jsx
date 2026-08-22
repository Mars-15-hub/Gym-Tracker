const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;