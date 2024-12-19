const express = require("express");

const {
  getPoliceStations,
} = require("../controllers/policeStationsController");

const router = express.Router();

router.get("/", getPoliceStations);

module.exports = router;
