import axios from "axios";
import { Navigation } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const PoliceOfficer = () => {
  const { officerId } = useParams();

  const [emergencies, setEmergencies] = useState([]);

  const socket = useRef(null);

  // Function to play beep sound
  const playBeep = () => {
    const audio = new Audio("/alert.mp3");
    audio.play();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          ` http://localhost:5000/api/officer-emergencies/${officerId}`
        );
        if (response.status === 200) {
          setEmergencies(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    //initialize the socket connection
    socket.current = io("http://localhost:5000");

    // Listen to new 'officerAssigned' events
    socket.current.on("officerAssigned", (data) => {
      const newEmergency = data.emergency;

      // Check if the assigned officer matches the current officerId

      if (data.officer_id === officerId) {
        // Play beep sound
        playBeep();
        // Update the emergencies array with the new assigned emergency
        setEmergencies((prevEmergencies) => {
          const updatedEmergencies = [newEmergency, ...prevEmergencies];

          return updatedEmergencies;
        });
      }
    });

    // Return cleanup function to disconnect from the socket server when unmounting
    return () => {
      // Clean up the connection on unmount
      socket.current.off("officerAssigned");
      // Disconnect from the socket server when unmounting
      socket.current.disconnect();
    };
  }, [officerId]);

  const handleMapButtonClick = async (row) => {
    const { location_latitude, location_longitude } = row;

    try {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: currentLatitude, longitude: currentLongitude } =
            position.coords;

          // Fetch the directions URL from the backend
          const response = await fetch(
            "http://localhost:5000/api/generate-map-url",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                xDirection: location_latitude,
                yDirection: location_longitude,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to generate directions URL."
            );
          }

          // Append the origin (current location) to the directions URL
          const fullDirectionsUrl = `${data.directionsUrl}&origin=${currentLatitude},${currentLongitude}`;

          // Open the directions in Google Maps
          window.open(fullDirectionsUrl, "_blank");
        },
        (error) => {
          throw new Error(
            "Unable to retrieve current location. Please allow location access."
          );
        }
      );
    } catch (error) {
      alert(error.message);
    }
  };

  //Marked an emeregency as checked

  const handleMarkChechked = async (id) => {
    try {
      //Display confirmation dialog
      const isConfirmed = window.confirm(
        "Are you sure you want to mark this emergency as checked?"
      );

      //process only if confirmed
      if (!isConfirmed) {
        alert(" confirmation dialog is not confirmed ");
        return;
      }

      const result = await axios.patch(
        `http://localhost:5000/api/emergencies/${id}/mark-checked`
      );
      console.log(result);
      if (result.status === 200) {
        setEmergencies((prev) =>
          prev.filter((emergency) => emergency.emergency_id !== id)
        );
        alert("Good Job!");
      }
    } catch (error) {
      console.error("Error marking emergency as checked", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        POLICE OFFICER {officerId}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Emergency ID</th>
              <th className="px-6 py-3 text-left">Emergency Name</th>
              <th className="px-6 py-3 text-left">Phone Number</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Assigned At</th>
              <th className="px-6 py-3 text-left">Drive</th>
              <th className="px-6 py-3 text-left">Finish</th>
            </tr>
          </thead>
          <tbody>
            {emergencies.map((emergency) => (
              <tr
                key={emergency.emergency_id}
                className="border-t hover:bg-gray-100"
              >
                <td className="px-6 py-4">{emergency.emergency_id}</td>
                <td className="px-6 py-4">{emergency.emergency_name}</td>
                <td className="px-6 py-4">
                  <a
                    href={`tel:${emergency.phone_number}`}
                    className="text-blue-500 hover:underline"
                  >
                    {emergency.phone_number}
                  </a>
                </td>
                <td className="px-6 py-4">
                  {emergency.location_latitude}, {emergency.location_longitude}
                </td>
                <td className="px-6 py-4">
                  {new Date(emergency.officer_assigned_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {/* <button
                    onClick={() => handleMapButtonClick(emergency)}
                    className="border border-black text-red-600 px-2 rounded-lg"
                  >
                    Drive
                  </button> */}
                  <Navigation
                    onClick={() => handleMapButtonClick(emergency)}
                    size={36}
                    color="#c11f1f"
                    strokeWidth={1.5}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleMarkChechked(emergency.emergency_id)}
                    className="border border-black text-green-500 px-2 rounded-lg"
                  >
                    Finish
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

export default PoliceOfficer;
