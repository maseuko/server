exports.err = (err, next) => {
  if (err.statusCode) {
    next(err);
  }
  const error = new Error("Something went wrong.");
  next(error);
};
