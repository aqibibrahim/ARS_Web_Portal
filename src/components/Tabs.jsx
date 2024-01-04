import React from "react";

const Tabs = ({ activeTab, onTabClick }) => {
  return (
    <div className="flex bg-lightGray-100 justify-center items-center pt-1">
      {["HealthCare", "Ambulance", "Incident"].map((tab) => (
        <div
          key={tab}
          className={`cursor-pointer py-2 px-4 ${
            activeTab === tab ? "bg-white" : ""
          }`}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
