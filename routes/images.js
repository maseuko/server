const express = require("express");

const imagesController = require("../controllers/images");

const router = express.Router();

router.get("/images/:imageName", imagesController.getImage);

module.exports = router;
