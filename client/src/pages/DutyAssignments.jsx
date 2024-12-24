import React, { useState } from "react";

const DutyAssignments = () => {
  const [officerId, setOfficerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [vehicals, setVehicals] = useState("");
  const [location, setLocation] = useState("");

  const assignments = [
    {
      id: 1,
      officerId: "off1234",
      officerName: "John Doe",
      policeStation: "Central Station",
      phoneNumber: "+1 234 567 890",
      vehicle: "Car A12",
      date: "2024-12-23T10:30:00Z",
      assignedBy: "pol1234",
      status: "Active",
      location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    },
    {
      id: 2,
      officerId: "off5678",
      officerName: "Jane Smith",
      policeStation: "North Station",
      phoneNumber: "+1 345 678 901",
      vehicle: "Motorbike M23",
      date: "2024-12-22T15:45:00Z",
      assignedBy: "pol1234",
      status: "Completed",
      location: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    },
    {
      id: 3,
      officerId: "off91011",
      officerName: "Sam Wilson",
      policeStation: "East Station",
      phoneNumber: "+1 456 789 012",
      vehicle: "SUV S56",
      date: "2024-12-21T12:00:00Z",
      assignedBy: "pol5678",
      status: "Pending",
      location: { lat: 40.7128, lng: -74.006 }, // New York
    },
  ];

  const handleDutyAssignments = () => {
    console.log(
      "Duty Assignments:",
      "officerId:",
      officerId,
      "phoneNumber:",
      phoneNumber,
      "assignDate:",
      assignDate,
      "vehicals:",
      vehicals,
      "location:",
      location
    );
  };

  return (
    <div className="p-6">
      {/* duty assign */}
      <div className="bg-gray-100 pb-6 ">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Duty Assignments Dashboard
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Date"
              value={assignDate}
              onChange={(e) => setAssignDate(e.target.value)}
              className=" text-center border border-black rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Officer Id"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              className=" text-center border border-black rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className=" text-center border border-black rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Phone number"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className=" text-center border border-black rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter vehical"
              value={vehicals}
              onChange={(e) => setVehicals(e.target.value)}
              className=" text-center border border-black rounded-md"
            />
          </div>
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleDutyAssignments}
          >
            Assign
          </button>
        </div>
      </div>
      {/* duty assignments table */}
      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-600 text-white">
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Officer name</th>
              <th className="px-6 py-3 text-left">Officer Phone number</th>

              <th className="px-6 py-3 text-left">Vehical</th>
            </thead>
            <tbody className="bg-white">
              {assignments.map((row) => (
                <tr key={row.officerId}>
                  <td className="px-6 py-4">
                    {new Date(row.date).toLocaleDateString()}{" "}
                    {new Date(row.date).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">{row.officerName}</td>
                  <td className="px-6 py-4">{row.phoneNumber}</td>

                  <td className="px-6 py-4">{row.vehicle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DutyAssignments;
