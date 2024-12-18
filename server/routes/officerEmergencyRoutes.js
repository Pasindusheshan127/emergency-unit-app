const express = require("express");
const {
  getOfficerEmergencies,
} = require("../controllers/policeOfficerEmergenciesController");

const router = express.Router();

// Use officer ID from the URL
router.get("/:officer_id", getOfficerEmergencies);

module.exports = router;
