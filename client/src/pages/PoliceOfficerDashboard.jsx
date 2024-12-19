import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PoliceOfficerDashboard = () => {
  const [policeOfficers, setPoliceOfficers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/police-officers"
        );
        if (response.status === 200) {
          setPoliceOfficers(response.data);
          console.log(policeOfficers);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const officers = [
    { id: "0123456789", name: "Officer1" },
    { id: "2", name: "Officer2" },
    { id: "3", name: "Officer3" },
  ];

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-16">Police Officers</h1>
      <div className="grid grid-cols-3 gap-4">
        {policeOfficers.map((officer) => (
          <Link
            key={officer.id}
            to={`/policeOfficers-dashboard/officer/${policeOfficers.id}`}
            className="px-6 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600"
          >
            {officer.name}
          </Link>
        ))}
      </div>

      {/* Add more officers here */}

      {/* Add a button to create a new officer */}

      {/* Add a button to delete an officer */}

      {/* Add a button to assign an officer to a station */}

      {/* Add a button to unassign an officer from a station */}

      {/* Add a button to view all emergencies assigned to an officer */}

      {/* Add a button to view all completed emergencies assigned to an officer */}
    </div>
  );
};

export default PoliceOfficerDashboard;
