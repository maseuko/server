const fs = require("fs");
const path = require("path");
const Course = require("./courses");
const COURSEDB = require("../constants/database").CURRENT_COURSES;

class CourseManager {
  static async addCourse(name) {
    try {
      const course = await Course.findOne({ name: name.trim() });

      if (course) {
        const err = new Error();
        err.msg = "Resource already exists.";
        err.statusCode = 409;
        throw err;
      }

      const splitedWords = name
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

      fs.access(filePath, (exists) => {
        if (exists) {
          fs.appendFile(filePath, "[]", async () => {
            const newCourse = new Course({
              name: name,
              path: filePath,
            });
            const result = await newCourse.save();
            COURSEDB.push(result);
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

      fs.access(course.path, async (exists) => {
        if (exists) {
          fs.unlinkSync(course.path);
          const deletedCourse = await Course.findByIdAndDelete(id);
          return {
            msg: "Course deleted succesfully.",
          };
        }
      });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CourseManager;
