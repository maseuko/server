const express = require("express");
const { checkSchema } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  checkSchema({
    username: {
      isEmpty: false,
      errorMessage: "Invalid username.",
      isAlphanumeric: true,
      isLength: {
        min: 2,
      },
    },
    email: {
      isEmpty: false,
      isEmail: true,
      errorMessage: "Invalid email.",
    },
    password: {
      isEmpty: false,
      isAlphanumeric: true,
      errorMessage:
        "Invalid password. Password should be only alphanumeric and atleast 8 characters long.",
      isLength: {
        min: 8,
      },
    },
  }),
  authController.register
);
router.post(
  "/login",
  checkSchema({
    email: {
      isEmpty: false,
      isEmail: true,
      errorMessage: "Invalid email.",
    },
    password: {
      isEmpty: false,
      isAlphanumeric: true,
      errorMessage:
        "Invalid password. Password should be only alphanumeric and atleast 8 characters long.",
      isLength: {
        min: 8,
      },
    },
  }),
  authController.login
);

router.post("/authorize/:uid/:token", authController.authorizeAccount);
router.post(
  "/authorize/get-reset",
  checkSchema({
    email: {
      isEmail: true,
      isEmpty: false,
      errorMessage: "Invalid email address.",
    },
  }),
  authController.getReset
);
router.post(
  "/authorize/check-token",
  checkSchema({
    _id: {
      isEmpty: false,
      errorMessage: "Invalid id.",
    },
    token: {
      isEmpty: false,
    },
  }),
  authController.checkResetToken
);
router.post(
  "/authorize/new-password",
  checkSchema({
    password: {
      isEmpty: false,
      isAlphanumeric: true,
      errorMessage:
        "Invalid password. Password should be only alphanumeric and atleast 8 characters long.",
      isLength: {
        min: 8,
      },
    },
    uid: {
      isEmpty: false,
      errorMessage: "Invalid user id",
    },
    passwordToken: {
      isEmpty: false,
      errorMessage: "Invalid reset token.",
    },
  }),
  authController.postNewPassword
);

router.post(
  "/login-checker",
  checkSchema({
    uid: {
      isEmpty: false,
    },
    token: {
      isEmpty: false,
    },
    rememberToken: {
      isEmpty: false,
    },
  }),
  authController.loginChecker
);

module.exports = router;
