import React, { useState } from "react";
import Equipment from "./Equipment";
import DepartmentsFiles from "./Super Admin Dashboard/Departments/DepartmentsFiles";
import IncidentType from "./IncidentType";
const Lookups = () => {
  const [activeTab, setActiveTab] = useState("equipments");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div
      className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
    >
      {" "}
      <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
        <h1 className="text-2xl font-semibold m-2 mt-3"> Lookup</h1>
      </div>
      <div className="flex justify-center bg-white">
        <div
          onClick={() => handleTabClick("equipments")}
          className={`cursor-pointer py-2 px-8 ${
            activeTab === "equipments"
              ? "bg-primary-100 text-white"
              : "text-primary-100"
          } border-2 border-primary-100 rounded-tl-md`}
        >
          Equipments
        </div>
        <div
          onClick={() => handleTabClick("Departments")}
          className={`cursor-pointer py-2 px-8 ${
            activeTab === "Departments"
              ? "bg-primary-100 text-white"
              : "text-primary-100"
          } border-2 border-primary-100 `}
        >
          Departments
        </div>
        <div
          onClick={() => handleTabClick("incidentType")}
          className={`cursor-pointer py-2 px-8 ${
            activeTab === "incidentType"
              ? "bg-primary-100 text-white"
              : "text-primary-100"
          } border-2 border-primary-100 rounded-tr-md`}
        >
          Incident Type
        </div>
      </div>
      <div>
        {activeTab === "equipments" && (
          <div>
            <Equipment />
          </div>
        )}
        {activeTab === "Departments" && (
          <div>
            <DepartmentsFiles />
          </div>
        )}
        {activeTab === "incidentType" && (
          <div>
            <IncidentType />
          </div>
        )}
      </div>
    </div>
  );
};

export default Lookups;
