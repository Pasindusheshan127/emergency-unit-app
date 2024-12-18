const getGooglemapUrl = (req, res) => {
  const { xDirection, yDirection } = req.body;

  // Check for missing fields
  if (!xDirection || !yDirection) {
    return res.status(400).json({
      success: false,
      message:
        "Both xDirection (latitude) and yDirection (longitude) are required.",
    });
  }

  // Correct Base URL
  const baseUrl = "https://www.google.com/maps";

  // Pin Location (general view with marker)
  const pinLocationUrl = `${baseUrl}?q=${xDirection},${yDirection}`;

  // Directions URL (driving directions)
  const directionsUrl = `${baseUrl}/dir/?api=1&destination=${xDirection},${yDirection}`;

  return res.status(200).json({
    success: true,
    message: "Google Maps URLs generated successfully.",
    pinLocationUrl,
    directionsUrl,
  });
};

module.exports = { getGooglemapUrl };
