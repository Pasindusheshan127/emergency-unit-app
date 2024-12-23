const dbClient = require("../models/db");

const newDutyAssign = async (req, res) => {
  const { officerId, pollice_station, phone_number, vehical } = req.body;

  const assigned_by_user_id = "pol1234";

  const currentDate = new Date();

  try {
    //check if the user is already assigned

    //check if the officer is existing
    const officerCheckQuery = `SELECT * FROM police_officers 	WHERE id = $1`;
    const officerResult = await dbClient.query(officerCheckQuery, [officerId]);

    if (officerResult.length === 0) {
      return res.status(404).json({ error: "Officer not found." });
    }

    //check if the police station is existing

    const stationCheckQuery = `SELECT * FROM police_stations 	WHERE p_id = $1`;
    const stationResult = await dbClient.query(stationCheckQuery, [
      pollice_station,
    ]);

    if (stationResult.length === 0) {
      return res.status(404).json({ error: "Station not found." });
    }

    //check if the phone number is match with the officerId (if it)
    if (officerResult.length === 0) {
      if (officerResult.phone_number !== phone_number) {
        return res
          .status(400)
          .json({ error: "Phone number does not match with the officerId." });
      }
    }

    //insert the new record into the duty_assignments table
    const insertQuery = `INSERT INTO duty_assignments (officer_id,police_station,date,phone_number,vehical,assigned_by_user_id)
VALUES ($1 ,$2,$3,$4,$5,$6)  RETURNING *`;

    const insertResult = await dbClient.query(insertQuery, [
      officerId,
      pollice_station,
      currentDate,
      phone_number,
      vehical,
      assigned_by_user_id,
    ]);

    //emit real time update to all connected clients
    req.io.emit("dutyAssigned", insertResult.rows[0]);

    //Return success response with new duty assignment
    res.status(201).json({
      message: "New duty assignment created successfully.",
      duty_assignment: insertResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error." });
  }
};

const getOfficers = async (req, res) => {
  const { officerId } = req.params;

  try {
    const getOfficerQuery = `SELECT d.officer_id , p.name 
FROM duty_assignments d
INNER JOIN police_officers p ON d.officer_id = p.id
	WHERE officer_id = $1`;
    const result = await dbClient.query(getOfficerQuery, [officerId]);

    //return success response with officers
    res.status(200).json({
      message: "Officers found successfully.",
      officers: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { newDutyAssign, getOfficers };
