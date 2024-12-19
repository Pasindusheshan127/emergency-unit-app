import "./App.css";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EmergencyCenterPage } from "./pages/EmergencyCenterPage";
import EmergencyDashboard from "./pages/EmergencyDashboard";
import PoliceStationDashboard from "./pages/PoliceStationDashboard";
import StationOfficerDashboardPage from "./pages/StationOfficerDashboardPage";
import EmergencyStationAssignDashboard from "./pages/EmergencyStationAssignDashboard";
import PoliceOfficerDashboard from "./pages/PoliceOfficerDashboard";
import PoliceStation from "./pages/PoliceStation";
import PoliceOfficer from "./pages/PoliceOfficer";
import MainDashboard from "./pages/MainDashboard";

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
          <Route
            path="/policeStations-dashboard"
            element={<PoliceStationDashboard />}
          />
          <Route path="/main-dashboard" element={<MainDashboard />} />

          <Route
            path="/policeStations-dashboard/station/:stationId"
            element={<PoliceStation />}
          />
          <Route
            path="/StationOfficer-dashboard"
            element={<StationOfficerDashboardPage />}
          />
          <Route
            path="/emergency-station-assign-dashboard"
            element={<EmergencyStationAssignDashboard />}
          />

          <Route
            path="/policeOfficers-dashboard"
            element={<PoliceOfficerDashboard />}
          />
          <Route
            path="/policeOfficers-dashboard/officer/:officerId"
            element={<PoliceOfficer />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
