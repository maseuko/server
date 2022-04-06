const express = require("express");
const { checkSchema } = require("express-validator");

const router = express.Router();

const admin = require("../controllers/headAdmin");

router.post("/add-school", admin.addSchool);
router.post("/remove-school", admin.removeSchool);
router.post("/update-school-name", admin.modifySchoolName);
router.post(
  "/add-course",
  checkSchema({
    name: {
      isEmpty: false,
      errorMessage: "Invalid name of course!",
      isLength: {
        min: 3,
      },
    },
    schoolId: {
      isEmpty: false,
      errorMessage: "Invalid schoolId !",
    },
    price: {
      isEmpty: false,
      errorMessage: "Incorrect price",
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

router.post("/modify-course", admin.modifyCourse);
router.get("/get-all-users", admin.fetchAllUsers);
router.post("/grant-access", admin.grantAccess);
router.post("/remove-user-access", admin.removeAccess);

module.exports = router;
