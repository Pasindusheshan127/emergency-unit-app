const dbClinet = require("../models/db");

const getPoliceOfficers = async (req, res) => {
  try {
    const query = ` SELECT id, name, phone_number , station_id FROM police_officers`;
    const result = await dbClinet.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: "No police officers found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  } finally {
    await dbClinet.end();
  }
};

module.exports = { getPoliceOfficers };
