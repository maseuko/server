const CourseManager = require("../models/CourseManager");
const Course = require("../models/courses");
const Question = require("../models/Question");
const School = require("../models/School");
const validationChecker = require("../utils/validation-checker");

exports.addSchool = async (req, res, next) => {
  const err = new Error();
  const schoolName = req.body.schoolName;

  try {
    validationChecker();
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
        CourseManager.removeCourse(course.school);
      }
    }
    res.status(200).json({ msg: "School removed." });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  const name = req.body.name;
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
    const result = await CourseManager.addCourse({ name, school: schoolId });
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
// Do nowego konrolera ------------------------------------------------
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
    "f6f57fd320038e2e5492f629c6620046cb3fbca2cdef20d43c16d56677d99f2f",
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
// ---------------------------------------------------------------------
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
      questionId
    );

    CourseManager.removeImages(filesToDetach);

    newUpdatedQuestion.save((q) => {
      res.status(202).json({ msg: "Question updated.", question: q });
    });
  });
};
