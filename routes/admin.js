const express = require("express");
const multer = require("multer");
const path = require("path");
const { checkSchema } = require("express-validator");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images/"));
  },
  filename: (req, file, cb) => {
    const currentDate = new Date();
    const name = `${currentDate.getDay()}_${currentDate.getMonth()}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}_${
      file.originalname
    }`;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();
const admin = require("../controllers/admin");

router.post(
  "/add-course",
  checkSchema({
    name: {
      isEmpty: false,
      errorMessage: "Invalid name of course!",
      isAlphanumeric: true,
      isLength: {
        min: 3,
      },
    },
    schoolId: {
      isEmpty: false,
      errorMessage: "Invalid schoolId !",
    },
  }),
  admin.createCourse
); // Head admin
router.post(
  "/delete-course",
  checkSchema({
    id: {
      isEmpty: false,
      errorMessage: "Invalid id!",
    },
  }),
  admin.deleteCourse
); // Head admin
router.post(
  "/add-question",
  checkSchema({
    courseId: {
      isEmpty: false,
      errorMessage: "Invalid course id!",
    },
    //tutaj jeszcze trzeba zwalidować te zmienne z tablicami ale to ogarne soon
  }),
  upload.array("images"),
  admin.addQuestion
); // Head admin + pod admini
router.post(
  "/remove-question",
  checkSchema({
    courseId: {
      isEmpty: false,
      errorMessage: "Invalid course id!",
    },
    questionId: {
      isEmpty: false,
      errorMessage: "Invalid question id!",
    },
  }),
  admin.removeQuestion
); // Head admin + pod admini
router.post(
  "/modify-question",
  checkSchema({
    courseId: {
      isEmpty: false,
      errorMessage: "Invalid course id!",
    },
    questionId: {
      isEmpty: false,
      errorMessage: "Invalid question id!",
    },
  }),
  upload.array("images"),
  admin.modifyQuestion
); // Head admin + pod admini

module.exports = router;
