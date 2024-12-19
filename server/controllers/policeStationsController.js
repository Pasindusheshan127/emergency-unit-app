const dbClient = require("../models/db");

const getPoliceStations = async (req, res) => {
  try {
    const query = `SELECT p_id , name FROM police_stations`;
    const result = await dbClient.query(query);
    if (result.length === 0) {
      return res.status(404).json({ message: "No police stations found" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getPoliceStations };
