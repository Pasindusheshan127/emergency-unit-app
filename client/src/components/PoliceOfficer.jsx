import axios from "axios";
import React, { useEffect, useState } from "react";

const PoliceOfficer = ({ officer, id }) => {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          ` http://localhost:5000/api/officer-emergencies/${id}`
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        POLICE OFFICER {name}
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
                  <button className="border border-black text-red-600 px-2 rounded-lg">
                    Drive
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="border border-black text-green-500 px-2 rounded-lg">
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
