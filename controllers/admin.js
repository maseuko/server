const CourseManager = require("../models/CourseManager");
const Question = require("../models/Question");
const validationChecker = require("../utils/validation-checker");

exports.createCourse = async (req, res, next) => {
  const courseName = req.body.name;
  try {
    validationChecker(req);
    const result = await CourseManager.addCourse(courseName);
    res.status(201).json(result);
  } catch (err) {
    console.log("ok2");
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

exports.addQuestion = (req, res, next) => {
  const pytanie = new Question(
    "618af965dc2fd39e0a018020",
    { type: "text", value: "Pierwsze pytanie." },
    [{ type: "text", value: "Poprawna odp" }],
    [
      { type: "text", value: "Zla odp 1" },
      { type: "text", value: "Zla odp 2" },
      { type: "text", value: "Zla odp 3" },
    ],
    "single"
  );

  pytanie.save();
};

exports.fetchAllQuestions = (req, res, next) => {
  try {
    CourseManager.fetchAll("618af965dc2fd39e0a018020", (ques) => {
      res.status(200).json({ all: ques });
    });
  } catch (err) {}
};
