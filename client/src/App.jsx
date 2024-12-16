import "./App.css";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EmergencyCenterPage } from "./pages/EmergencyCenterPage";
import EmergencyDashboard from "./pages/EmergencyDashboard";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("newEmergency", (data) => {
      console.log("New emergency received:", data);
    });

    socket.on("stationAssigned", (data) => {
      console.log("Station assigned:", data);
    });

    socket.on("officerAssigned", (data) => {
      console.log("Officer assigned:", data);
    });

    // Cleanup to avoid memory leaks
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<EmergencyCenterPage />} />
          <Route path="/emergency-dashboard" element={<EmergencyDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
