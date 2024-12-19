import React from "react";
import { Link } from "react-router-dom";

const PoliceStationDashboard = () => {
  const stations = [
    { id: 111, name: "Station A" },
    { id: 112, name: "Station B" },
    { id: 113, name: "Station C" },
    // Add more stations here
  ];

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Police Stations</h1>
      <div className="grid grid-cols-3 gap-4">
        {stations.map((station) => (
          <Link
            key={station.id}
            to={`/policeStations-dashboard/station/${station.id}`}
            className="px-6 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600"
          >
            {station.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PoliceStationDashboard;
