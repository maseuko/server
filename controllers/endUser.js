const CourseManager = require("../models/CourseManager");
const COURSES = require("../constants/database").CURRENT_COURSES;

exports.fetchAllQuestions = (req, res, next) => {
  const courseId = req.body.courseId;
  const courseIndex = COURSES[0].findIndex(
    (q) => q._id.toString() === courseId.toString()
  );
  if (!(courseIndex >= 0)) {
    return res.status(404).json({ msg: "Course not exists." });
  }

  CourseManager.fetchAll(courseId, (questions) => {
    res.status(200).json({ questions });
  });
};

exports.fetchSingleQuestion = (req, res, next) => {
  const courseId = req.body.courseId;
  const questionId = req.body.questionId;

  const courseIndex = COURSES[0].findIndex(
    (q) => q._id.toString() === courseId.toString()
  );
  if (!(courseIndex >= 0)) {
    return res.status(404).json({ msg: "Course not exists." });
  }

  CourseManager.findOne(courseId, questionId, (question) => {
    if (!question) {
      return res.status(404).json({ msg: "Question not found." });
    }
    res.status(200).json({ question });
  });
};
