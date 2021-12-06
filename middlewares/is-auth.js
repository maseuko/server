const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../constants/constants").JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.get("token");
  const uid = req.get("uid");
  const rememberToken = req.get("remember");

  let decodedToken;
  try {
    jwt.verify(token, JWT_SECRET, (err, ver) => {
      if (err) {
        throw err;
      }
      decodedToken = ver;
    });
  } catch (err) {
    if (err.name === "TokenExpiredError" && rememberToken) {
      try {
        decodedToken = jwt.verify(rememberToken, JWT_SECRET);
      } catch (err) {
        const error = new Error("Invalid tokens.");
        error.statusCode = 403;
        next(error);
      }
      const newToken = jwt.sign({ uid: user._id.toString() }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(205).json({
        msg: "Token expired",
        token: {
          token: newToken,
          expire: new Date().setHours(new Date().getHours + 1),
        },
      });
    }
  }
  if (!decodedToken) {
    const error = new Error("Non authenticated.");
    error.statusCode = 401;
    next(error);
  }

  req.uid = uid;
  next();
};
