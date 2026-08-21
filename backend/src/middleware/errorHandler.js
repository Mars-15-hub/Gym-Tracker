export const errorHandler = {};

errorHandler.notFoundDefault = (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
};

errorHandler.errorDefault = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(err.stack);
  }

  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message;
  res.status(statusCode).json({
    status: statusCode,
    message,
  });
};
