const errorMiddleware = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Server error';

  if (statusCode >= 500) {
    console.error(error);
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
  }

  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
