const express = require("express");
const endUserController = require("../controllers/endUser");
const { checkSchema } = require("express-validator");

const router = express.Router();

router.post(
  "/get-all",
  checkSchema({
    courseId: {
      isEmpty: false,
      errorMessage: "Invalid course id!",
    },
  }),

  endUserController.fetchAllQuestions
);
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
  }),
  endUserController.fetchSingleQuestion
);

router.post("/send-email", endUserController.sendEmail);
router.post("/get-all-messages", endUserController.getAllMessages);
router.post("/email-readed", endUserController.mailReaded);
router.post("/delete-messages", endUserController.deleteMessage);

module.exports = router;
