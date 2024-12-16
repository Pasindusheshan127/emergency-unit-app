const express = require("express");
const {
  createEmergency,
  getEmergencies,
} = require("../controllers/emergenciesContoller");

const router = express.Router();

router.post("/", createEmergency);

router.get("/", getEmergencies);

module.exports = router;
