const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        data: error.data || null,
        message: error.message || "Internal server error",
        status: error.status || false,
      });
    }
  };
};

export { asyncHandler };
