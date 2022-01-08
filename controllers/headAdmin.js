const School = require("../models/School");
const Course = require("../models/courses");
const CourseManager = require("../models/CourseManager");
const validationChecker = require("../utils/validation-checker");
const User = require("../models/user");
const COURSES = require("../constants/database").CURRENT_COURSES;
const SCHOOLS = require("../constants/database").SCHOOLS;
const USERS = require("../constants/database").USERS;

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
    const saveResult = await school.save();
    SCHOOLS[0].push(saveResult);
    res.status(201).json({ msg: "School added.", school: saveResult });
  } catch (err) {
    next(err);
  }
};

exports.modifySchoolName = async (req, res, next) => {
  const schoolId = req.body.schoolId;
  const name = req.body.name;
  try {
    const school = await School.findById(schoolId);
    const schoolDbId = SCHOOLS[0].findIndex(
      (s) => s._id.toString() === schoolId.toString()
    );
    if (!school && schoolDbId < 0) {
      return res.status(404).json({ msg: "School not found." });
    }

    school.name = name;
    const save = await school.save();
    SCHOOLS[0][schoolDbId].name = name;

    res.status(202).json({ msg: "School name updated.", school: save });
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
    const updatedDB = SCHOOLS[0].filter(
      (s) => s._id.toString() !== schoolId.toString()
    );
    SCHOOLS[0] = updatedDB;
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

exports.modifyCourse = async (req, res, next) => {
  const courseId = req.body.courseId;
  const name = req.body.name;
  const schoolId = req.body.schoolId;
  const price = req.body.price;
  const error = new Error();

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      error.statusCode = 404;
      error.msg = "Course not found.";
      throw error;
    }
    if (name) {
      course.name = name;
    }
    if (price) {
      course.price = price;
    }
    if (schoolId) {
      course.school = schoolId;
    }
    const modifiedCourse = await course.save();

    const index = COURSES[0].findIndex(
      (c) => c._id.toString() === courseId.toString()
    );

    COURSES[0][index] = modifiedCourse;
    const schoolIndex = SCHOOLS[0].findIndex(
      (s) => s._id.toString() === modifiedCourse.school.toString()
    );
    const responseObject = {
      _id: modifiedCourse._id,
      name: modifiedCourse.name,
      price: modifiedCourse.price,
      school: {
        name: SCHOOLS[0][schoolIndex].name,
        _id: SCHOOLS[0][schoolIndex]._id,
      },
    };

    return res
      .status(202)
      .json({ msg: "Course modified.", course: responseObject });
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
  const write = req.body.write;

  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    const index = user.permissions.findIndex(
      (p) => p.courseId.toString() === courseId.toString()
    );
    const userIndex = USERS[0].findIndex(
      (u) => u._id.toString() === uid.toString()
    );
    if (userIndex < 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!(index >= 0)) {
      user.permissions.push({
        courseId,
        modify: {
          read: true,
          write: !!write,
        },
      });

      const result = await user.save();
      USERS[0][userIndex].permissions = result.permissions;
      console.log(result);
      return res.status(202).json({
        msg: "Access granted.",
        permissions: USERS[0][userIndex].permissions,
      });
    }

    user.permissions[index].modify.write = !!write;

    const res2 = await user.save();
    USERS[0][userIndex].permissions = res2.permissions;
    // console.log(res2);
    return res.status(202).json({
      msg: "Access updated.",
      permissions: USERS[0][userIndex].permissions,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeAccess = async (req, res, next) => {
  const uid = req.body.uid;
  const courseId = req.body.courseId;
  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const userIndex = USERS[0].findIndex(
      (u) => u._id.toString() === uid.toString()
    );

    if (userIndex < 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const filteredDB = USERS[0][userIndex].permissions.filter(
      (p) => p.courseId.toString() !== courseId.toString()
    );

    user.permissions = filteredDB;

    const result = await user.save();
    USERS[0][userIndex].permissions = result.permissions;
    return res.status(202).json({
      msg: "Access granted.",
      permissions: USERS[0][userIndex].permissions,
    });
  } catch (err) {
    next(err);
  }
};

exports.fetchAllUsers = (req, res, next) => {
  const finalData = USERS[0].map((u) => ({
    _id: u._id,
    username: u.username,
    permissions: u.permissions,
    isHeadAdmin: u.headAdmin,
  }));
  return res.status(200).json({ users: finalData });
};
