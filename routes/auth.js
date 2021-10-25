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
router.get("/authorize/reset", authController.getReset);
router.post("/authorize/reset", authController.postReset);
router.get("/authorize/reset/:token", authController.getNewPassword);
router.post("/authorize/new-password", authController.postNewPassword);

module.exports = router;
