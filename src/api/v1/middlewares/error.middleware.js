export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message || 'Something went wrong',
  });
};