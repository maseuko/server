const express = require("express");
const { checkSchema } = require("express-validator");

const controler = require("../controllers/checkout");

const router = express.Router();

router.post("/get-checkout", controler.getCheckout);

module.exports = router;
