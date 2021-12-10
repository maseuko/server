const express = require("express");
const multer = require("multer");
const path = require("path");
const { checkSchema,body } = require("express-validator");

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
  "/add-question",
  checkSchema({
    courseId: {
      isEmpty: false,
      errorMessage: "Invalid course id!",
    },
     //tutaj jeszcze trzeba zwalidować te zmienne z tablicami ale to ogarne soon
  }),
  body('qestion','Insert correct qestion!').isEmpty(false),
  body('correctAnswears','Insert correct answear!').isEmpty(false), 
  body('falseAnswears','Insert false answear!').isEmpty(false),
  body('type','Type type :)').isEmpty(false).isAlphanumeric(),
  
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
  body('qestion','Insert correct qestion!').isEmpty(false),
  body('correctAnswears','Insert correct answear!').isEmpty(false), 
  body('falseAnswears','Insert false answear!').isEmpty(false),
  body('type','Type type :)').isEmpty(false).isAlphanumeric(),
  upload.array("images"),
  admin.modifyQuestion
); // Head admin + pod admini

module.exports = router;
