const express = require("express");

const {
  newDutyAssign,
  getOfficers,
} = require("../controllers/emergencyDutyAssigningController");

const router = express.Router();

//new duty assign route
router.post("/", newDutyAssign);

//get duty assign officers
router.get("/:officerId", getOfficers);

module.exports = router;
