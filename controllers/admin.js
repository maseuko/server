const CourseManager = require("../models/CourseManager");

exports.createCourse = async (req, res, next) => {
  try {
    const result = await CourseManager.addCourse("Ultra Nowe Cos gigakox haha");
    res.status(201).json({ msg: "Resource created succesfully." });
  } catch (err) {
    console.log("ok2");
    next(err);
  }
};
