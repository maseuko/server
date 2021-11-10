const CourseManager = require("../models/CourseManager");

exports.createCourse = async (req, res, next) => {
  try {
    const result = await CourseManager.addCourse("Dawid Gigga Koks");
    res.status(201).json(result);
  } catch (err) {
    console.log("ok2");
    next(err);
  }
};
