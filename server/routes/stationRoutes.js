const express = require("express");
const {
  assignStation,
  getassignStation,
} = require("../controllers/stationController");

const router = express.Router();

router.post("/", assignStation);
router.get("/", getassignStation);

module.exports = router;
