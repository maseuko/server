const express = require("express");

const router = express.Router();

const controller = require("../controllers/dafaultData");

router.get("/get-all-schools", controller.getAllSchools);
router.post("/get-all-courses", controller.getAllCourses);
router.get("/get-all-courses", controller.getAllCoursesWithoutSchool);
module.exports = router;
