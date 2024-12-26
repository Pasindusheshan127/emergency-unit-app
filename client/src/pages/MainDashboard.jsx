import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BellElectric,
  BookUp2,
  ChartArea,
  House,
  Notebook,
  OctagonAlert,
  ShieldAlert,
  Siren,
  TrendingUp,
} from "lucide-react";

const MainDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">MAIN DASHBOARD</h1>
      <p className="text-sm text-center ">Welcome to the main dashboard!</p>

      {/* Logos */}

      <div className="flex gap-2 my-auto justify-center mt-10">
        {/* Emergency logo */}
        <div
          className="relative w-[100px] h-[100px] border border-black "
          onClick={() => navigate("/emergency-dashboard")}
        >
          <div className="border border-black w-[60px] h-[60px] top-2 absolute left-1/2 -translate-x-1/2">
            <ShieldAlert size={58} className="" />
          </div>
          <span className="border absolute bottom-1 w-[80px] h-5 left-1/2 -translate-x-1/2 rounded-sm bg-gray-300 text-[12px] text-center text-red-600">
            EMERGENCY
          </span>
        </div>
        {/* station wise logo */}
        <div
          className="relative w-[100px] h-[100px] border border-black "
          onClick={() => navigate("/policeStations-dashboard")}
        >
          <div className="  w-[60px] h-[60px] top-2 absolute left-1/2 -translate-x-1/2">
            <House size={58} />
          </div>
          <span className="border absolute bottom-1 w-[80px] h-5 left-1/2 -translate-x-1/2 rounded-sm bg-gray-300 text-[12px] text-center text-red-600">
            STATIONS
          </span>
        </div>
        {/*emergency Station assigning logo */}
        <div
          className="relative w-[100px] h-[100px] border border-black "
          onClick={() => navigate("/emergency-station-assign-dashboard")}
        >
          <div className="  w-[60px] h-[60px] top-2 absolute left-1/2 -translate-x-1/2">
            <Notebook size={58} />
          </div>
          <span className="border absolute bottom-1 w-[80px] h-5 left-1/2 -translate-x-1/2 rounded-sm bg-gray-300 text-[12px] text-center text-red-600">
            {/* STATION */}
          </span>
        </div>
        {/* Emergency officer assigning */}
        <div
          className="relative w-[100px] h-[100px] border border-black "
          onClick={() => navigate("/StationOfficer-dashboard")}
        >
          <div className="  w-[60px] h-[60px] top-2 absolute left-1/2 -translate-x-1/2">
            <BookUp2 size={58} />
          </div>
          <span className="border absolute bottom-1 w-[80px] h-5 left-1/2 -translate-x-1/2 rounded-sm bg-gray-300 text-[12px] text-center text-red-600">
            {/* STATION */}
          </span>
        </div>
        {/* case status update logo */}
        <div className="relative w-[100px] h-[100px] border border-black ">
          <div className="  w-[60px] h-[60px] top-2 absolute left-1/2 -translate-x-1/2">
            <ChartArea size={58} />
          </div>
          <span className="border absolute bottom-1 w-[80px] h-5 left-1/2 -translate-x-1/2 rounded-sm bg-gray-300 text-[12px] text-center text-red-600">
            STATUS
          </span>
        </div>
        {/* Officer wise dash logo */}
        <div
          className="relative w-[100px] h-[100px] border border-black "
          onClick={() => navigate("/policeOfficers-dashboard")}
        >
          <div className="  w-[60px] h-[60px] top-2 absolute left-1/2 -translate-x-1/2">
            <img
              src="/icons/police-officer.svg"
              className="w-[58px] h-[58px]"
            />
          </div>
          <span className="border absolute bottom-1 w-[80px] h-5 left-1/2 -translate-x-1/2 rounded-sm bg-gray-300 text-[12px] text-center text-red-600">
            OFFICERS
          </span>
        </div>
      </div>

      {/* Buttons */}

      <div className="grid grid-cols-1 lg:grid-cols-3 text-sm gap-2 font-black mt-12">
        <div
          onClick={() => navigate("/emergency-dashboard")}
          className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
        >
          Emergency trigger Dashboard
        </div>
        <div
          onClick={() => navigate("/policeStations-dashboard")}
          className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
        >
          Station-Wise Dashboard
        </div>
        <div
          onClick={() => navigate("/emergency-station-assign-dashboard")}
          className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
        >
          Emergency Station Assigning
        </div>
        <div
          onClick={() => navigate("/StationOfficer-dashboard")}
          className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
        >
          Station Officer Assigning
        </div>
        <div
          onClick={() => navigate("")}
          className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
        >
          Case Status Update Window
        </div>
        <div
          onClick={() => navigate("/policeOfficers-dashboard")}
          className="bg-white border border-gray-900 rounded-md px-4 py-2 text-blue-500 text-start uppercase"
        >
          Officer wise dashboard
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
