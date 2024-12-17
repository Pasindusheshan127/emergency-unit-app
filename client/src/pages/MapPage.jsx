import React, { useState } from "react";

const MapPage = () => {
  const [location, setLocation] = useState("");
  const [xDirection, setXDirection] = useState("");
  const [yDirection, setYDirection] = useState("");
  const [feedback, setFeedback] = useState(null); // For showing feedback to the user

  const handleMapButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-map-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ xDirection, yDirection }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate map URL.");
      }

      setFeedback({ type: "success", message: data.message });
      window.open(data.mapUrl, "_blank"); // Open the generated map URL in a new tab
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Google Maps Navigation</h1>
      {feedback && (
        <div
          style={{
            color: feedback.type === "success" ? "green" : "red",
            marginBottom: "10px",
          }}
        >
          {feedback.message}
        </div>
      )}

      <div>
        <label>
          X-Direction:
          <input
            type="text"
            value={xDirection}
            onChange={(e) => setXDirection(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Y-Direction:
          <input
            type="text"
            value={yDirection}
            onChange={(e) => setYDirection(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleMapButtonClick}>Map</button>
    </div>
  );
};

export default MapPage;
