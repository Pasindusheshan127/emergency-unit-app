const dbClient = require("../models/db");

const newDutyAssign = async (req, res) => {
  const { officerId, phone_number, vehical, date } = req.body;

  const assigned_by_user_id = "pol1234";

  try {
    // Check if the officer exists
    const officerCheckQuery = `SELECT * FROM police_officers WHERE id = $1`;
    const officerResult = await dbClient.query(officerCheckQuery, [officerId]);

    if (officerResult.rowCount === 0) {
      return res.status(404).json({ error: "Officer not found." });
    }

    // Get police station name
    const stationCheckQuery = `SELECT ps.name , ps.p_id
                               FROM police_stations ps
                               INNER JOIN police_officers pf on pf.station_id = ps.p_id
                               WHERE pf.id = $1`;
    const stationResult = await dbClient.query(stationCheckQuery, [officerId]);

    if (stationResult.rowCount === 0) {
      return res.status(404).json({ error: "Station not found." });
    }

    const police_station = stationResult.rows[0].name; // Corrected typo
    const policeStationId = stationResult.rows[0].p_id;

    // Check if the phone number matches the officer
    if (officerResult.rows[0].phone_number !== phone_number) {
      return res
        .status(400)
        .json({ error: "Phone number does not match with the officerId." });
    }

    // Insert the new record into the duty_assignments table
    const insertQuery = `INSERT INTO duty_assignments (officer_id, police_station, phone_number, vehical, date, assigned_by_user_id)
                         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    const insertResult = await dbClient.query(insertQuery, [
      officerId,
      policeStationId,
      phone_number,
      vehical,
      date,
      assigned_by_user_id,
    ]);

    // Emit real-time update to all connected clients
    req.io.emit("dutyAssigned", insertResult.rows[0]);

    // Return success response with new duty assignment
    res.status(201).json({
      message: "New duty assignment created successfully.",
      duty_assignment: insertResult.rows[0],
      station: police_station, // Corrected here
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

    res.status(200).json({
      message: "Officers found successfully.",
      officers: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error." });
  }
};

//get all duty assignments
const getAllAssignments = async (req, res) => {
  try {
    const getAllAssignmentsQuery = `SELECT * FROM duty_assignments`;
    const result = await dbClient.query(getAllAssignmentsQuery);
    res.status(200).json({
      message: "All duty assignments found successfully.",
      assignments: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { newDutyAssign, getOfficers, getAllAssignments };
