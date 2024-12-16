const dbClient = require("../models/db");

const assignOfficer = async (req, res) => {
  const { emergency_id, officer_id } = req.body;

  const assigned_by_user_id = "pol123";

  try {
    const query = `INSERT INTO officer_assignments (emergency_id, officer_id, assigned_by_user_id) 
    VALUES ($1,$2,$3) RETURNING *`;

    const values = [emergency_id, officer_id, assigned_by_user_id];

    const result = await dbClient.query(query, values);

    const assignment = result.rows[0];

    // Emit the officer assignment to all connected clients
    req.io.emit("officerAssigned", assignment);

    res.status(200).json(assignment);
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
    oa.officer_id
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
