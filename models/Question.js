const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const CourseManager = require("./CourseManager");

class Question {
  constructor(courseId, question, correctAnswears, falseAnswears, type) {
    this.courseId = courseId;
    this.question = question;
    this.correctAnswears = correctAnswears;
    this.falseAnswears = falseAnswears;
    this.type = type;
    crypto.randomBytes(32, (err, result) => {
      this._id = result.toString("hex");
    });
  }

  save(cb) {
    CourseManager.fetchAll("618af965dc2fd39e0a018020", (data) => {
      data.push(this);
      CourseManager.updateFile("618af965dc2fd39e0a018020", data);
      cb(this);
    });
  }

  static removeQuestion(courseId, questionId, cb) {
    const filesToDetach = [];
    CourseManager.fetchAll(courseId, (questions) => {
      const qIndex = questions.findIndex(
        (q) => q._id.toString() === questionId.toString()
      );
      if (qIndex < 0) {
        const err = new Error();
        err.msg = "Question not found.";
        err.statusCode = 404;
        return cb(err);
      }

      const questionToDelete = questions[qIndex];

      if (questionToDelete.question.type === "mixed") {
        const fileName = questionToDelete.question.url.split("/");
        filesToDetach.push(fileName[2]);
      }

      for (let rightAnsw of questionToDelete.correctAnswears) {
        if (rightAnsw.type === "mixed") {
          const fileName = rightAnsw.url.split("/");
          filesToDetach.push(fileName[2]);
        }
      }

      for (let falseAnsw of questionToDelete.falseAnswears) {
        if (falseAnsw.type === "mixed") {
          const fileName = falseAnsw.url.split("/");
          filesToDetach.push(fileName[2]);
        }
      }

      console.log(filesToDetach);

      filesToDetach.forEach((file) => {
        fs.access(path.join(__dirname, "../images", file), (notExists) => {
          if (!notExists) {
            fs.unlink(path.join(__dirname, "../images", file), (err) => {});
          }
        });
      });

      const newArr = questions.filter(
        (q) => q._id.toString() !== questionId.toString()
      );

      CourseManager.updateFile(courseId, newArr);
      cb(null);
    });
  }
}

module.exports = Question;
