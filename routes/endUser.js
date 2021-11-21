const express = require("express");
const endUserController = require("../controllers/endUser");

const router = express.Router();

router.post("/get-all", endUserController.fetchAllQuestions);
router.post("/get-one", endUserController.fetchSingleQuestion);

module.exports = router;
