const express = require("express");

const {
  newDutyAssign,
  getOfficers,
  getAllAssignments,
} = require("../controllers/emergencyDutyAssigningController");

const router = express.Router();

//new duty assign route
router.post("/", newDutyAssign);

//get duty assign officer
router.get("/:officerId", getOfficers);

// get all duty assignments
router.get("/", getAllAssignments);

module.exports = router;
