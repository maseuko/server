const School = require("../models/School");
const Course = require("../models/courses");
const CourseManager = require("../models/CourseManager");
const validationChecker = require("../utils/validation-checker");
const User = require("../models/user");

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
  const price = req.body.price;
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
    await CourseManager.addCourse(
      {
        name,
        school: schoolId,
        price,
      },
      (obj) => {
        res.status(201).json(obj);
      }
    );
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

exports.grantAccess = async (req, res, next) => {
  const uid = req.body.uid;
  const courseId = req.body.courseId;
  const modify = req.body.modify;

  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    const index = user.permissions.findIndex(
      (p) => p.courseId.toString() === courseId.toString()
    );
    if (!(index >= 0)) {
      user.permissions.push({ courseId, modify });
      await user.save();
      return res.status(202).json({ msg: "Access granted." });
    }

    user.permissions[index].modify = modify;

    await user.save();
    return res.status(202).json({ msg: "Access updated." });
  } catch (err) {
    next(err);
  }
};
