const dbClient = require("../models/db");

// Insert new emergencies
const createEmergency = async (req, res) => {
  const { name, phone_number, location_latitude, location_longitude } =
    req.body;

  const time = new Date();

  try {
    const query = `INSERT INTO emergencies (name , phone_number, location_latitude, location_longitude, created_at ) VALUES ($1 , $2 , $3, $4 , $5 ) RETURNING *`;
    const values = [
      name,
      phone_number,
      location_latitude,
      location_longitude,
      time,
    ];

    const result = await dbClient.query(query, values);
    const newEmergency = result.rows[0];

    // Emit the new emergency to all connected clients
    req.io.emit("newEmergency", newEmergency);

    res.status(201).json(newEmergency);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Faild to create emergency" });
  }
};

//get all emergencies

const getEmergencies = async (req, res) => {
  const query = `SELECT * FROM emergencies ORDER BY created_at DESC`;
  try {
    const result = await dbClient.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Faild to fetch data" });
  }
};

// Endpoint to mark an emergency as checked
const markEmergency = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `UPDATE emergencies SET checked_by_officer = true WHERE e_id = $1 RETURNING *`;
    const values = [id];

    const result = await dbClient.query(query, values);
    // console.log("Query result:", result); // Log the result

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Emergency not found" });
    }

    res.status(200).json({
      message: "Emergency marked as checked",
      emergency: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEmergency, getEmergencies, markEmergency };
