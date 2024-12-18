const dbClient = require("../models/db");

const getOfficerEmergencies = async (req, res) => {
  const { officer_id } = req.params; // Capture officer_id from URL parameter

  try {
    // Validate officer_id
    if (!officer_id) {
      return res.status(400).json({ error: "Officer ID is required" });
    }

    // Query to fetch emergencies assigned to the officer
    const query = `
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

    const result = await dbClient.query(query, [officer_id]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No emergencies found for this officer" });
    }

    // Send response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching officer dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getOfficerEmergencies };
