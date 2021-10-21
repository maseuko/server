const express = require('express');
const {checkSchema} = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', checkSchema({
    username: {
        isEmpty: false,
        errorMessage: "Invalid username.",
        isAlphanumeric: true
    },
    email: {
        isEmpty: false,
        isEmail: true,
        errorMessage: "Invalid email."
    },
    password: {
        isEmpty: false,
        isAlphanumeric: true,
        errorMessage: "Invalid password."
    }
}) ,authController.register);
router.post('/login', authController.login);

module.exports = router;