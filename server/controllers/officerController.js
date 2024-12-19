const dbClient = require("../models/db");

const assignOfficer = async (req, res) => {
  const { emergency_id, officer_id } = req.body;

  const assigned_by_user_id = "pol123";
  const user_station_id = 111;

  try {
    // Step 1: Check if the emergency exists
    const emergencyCheckQuery = `SELECT * FROM emergencies WHERE e_id = $1`;
    const emergencyResult = await dbClient.query(emergencyCheckQuery, [
      emergency_id,
    ]);
    if (emergencyResult.rows.length === 0) {
      return res.status(404).json({ error: "Emergency not found." });
    }

    // Step 2: Check if the police officer exists
    const officerCheckQuery = `SELECT * FROM police_officers WHERE phone_number = $1`;
    const officerResult = await dbClient.query(officerCheckQuery, [officer_id]);
    if (officerResult.rows.length === 0) {
      return res.status(404).json({ error: "Police officer not found." });
    }

    // Step 4: Insert a new record in the officer_assignments table
    const insertAssignmentQuery = `INSERT INTO officer_assignments (emergency_id, officer_id, assigned_by_user_id, user_station_id) 
    VALUES ($1,$2,$3,$4) RETURNING *`;
    const insertAssignmentResult = await dbClient.query(insertAssignmentQuery, [
      emergency_id,
      officer_id,
      assigned_by_user_id,
      user_station_id,
    ]);

    //step 4 : get the id(officer_assignments) according to the emergency from the officer_assignments table
    const officerAssignmentQuery = `SELECT id FROM officer_assignments WHERE emergency_id = $1`;
    const officerAssignmentResult = await dbClient.query(
      officerAssignmentQuery,
      [emergency_id]
    );

    //step 5: Update the station_assignments  record with the id which was get from the officer_assignments table
    const updateStationQuery = `UPDATE station_assignments SET officer_assignment_id = $1 WHERE emergency_id = $2`;
    await dbClient.query(updateStationQuery, [
      officerAssignmentResult.rows[0].id,
      emergency_id,
    ]);

    const newOfficerAssignedQ = `
        SELECT 
    e.e_id AS emergency_id,
    e.name AS emergency_name,
    e.phone_number,
    e.location_latitude,
    e.location_longitude,
    e.created_at AS emergency_created_at,
    os.assigned_at AS officer_assigned_at,
    e.checked_by_officer
FROM 
    officer_assignments os
INNER JOIN 
    emergencies e ON os.emergency_id = e.e_id
WHERE 
    os.officer_id = $1 
    AND e.checked_by_officer IS NOT TRUE
ORDER BY 
    os.assigned_at DESC;
`;

    const newOfficerAssigned = await dbClient.query(newOfficerAssignedQ, [
      officer_id,
    ]);

    // Emit real-time update to all connected clients
    req.io.emit("officerAssigned", {
      emergency: newOfficerAssigned.rows[0],
      station_id: user_station_id,
      officer_id: officer_id,
    });

    // Return success response with updated station_assignments data and new assignment record
    res.status(200).json({
      message: "Officer assigned successfully.",
      officer: insertAssignmentResult.rows[0],
      station_id: user_station_id,
    });

    // const query = `INSERT INTO officer_assignments (emergency_id, officer_id, assigned_by_user_id, user_station_id)
    // VALUES ($1,$2,$3,$4) RETURNING *`;

    // const values = [
    //   emergency_id,
    //   officer_id,
    //   assigned_by_user_id,
    //   user_station_id,
    // ];

    // const result = await dbClient.query(query, values);

    // const assignment = result.rows[0];

    // Emit the officer assignment to all connected clients
    // req.io.emit("officerAssigned", assignment);

    // res.status(200).json(assignment);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error assigning emergency to station " + station_id });
  }
};

const getassignOfficer = async (req, res) => {
  const query = `SELECT 
    e.e_id AS incident_id,
    sa.assigned_by_user_id,
    sa.station_id AS station_id,
    sa.assigned_at,
    oa.officer_id,
	oa.user_station_id,
	oa.id
FROM 
    emergencies e
JOIN 
    station_assignments sa ON e.e_id = sa.emergency_id
LEFT JOIN 
    officer_assignments oa ON e.e_id = oa.emergency_id`;
  try {
    const result = await dbClient.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Faild to fetch data" });
  }
};

module.exports = { assignOfficer, getassignOfficer };
