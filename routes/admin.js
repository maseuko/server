const express = require("express");
const multer = require("multer");
const path = require("path");

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

router.post("/add-school", admin.addSchool);
router.post("/delete-school", admin.removeSchool);
router.post("/add-course", admin.createCourse); // Head admin
router.post("/delete-course", admin.deleteCourse); // Head admin
router.post("/add-question", upload.array("images"), admin.addQuestion); // Head admin + pod admini
router.post("/remove-question", admin.removeQuestion); // Head admin + pod admini
router.post("/modify-question", upload.array("images"), admin.modifyQuestion); // Head admin + pod admini

module.exports = router;
