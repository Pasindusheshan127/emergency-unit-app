const express = require("express");

const {
  getPoliceOfficers,
} = require("../controllers/policeOfficersController");

const router = express.Router();

router.get("/", getPoliceOfficers);

module.exports = router;
