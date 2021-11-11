const CourseManager = require("../models/CourseManager");

exports.createCourse = async (req, res, next) => {
  const courseName = req.body.name;
  try {
    const result = await CourseManager.addCourse(courseName);
    res.status(201).json(result);
  } catch (err) {
    console.log("ok2");
    next(err);
  }
};
