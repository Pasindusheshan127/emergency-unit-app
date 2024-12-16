const dbClient = require("../models/db");

//post : assign station

const assignStation = async (req, res) => {
  const { emergency_id, station_id } = req.body;

  const assigned_by_user_id = "ps123";

  try {
    const query = `INSERT INTO station_assignments (emergency_id, station_id, assigned_by_user_id) 
    VALUES ($1,$2,$3) RETURNING *`;

    const values = [emergency_id, station_id, assigned_by_user_id];

    const result = await dbClient.query(query, values);

    const assignment = result.rows[0];

    //Emit the station assignment to all connected clients
    req.io.emit("stationAssigned", assignment);

    res.status(200).json(assignment);
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
  	e.e_id
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
