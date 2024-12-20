const dbClient = require("../models/db");

//post : assign station

const assignStation = async (req, res) => {
  const { emergency_id, station_id } = req.body;

  const assigned_by_user_id = "ps123";

  try {
    // Step 1: Check if the emergency exists
    const emergencyCheckQuery = `SELECT * FROM emergencies WHERE e_id = $1`;
    const emergencyResult = await dbClient.query(emergencyCheckQuery, [
      emergency_id,
    ]);
    if (emergencyResult.rows.length === 0) {
      return res.status(404).json({ error: "Emergency not found." });
    }

    // Step 2: Check if the police station exists
    const stationCheckQuery = `SELECT * FROM police_stations WHERE p_id = $1`;
    const stationResult = await dbClient.query(stationCheckQuery, [station_id]);

    if (stationResult.rows.length === 0) {
      return res.status(404).json({ error: "Police station not found." });
    }

    // Step 3: Update the emergency record with the assigned police station

    const updateEmergencyQuery = `UPDATE emergencies SET assigned_station_id = $1 WHERE e_id = $2  RETURNING *`;
    const updateEmergencyResult = await dbClient.query(updateEmergencyQuery, [
      station_id,
      emergency_id,
    ]);

    // Step 4: Insert a new record in the station_assignments table
    const insertAssignmentQuery = `INSERT INTO station_assignments (emergency_id, station_id, assigned_by_user_id) 
    VALUES ($1,$2,$3) RETURNING *`;

    const insertAssignmentResult = await dbClient.query(insertAssignmentQuery, [
      emergency_id,
      station_id,
      assigned_by_user_id,
    ]);

    //get new station_assignments
    const newAssignementQ = `SELECT 
    e.name AS emergency_name,
    CONCAT(e.location_latitude, ', ', e.location_longitude) AS emergency_location,
    e.phone_number,
    sa.assigned_at,
	sa.station_id,
	e.e_id,
  sa.s_id,
	sa.assigned_by_user_id,
  sa.officer_assignment_id
FROM 
    emergencies e
JOIN 
    station_assignments sa ON e.e_id = sa.emergency_id
ORDER BY assigned_at`;

    const newAssignments = await dbClient.query(newAssignementQ);

    // Emit real-time update to all connected clients
    req.io.emit("stationAssigned", {
      emergency: updateEmergencyResult.rows[0],
      assignment: newAssignments.rows[newAssignments.rows.length - 1],
    });

    // Return success response with updated emergency data and new assignment record
    res.status(200).json({
      message: "Police station assigned successfully and assignment recorded.",
      emergency: updateEmergencyResult.rows[0], // Updated emergency record
      assignment: insertAssignmentResult.rows[0], // New assignment record
    });

    // const values = [emergency_id, station_id, assigned_by_user_id];

    // const result = await dbClient.query(query, values);

    // const assignment = result.rows[0];

    //Emit the station assignment to all connected clients
    // req.io.emit("stationAssigned", assignment);

    // res.status(200).json(assignment);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error assigning emergency to station " + station_id });
  }
};

const getassignStation = async (req, res) => {
  const query = `SELECT 
    e.name AS emergency_name,
    CONCAT(e.location_latitude, ', ', e.location_longitude) AS emergency_location,
    e.phone_number,
    sa.assigned_at,
	sa.station_id,
	e.e_id,
  sa.s_id,
	sa.assigned_by_user_id,
  sa.officer_assignment_id
FROM 
    emergencies e
JOIN 
    station_assignments sa ON e.e_id = sa.emergency_id
ORDER BY assigned_at`;
  try {
    const result = await dbClient.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Faild to fetch data" });
  }
};

module.exports = { assignStation, getassignStation };
