import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
const PoliceStation = () => {
  const { stationId } = useParams(); // Get stationId from the URL
  const [data, setData] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState("");

  const socket = useRef(null);

  const calculateElapsedTime = (updatedTime) => {
    const total = Date.parse(new Date()) - Date.parse(updatedTime);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  const playBeep = () => {
    const audio = new Audio("/alert.mp3");
    audio.play();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/assign-station"
        );
        if (response.status === 200) {
          // Filter for only records that belong to DashboardA
          const stationData = response.data.filter(
            (row) =>
              row.station_id === parseInt(stationId) &&
              row.officer_assignment_id === null
          );
          setData(stationData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [stationId]); // Dependency on stationId to refetch data when the station changes

  useEffect(() => {
    //initialize the socket connection
    socket.current = io("http://localhost:5000");

    //listen the new 'stationAssigned' events
    socket.current.on("stationAssigned", (data) => {
      // console.log("Station assigned", data);

      const newEmergency = data.assignment;

      //check if the assigned station match the current officerId
      if (parseInt(data.assignment.station_id) === parseInt(stationId)) {
        // Play beep sound
        playBeep();
        //update the emergencies array with new assigned emergency

        setData((prevData) => {
          const updatedata = [newEmergency, ...prevData];

          return updatedata;
        });
      }
    });

    //return cleanup functon to disconnect from the socket server when unmounting
    return () => {
      //remove the listener when unmounting the component
      socket.current.off("stationAssigned");
      //Disconnect from the socket server
      socket.current.disconnect();
    };
  }, [stationId]); // Dependency on stationId to refetch data when the station])

  const handleAssignOfficer = async (id) => {
    if (!selectedOfficerId) {
      alert("Please select an officer.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/assign-officer`,
        {
          emergency_id: id,
          officer_id: selectedOfficerId,
        }
      );

      if (response.status === 200) {
        setData((prevData) => prevData.filter((row) => row.e_id !== id));
        alert("Officer assigned successfully.");
      }
    } catch (error) {
      console.log("Error assigning officer:", error);
      alert("Failed to assign officer.");
    }
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
        POLICE STATION {stationId}
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
                    onClick={() => handleAssignOfficer(row.e_id)}
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
