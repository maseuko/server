const express = require("express");

const router = express.Router();
const admin = require("../controllers/admin");

router.get("/add-course", admin.createCourse);

module.exports = router;
