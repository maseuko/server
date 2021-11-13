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

exports.fetchSingleQuestion = (req, res, next) => {
  CourseManager.findOne(
    "618af965dc2fd39e0a018020",
    "664e562b361b187ae85b050a7dc7c05ccb39b44d734c06beef56b15559a33fe1",
    (ques) => {
      try {
        if (!ques) {
          const err = new Error();
          err.msg = "Question not found.";
          err.statusCode = 404;
          throw err;
        }
        res.status(200).json(ques);
      } catch (err) {
        next(err);
      }
    }
  );
};

exports.removeQuestion = (req, res, next) => {
  const courseId = req.body.courseId;
  const questionId = req.body.questionId;
  Question.removeQuestion(courseId, questionId, (err) => {
    if (err) {
      return res.status(404).json({ msg: "Question not exists." });
    }
    res.status(200).json({ msg: "Question removed." });
  });
};
