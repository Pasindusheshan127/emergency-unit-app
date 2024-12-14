const express = require("express");
const EmergencyController = require("../controllers/emergencyController");

const router = express.Router();

router.post("/emergencies", EmergencyController.createEmergency);
router.get("/emergencies", EmergencyController.getEmergencies);

module.exports = router;
