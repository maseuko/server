const fs = require("fs");
const path = require("path");
const Course = require("./courses");
const COURSEDB = require("../constants/database").CURRENT_COURSES;

class CourseManager {
  static async addCourse(courseData) {
    try {
      const course = await Course.findOne({ name: courseData.name.trim() });

      if (course) {
        const err = new Error();
        err.msg = "Resource already exists.";
        err.statusCode = 409;
        throw err;
      }

      const splitedWords = courseData.name
        .toLowerCase()
        .split(/(\s+)/)
        .filter((e) => e.trim().length > 0);
      let fileName;

      for (let i = 0; i < splitedWords.length; i++) {
        if (i === 0) {
          fileName = splitedWords[0];
          continue;
        }
        fileName += `-${splitedWords[i]}`;
      }
      fileName += ".json";

      const filePath = path.join(__dirname, `../data/${fileName}`);

      fs.access(filePath, (notExists) => {
        if (notExists) {
          fs.appendFile(filePath, "[]", async () => {
            const newCourse = new Course({
              name: courseData.name,
              path: filePath,
              school: courseData.school,
              price: courseData.price,
            });
            const result = await newCourse.save();
            COURSEDB[0].push(result);
            return {
              msg: "Course added.",
              course: {
                name: result.name,
                _id: result._id.toString(),
              },
            };
          });
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static async removeCourse(id) {
    try {
      const course = await Course.findById(id);
      if (!course) {
        const err = new Error();
        err.msg = "Resource not exists.";
        err.statusCode = 404;
        throw err;
      }

      fs.access(course.path, async (notExists) => {
        if (!notExists) {
          try {
            fs.unlink(course.path.toString(), (err) => {
              if (err) {
                err.statusCode = 409;
                throw err;
              }
            });
            const deletedCourse = await Course.findByIdAndDelete(id);
            const updatedDB = COURSEDB[0].filter(
              (c) => c._id.toString() !== id.toString()
            );
            COURSEDB[0] = updatedDB;
            return {
              msg: "Course deleted succesfully.",
            };
          } catch (err) {
            throw err;
          }
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static fetchAll(id, cb) {
    let course = COURSEDB[0].filter(
      (course) => course._id.toString() === id.toString()
    );
    course = course[0];
    if (!course) {
      const err = new Error();
      err.statusCode = 404;
      err.msg = "Course not exists";
      throw err;
    }
    fs.readFile(course.path, (err, data) => {
      if (data) {
        cb(JSON.parse(data));
      } else {
        cb([]);
      }
    });
  }

  static updateFile(id, value) {
    let course = COURSEDB[0].filter(
      (course) => course._id.toString() === id.toString()
    );
    course = course[0];

    fs.writeFile(course.path, JSON.stringify(value), () => {});
  }

  static findOne(courseId, questionId, cb) {
    this.fetchAll(courseId, (questions) => {
      const question = questions.filter(
        (q) => q._id.toString() === questionId.toString()
      );

      cb(question[0]);
    });
  }

  static removeImages(filesToDetach) {
    filesToDetach.forEach((file) => {
      fs.access(path.join(__dirname, "../images", file), (notExists) => {
        if (!notExists) {
          fs.unlink(path.join(__dirname, "../images", file), (err) => {});
        }
      });
    });
  }
}

module.exports = CourseManager;
