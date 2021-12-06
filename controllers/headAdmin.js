const School = require("../models/School");
const Course = require("../models/courses");
const CourseManager = require("../models/CourseManager");
const validationChecker = require("../utils/validation-checker");

exports.addSchool = async (req, res, next) => {
  const err = new Error();
  const schoolName = req.body.schoolName;

  try {
    validationChecker(req);
    const result = await School.findOne({ name: schoolName });

    if (result) {
      err.statusCode = 409;
      err.msg = "School already exists.";
      throw err;
    }

    const school = new School({ name: schoolName });
    const saveResult = school.save();
    res.status(201).json({ msg: "School added." });
  } catch (err) {
    next(err);
  }
};

exports.removeSchool = async (req, res, next) => {
  const schoolId = req.body.schoolId;
  try {
    School.findByIdAndDelete(schoolId);
    const courses = await Course.find({ school: schoolId });
    if (courses.length > 0) {
      for (let course of courses) {
        CourseManager.removeCourse(course._id.toString());
      }
    }
    res.status(200).json({ msg: "School removed." });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  const name = req.body.name;
  const schoolId = req.body.schoolId;
  try {
    validationChecker(req);
    const schoolResult = await School.findById(schoolId);
    if (!schoolResult) {
      const err = new Error();
      err.statusCode = 404;
      err.msg = "School not exists.";
      throw err;
    }
    const result = await CourseManager.addCourse({ name, school: schoolId });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  const id = req.body.id;
  try {
    validationChecker(req);
    const result = await CourseManager.removeCourse(id);
    res.status(200).json({ msg: "Course removed." });
  } catch (err) {
    next(err);
  }
};
