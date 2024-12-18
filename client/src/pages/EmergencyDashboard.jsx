import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const EmergencyDashboard = () => {
  const [data, setData] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const socket = useRef(null); // Use useRef to store socket object

  // Function to play beep sound
  const playBeep = () => {
    const audio = new Audio("/level-up.mp3");
    audio.play();
  };

  const calculateElapsedTime = (createdTime) => {
    const total = Date.parse(new Date()) - Date.parse(createdTime);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  useEffect(() => {
    const fetchData = async () => {
      socket.current = io("http://localhost:5000");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/emergencies"
        );
        if (response.status === 200) {
          const filterData = response.data.filter(
            (row) =>
              row.assigned_station_id === "" || row.assigned_station_id === null
          );
          setData(filterData);
        }

        // Listen for real-time updates
        socket.current.on("newEmergency", (newEmergency) => {
          console.log("New emergency received:", newEmergency);

          const audio = new Audio("/alert.mp3");
          audio.play();

          setData((prevData) => {
            const isDuplicate = prevData.some(
              (row) => row.e_id === newEmergency.e_id
            );
            return isDuplicate ? prevData : [newEmergency, ...prevData];
          });
        });

        return () => {
          socket.current.off("newEmergency");
          socket.current.disconnect();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((row) => {
          const { total, hours, minutes, seconds } = calculateElapsedTime(
            row.created_at
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

  const handleDropdownChange = (id, value) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.e_id === id ? { ...row, assigned_station_id: value } : row
      )
    );
  };

  const handleUpdate = async (row) => {
    console.log(row.assigned_station_id);
    if (!row.assigned_station_id) {
      alert("Please select a dashboard.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/assign-station`, {
        emergency_id: row.e_id,
        station_id: row.assigned_station_id,
      });

      setData((prevData) => prevData.filter((item) => item.e_id !== row.e_id));
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update dashboard. Please try again.");
    }
    // Play beep sound after successful submission
    playBeep();
  };

  const handleMapButtonClick = async (row) => {
    const { location_latitude, location_longitude } = row;

    // Check if location data is available
    if (!location_latitude || !location_longitude) {
      setFeedback({ type: "error", message: "Missing location data" });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-map-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            xDirection: location_latitude, // Use xDirection for latitude
            yDirection: location_longitude, // Use yDirection for longitude
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate map URL.");
      }

      setFeedback({ type: "success", message: data.message });
      window.open(data.pinLocationUrl, "_blank"); // Open the generated map URL in a new tab
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-semibold text-center mb-6">
        General Dashboard
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Timer</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Phone Number</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Assign Station</th>
              <th className="px-6 py-3 text-left">Map</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row) => (
              <tr key={row.e_id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{row.timer || "Calculating..."}</td>
                <td className="px-6 py-4">{row.name}</td>
                <td className="px-6 py-4">
                  {row.location_latitude}, {row.location_longitude}
                </td>
                <td className="px-6 py-4">{row.phone_number}</td>
                <td className="px-6 py-4">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={row.assigned_station_id || ""}
                    onChange={(e) =>
                      handleDropdownChange(row.e_id, e.target.value)
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="111">Station 1</option>
                    <option value="222">Station 2</option>
                    <option value="333">Station 3</option>
                    <option value="444">Station 4</option>
                  </select>
                  <button
                    onClick={() => handleUpdate(row)}
                    className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Update
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleMapButtonClick(row)}
                    className="ml-3 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-400 focus:outline-none"
                  >
                    open map
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

export default EmergencyDashboard;
