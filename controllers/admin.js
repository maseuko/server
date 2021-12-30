const CourseManager = require("../models/CourseManager");
const Course = require("../models/courses");
const Question = require("../models/Question");
const validationChecker = require("../utils/validation-checker");
const USERSDB = require("../constants/database").USERS;

exports.addQuestion = (req, res, next) => {
  const question = JSON.parse(req.body.question);
  const courseId = req.body.courseId;
  const correctAnswears = JSON.parse(req.body.correctAnswears);
  const falseAnswears = JSON.parse(req.body.falseAnswears);
  const questionType = req.body.questionType;
  const authorId = req.get("uid");
  const author = USERSDB[0].find(
    (a) => a._id.toString() === authorId.toString()
  );

  if (question.type === "mixed") {
    const file = req.files.filter(
      (jpg) => jpg.originalname === question.imageName
    );
    question.url = `http://localhost:8080\/images\/${file[0].filename}`;
  }

  for (let corrAnswear of correctAnswears) {
    if (corrAnswear.type === "mixed") {
      const file = req.files.filter(
        (jpg) => jpg.originalname === corrAnswear.imageName
      );
      corrAnswear.url = `http://localhost:8080\/images\/${file[0].filename}`;
    }
  }

  for (let falseAnswear of falseAnswears) {
    if (falseAnswear.type === "mixed") {
      const file = req.files.filter(
        (jpg) => jpg.originalname === falseAnswear.imageName
      );
      falseAnswear.url = `http://localhost:8080\/images\/${file[0].filename}`;
    }
  }
  const pytanie = new Question(
    courseId,
    question,
    correctAnswears,
    falseAnswears,
    questionType,
    author.username
  );

  pytanie.save((obj, err) => {
    if (err) {
      return res.status(err.statusCode).json({ msg: err.msg });
    }
    res.status(201).json({ msg: "Question added.", question: obj });
  });
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

exports.modifyQuestion = (req, res, next) => {
  const filesToDetach = [];

  const question = JSON.parse(req.body.question);
  const courseId = req.body.courseId;
  const correctAnswears = JSON.parse(req.body.correctAnswears);
  const falseAnswears = JSON.parse(req.body.falseAnswears);
  const questionType = req.body.questionType;
  const questionId = req.body._id;
  const authorId = req.get("uid");
  const author = USERSDB[0].find(
    (a) => a._id.toString() === authorId.toString()
  );

  CourseManager.fetchAll(courseId, (data) => {
    const lookingQuestion = data.filter(
      (q) => q._id.toString() === questionId.toString()
    )[0];

    if (
      (lookingQuestion.question.type === "mixed" ||
        question.type === "mixed") &&
      question.type !== "text"
    ) {
      if (
        !lookingQuestion.question.imageName ||
        lookingQuestion.question.imageName !== question.imageName
      ) {
        const file = req.files.filter(
          (jpg) => jpg.originalname.toString() === question.imageName.toString()
        )[0];
        filesToDetach.push(lookingQuestion.question.url.split("/")[2]);
        question.url = `http://localhost:8080\/images\/${file.filename}`;
      } else {
        question.url = lookingQuestion.question.url;
      }
    }

    for (let i = 0; i < correctAnswears.length; i++) {
      const ran = correctAnswears[i];
      const oran = lookingQuestion.correctAnswears[i];
      if (
        (oran.type === "mixed" || ran.type === "mixed") &&
        ran.type !== "text"
      ) {
        if (
          !oran.imageName ||
          oran.imageName !== ran.imageName ||
          i >= lookingQuestion.correctAnswears.length
        ) {
          const file = req.files.filter(
            (jpg) => jpg.originalname.toString() === ran.imageName.toString()
          )[0];
          oran.url && filesToDetach.push(oran.url.split("/")[2]);
          ran.url = `http://localhost:8080\/images\/${file.filename}`;
        } else {
          ran.url = oran.url;
        }
      }
      correctAnswears[i] = ran;
    }

    for (let i = 0; i < falseAnswears.length; i++) {
      const fan = falseAnswears[i];
      const ofan = lookingQuestion.falseAnswears[i];
      if (
        (ofan.type === "mixed" || fan.type === "mixed") &&
        fan.type !== "text"
      ) {
        if (
          !ofan.imageName ||
          ofan.imageName !== fan.imageName ||
          i >= lookingQuestion.correctAnswears.length
        ) {
          const file = req.files.filter(
            (jpg) => jpg.originalname.toString() === fan.imageName.toString()
          )[0];
          ofan.url && filesToDetach.push(ofan.url.split("/")[2]);
          fan.url = `http://localhost:8080\/images\/${file.filename}`;
        } else {
          fan.url = ofan.url;
        }
      }
      falseAnswears[i] = fan;
    }

    const newUpdatedQuestion = new Question(
      courseId,
      question,
      correctAnswears,
      falseAnswears,
      questionType,
      author.username,
      questionId
    );

    CourseManager.removeImages(filesToDetach);

    newUpdatedQuestion.save((q, err) => {
      if (err) {
        return res.status(err.statusCode).json({ msg: err.msg });
      }
      res.status(202).json({ msg: "Question updated.", question: q });
    });
  });
};
