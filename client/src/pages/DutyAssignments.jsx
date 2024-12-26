import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DutyAssignments = () => {
  const [officerId, setOfficerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [assignDate, setAssignDate] = useState("");
  const [vehicals, setVehicals] = useState("");

  const [assignments, setAssignments] = useState([]);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/duty-assign`
        );

        if (response.status === 200) {
          setAssignments(response.data.assignments);
        } else {
          console.error(
            "Error fetching duty assignments: ",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching duty assignments: ", error);
      }
    };

    fetchAssignments();
  }, []);

  const handleDutyAssignments = async () => {
    // Convert the input date to the desired format
    const formattedDate = dayjs(assignDate, "MM/DD/YY")
      .tz("Asia/Colombo") // Replace with your desired timezone
      .format("YYYY-MM-DD HH:mm:ss.SSSZ");

    // console.log("Formatted Date:", formattedDate);

    try {
      const newDutyAssign = await axios.post(
        `http://localhost:5000/api/duty-assign`,
        {
          officerId: officerId,
          phone_number: phoneNumber,
          vehical: vehicals,
          date: formattedDate,
        }
      );
      if (newDutyAssign.status === 201) {
        // console.log("New duty assignment saved successfully: ", newDutyAssign);

        //trigger the toaste
        toast({
          title: "Success",
          description: "New duty assignment saved successfully.",
          variant: "default",
        });
        //clear form fields
        setOfficerId("");
        setPhoneNumber("");
        setVehicals("");
        setAssignDate("");
      }
    } catch (err) {
      console.error("Error saving duty assignment: ", err);
    }
    toast({
      title: "Error",
      description: "Failed to save duty assignment.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6">
      {/* duty assign */}
      <div className="bg-gray-100 pb-6 ">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Duty Assignments Dashboard
        </h1>
        <div className="flex flex-col  gap-4 items-center justify-center">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex gap-2">
              <input
                type="date"
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
                placeholder="Enter vehical"
                value={vehicals}
                onChange={(e) => setVehicals(e.target.value)}
                className=" text-center border border-black rounded-md"
              />
            </div>
          </div>
          {/* <button
            className="px-2 py-1 w-[200px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleDutyAssignments}
          >
            Assign
          </button> */}
          <Button className="bg-blue-500" onClick={handleDutyAssignments}>
            Assign
          </Button>
        </div>
      </div>
      {/* duty assignments table */}
      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Officer name</th>
                <th className="px-6 py-3 text-left">Officer Phone number</th>
                <th className="px-6 py-3 text-left">Police Station</th>
                <th className="px-6 py-3 text-left">Vehical</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4">
                    {new Date(assignment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{/*officer name */}</td>
                  <td className="px-6 py-4">{assignment.phone_number}</td>
                  <td className="px-6 py-4">{assignment.police_station}</td>

                  <td className="px-6 py-4">{assignment.vehical}</td>
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
