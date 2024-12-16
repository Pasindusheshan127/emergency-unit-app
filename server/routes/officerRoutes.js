const express = require("express");
const {
  assignOfficer,
  getassignOfficer,
} = require("../controllers/officerController");

const router = express.Router();

router.post("/", assignOfficer);
router.get("/", getassignOfficer);

module.exports = router;
