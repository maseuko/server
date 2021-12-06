const USERS = require("../constants/database").USERS;

module.exports = (req, res, next) => {
  const uid = req.get("uid");
  const lookedIndex = USERS[0].findIndex(
    (u) => u._id.toString() === uid.toString()
  );
  if (!(lookedIndex >= 0)) {
    return res.status(401).json({ msg: "Unauthorized access." });
  }
  if (!USERS[0][lookedIndex].headAdmin) {
    return res.status(403).json({ msg: "Access denied." });
  }
  next();
};
