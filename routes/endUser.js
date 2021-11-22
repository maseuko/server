const express = require("express");
const endUserController = require("../controllers/endUser");

const router = express.Router();

router.post("/get-all",
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

endUserController.fetchAllQuestions);
router.post(
    "/get-one",
checkSchema({
    courseId: {
      isEmpty: false,
      errorMessage: "Invalid course id!",
    },
    questionId: {
      isEmpty: false,
      errorMessage: "Invalid question id!",
    },
  }), endUserController.fetchSingleQuestion);

module.exports = router;
