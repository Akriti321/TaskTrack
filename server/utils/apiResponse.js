const sendSuccess = (res, statusCode, message, data = null, meta = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
    ...meta,
  });
};

module.exports = { sendSuccess };
