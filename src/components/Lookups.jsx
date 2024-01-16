import React, { useState } from "react";
import Equipment from "./Equipment";
import DepartmentsFiles from "./Super Admin Dashboard/Departments/DepartmentsFiles";
import IncidentType from "./IncidentType";
import Departments from "./Departments";
const Lookups = () => {
  const [activeTab, setActiveTab] = useState("equipments");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const Tab = ({ selected, title, onClick }) => {
    return (
      <button
        className={`px-4 py-2 transition-colors duration-150 ${
          selected ? "bg-blue-500 text-white" : "bg-white text-black"
        } focus:outline-none`}
        onClick={onClick}
        style={{
          backgroundColor: selected ? "#3182ce !important" : "#fff !important",
        }}
      >
        {title}
      </button>
    );
  };

  return (
    <div
      className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
    >
      {" "}
      <div className="bg-lightGray-100 ml-20 rounded-t-lg     mt-2 ">
        <div className="p-4 text-center  ">
          <h1 className="text-2xl font-semibold m-2 mt-3 justify-center">
            {" "}
            Lookup
          </h1>
        </div>{" "}
        <div className="flex justify-end ">
          {" "}
          <Tab
            selected={activeTab === "equipments"}
            title="Equipments"
            onClick={() => handleTabClick("equipments")}
            className={`${
              activeTab === "equipments"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          />
          <Tab
            selected={activeTab === "Departments"}
            onClick={() => handleTabClick("Departments")}
            title="Departments"
            className={`${
              activeTab === "Departments"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          />
          <Tab
            selected={activeTab === "incidentType"}
            onClick={() => handleTabClick("incidentType")}
            title="Incident Types"
            className={`${
              activeTab === "incidentType"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          />
        </div>
      </div>
      {activeTab === "equipments" && <Equipment />}
      {activeTab === "Departments" && <DepartmentsFiles />}
      {activeTab === "incidentType" && <IncidentType />}
    </div>
  );
};

export default Lookups;
