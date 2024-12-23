import React from "react";
import { useNavigate } from "react-router-dom";
import { BellElectric, House, ShieldAlert, TrendingUp } from "lucide-react";

const MainDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8">MAIN DASHBOARD</h1>
      <p className="text-sm text-center ">Welcome to the main dashboard!</p>

      <div className="flex gap-2 my-auto justify-center mt-10">
        <div className="relative bg-white rounded-md text-black border border-black w-[100px] h-[100px]">
          <ShieldAlert
            size={52}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 border border-black p-1"
          />
          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[12px] rounded-sm border border-black bg-gray-300 text-red-500 px-2.5">
            EMERGENCY
          </span>
        </div>

        <div className="flex flex-col  items-center justify-center bg-white  rounded-md text-black border border-black w-[100px] h-[100px]">
          <ShieldAlert size={48} className="mt-2 border border-black" />
          <span className="text-[12px] mt-4 rounded-sm  border border-black bg-gray-300 text-red-500 px-2.5">
            EMERGENCY
          </span>
        </div>

        <div className="flex bg-white p-3 text-xl rounded-md text-black border border-black w-[48px] h-[48px]">
          <House size={20} />
        </div>
        <div className="flex bg-white p-3 text-xl rounded-md text-black border border-black w-[48px] h-[48px]">
          <BellElectric size={20} />
        </div>
        <div className="flex bg-white p-3 text-xl rounded-md text-black border border-black w-[60px] h-[60px]">
          <img src="/icons/officer-assigning.svg" />
        </div>
        <div className="flex bg-white p-3 text-xl rounded-md text-black border border-black w-[48px] h-[48px]">
          <TrendingUp size={20} />
        </div>
        <div className="flex bg-white p-3 text-xl rounded-md text-black border border-black w-[48px] h-[48px]">
          <img src="/icons/police-officer.svg" />
        </div>
      </div>

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
