const fs = require("fs");
const path = require("path");

exports.getImage = (req, res, next) => {
  const imageName = req.params.imageName;
  fs.access(path.join(__dirname, "../images", imageName), (notExists) => {
    if (notExists) {
      return res.status(404).json({ msg: "File not found." });
    }
    fs.createReadStream(path.join(__dirname, "../images", imageName), (err) => {
      if (err) {
        return res.status(404).json({ msg: "File not found." });
      }
    }).pipe(res);
  });
};
