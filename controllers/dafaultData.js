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

  const final = courses.map((element) => {
    return {
      _id: element._id,
      name: element.name,
      school: element.school,
    };
  });

  res.status(200).json(final);
};
