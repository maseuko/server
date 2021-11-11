const { validationResult } = require("express-validator");

module.exports = (req) => {
  const errors = validationResult(req).errors;

  if (errors.length > 0) {
    const error = new Error();
    error.msg = "Invalid user input.";
    error.err = errors;
    error.statusCode = 400;
    console.log(error);
    throw error;
  }
};
