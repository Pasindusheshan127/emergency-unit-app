import axios from "axios";
import React, { useEffect, useState } from "react";

const PoliceStation = ({ police = 1 }) => {
  const [data, setData] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState("");

  const calculateElapsedTime = (updatedTime) => {
    const total = Date.parse(new Date()) - Date.parse(updatedTime);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/assign-station"
        );
        if (response.status === 200) {
          // Filter for only records that belong to DashboardA
          const dashboardAData = response.data.filter(
            (row) => row.station_id === "Station1"
          );
          setData(dashboardAData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleAssignOfficer = async (id) => {
    if (!selectedOfficerId) {
      alert("Please select an officer.");
      return;
    }

    // try {
    //   const response = await axios.put(
    //     `http://localhost:5000/api/data/assign-officer/${id}`,
    //     { officer_id: selectedOfficerId }
    //   );

    //   if (response.status === 200) {
    //     setData((prevData) =>
    //       prevData.map((row) =>
    //         row.id === id ? { ...row, officer_id: selectedOfficerId } : row
    //       )
    //     );

    //     alert("Officer assigned successfully.");
    //     // Remove the page reload and simply update the state
    //   }
    // } catch (error) {
    //   console.log("Error assigning officer:", error);
    //   alert("Failed to assign officer.");
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((row) => {
          const { total, hours, minutes, seconds } = calculateElapsedTime(
            row.assigned_at
          );

          if (total <= 0) {
            return { ...row, timer: "Expired" };
          }

          return {
            ...row,
            timer: `${hours > 9 ? hours : "0" + hours}:${
              minutes > 9 ? minutes : "0" + minutes
            }:${seconds > 9 ? seconds : "0" + seconds}`,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">
        POLICE STATION {police}
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Timer</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Phone Number</th>
              <th className="px-6 py-3 text-left">Updated Time</th>
              <th className="px-6 py-3 text-left">Assign Officer</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.e_id} className="border-t hover:bg-gray-100">
                <td className="px-6 py-4">{row.timer || "Calculating..."}</td>
                <td className="px-6 py-4">{row.emergency_name}</td>
                <td className="px-6 py-4">{row.emergency_location}</td>
                <td className="px-6 py-4">{row.phone_number}</td>
                <td className="px-6 py-4">
                  {new Date(row.assigned_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    placeholder="Enter officer_id"
                    onChange={(e) => setSelectedOfficerId(e.target.value)}
                  />
                  <button
                    className="border border-black px-2 rounded-lg"
                    onClick={() => handleAssignOfficer(row.id)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PoliceStation;
