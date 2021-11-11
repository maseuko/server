const express = require("express");

const router = express.Router();
const admin = require("../controllers/admin");

router.post("/add-course", admin.createCourse);
router.post("/delete-course", admin.deleteCourse);
router.get("/add-question", admin.addQuestion);
router.get("/all", admin.fetchAllQuestions);

module.exports = router;
