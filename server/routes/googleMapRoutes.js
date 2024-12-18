const express = require("express");
const { getGooglemapUrl } = require("../controllers/googleMapController");

const router = express.Router();

router.post("/", getGooglemapUrl);

module.exports = router;
