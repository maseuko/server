const SCHOOLS = require("../constants/database").SCHOOLS;
const COURSES = require("../constants/database").CURRENT_COURSES;

exports.getAllSchools = (req, res, next) => {
  return res.status(200).json(SCHOOLS[0]);
};

exports.getAllCourses = (req, res, next) => {
  const schoolId = req.body.schoolId;
  const courses = COURSES[0].filter(
    (c) => c.school.toString() === schoolId.toString()
  );
  res.status(200).json(courses);
};
