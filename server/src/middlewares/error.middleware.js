export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (error.name === "CastError") {
    statusCode = 404;
    error.message = "Resource not found";
  }

  if (error.code === 11000) {
    statusCode = 400;
    error.message = "Duplicate field value entered";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    error.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};