import React from "react";
import { useNavigate } from "react-router-dom";

const MainDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">MAIN DASHBOARD</h1>
      <p className="text-sm text-center ">Welcome to the main dashboard!</p>

      <div className="mt-8 flex flex-col gap-6 items-center justify-center">
        <div
          onClick={() => navigate("/emergency-dashboard")}
          className="cursor-pointer w-[50%] px-18 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 hover:text-black"
        >
          <p className="text-2xl ">Emergency trigger Dashboard</p>
        </div>
        <div
          onClick={() => navigate("/policeStations-dashboard")}
          className="cursor-pointer w-[50%] px-18 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 hover:text-black"
        >
          <p className="text-2xl ">Station-Wise Dashboard</p>
        </div>
        <div
          onClick={() => navigate("/emergency-station-assign-dashboard")}
          className="cursor-pointer w-[50%] px-18 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 hover:text-black"
        >
          <p className="text-2xl ">Emergency Station Assigning</p>
        </div>
        <div
          onClick={() => navigate("/StationOfficer-dashboard")}
          className="cursor-pointer w-[50%] px-18 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 hover:text-black"
        >
          <p className="text-2xl ">Station Officer Assigning</p>
        </div>
        <div
          onClick={() => navigate("")}
          className="cursor-pointer w-[50%] px-18 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 hover:text-black"
        >
          <p className="text-2xl ">Case Status Update Window</p>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
