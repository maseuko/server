const SCHOOLS = require("../constants/database").SCHOOLS;
const COURSES = require("../constants/database").CURRENT_COURSES;

exports.getAllSchools = (req, res, next) => {
  const final = SCHOOLS[0].map((c) => ({ _id: c._id, name: c.name }));
  return res.status(200).json(final);
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
      school: SCHOOLS[0].filter(
        (s) => s._id.toString() === element.school.toString()
      )[0],
      price: element.price,
    };
  });

  res.status(200).json(final);
};

exports.getAllCoursesWithoutSchool = (req, res, next) => {
  const final = COURSES[0].map((element) => {
    const fschool = SCHOOLS[0].filter(
      (e) => element.school.toString() === e._id.toString()
    );
    return {
      _id: element._id,
      name: element.name,
      school: fschool.map((s) => ({ name: s.name, _id: s._id }))[0],
      price: element.price,
    };
  });
  return res.status(200).json(final);
};
