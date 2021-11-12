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
  const question = JSON.parse(req.body.question);
  const courseId = req.body.courseId;
  const correctAnswears = JSON.parse(req.body.correctAnswears);
  const falseAnswears = JSON.parse(req.body.falseAnswears);
  const questionType = req.body.questionType;

  if (question.type === "mixed") {
    const file = req.files.filter(
      (jpg) => jpg.originalname === question.imageName
    );
    question.url = `localhost:8080\/images\/${file[0].filename}`;
  }

  for (let corrAnswear of correctAnswears) {
    if (corrAnswear.type === "mixed") {
      const file = req.files.filter(
        (jpg) => jpg.originalname === corrAnswear.imageName
      );
      corrAnswear.url = `localhost:8080\/images\/${file[0].filename}`;
    }
  }

  for (let falseAnswear of falseAnswears) {
    if (falseAnswear.type === "mixed") {
      const file = req.files.filter(
        (jpg) => jpg.originalname === falseAnswear.imageName
      );
      falseAnswear.url = `localhost:8080\/images\/${file[0].filename}`;
    }
  }
  const pytanie = new Question(
    courseId,
    question,
    correctAnswears,
    falseAnswears,
    questionType
  );

  pytanie.save((obj) => {
    res.status(201).json({ msg: "Question added.", question: obj });
  });
};

exports.fetchAllQuestions = (req, res, next) => {
  try {
    CourseManager.fetchAll("618af965dc2fd39e0a018020", (ques) => {
      res.status(200).json({ all: ques });
    });
  } catch (err) {}
};
