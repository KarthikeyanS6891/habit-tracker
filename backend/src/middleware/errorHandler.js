export const notFound = (req, res, _next) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  console.error('[error]', err);
  res.status(status).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
