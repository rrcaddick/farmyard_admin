const errorHandler = (error, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const validationErrors = req?.validationErrors;
  const statusCode = res.statusCode || 500;

  res.status(statusCode).json({
    message: error.message,
    ...(validationErrors && { validationErrors }),
    ...(isDevelopment && { stack: error.stack }),
  });
};

module.exports = errorHandler;
