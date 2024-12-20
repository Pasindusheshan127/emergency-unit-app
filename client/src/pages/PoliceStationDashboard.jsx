import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PoliceStationDashboard = () => {
  const [stations, setStations] = useState([]);

  // const stations = [
  //   { id: 111, name: "Station A" },
  //   { id: 112, name: "Station B" },
  //   { id: 113, name: "Station C" },
  //   // Add more stations here
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/police-stations"
        );
        if (response.status === 200) {
          setStations(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Police Stations</h1>
      <div className="grid grid-cols-3 gap-4">
        {stations.map((station) => (
          <Link
            key={station.p_id}
            to={`/policeStations-dashboard/station/${station.p_id}`}
            className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
          >
            {station.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PoliceStationDashboard;
