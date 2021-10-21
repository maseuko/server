const express = require('express');
const {checkSchema} = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', checkSchema({
    username: {
        require: true,
        errorMessage: "Invalid username.",
        isAlphanumeric: true
    },
    email: {
        require: true,
        isEmail: true,
        errorMessage: "Invalid email."
    },
    password: {
        require: true,
        isAlphanumeric: true,
        errorMessage: "Invalid password."
    }
}) ,authController.register);
router.post('/login', authController.login);

module.exports = router;