const crypto = require("crypto");
const fs = require("fs");
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

  save() {
    CourseManager.fetchAll("618af965dc2fd39e0a018020", (data) => {
      data.push(this);
      CourseManager.updateFile("618af965dc2fd39e0a018020", data);
    });
  }

  static removeQuestion() {}
}

module.exports = Question;
