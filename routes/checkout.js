const express = require("express");
const { checkSchema } = require("express-validator");

const controler = require("../controllers/checkout");

const router = express.Router();

router.post("/get-checkout", controler.getCheckout);
router.post("/grant-payment-access", controler.grantPermissionsAfterPayment);

module.exports = router;
