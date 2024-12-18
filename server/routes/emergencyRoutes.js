const express = require("express");
const {
  createEmergency,
  getEmergencies,
  markEmergency,
} = require("../controllers/emergenciesContoller");

const router = express.Router();

router.post("/", createEmergency);

router.get("/", getEmergencies);

router.patch("/:id/mark-checked", markEmergency);

module.exports = router;
