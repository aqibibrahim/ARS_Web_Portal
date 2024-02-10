import React from "react";

const Tabs = ({ activeTab, onTabClick }) => {
  const tabs = [" الرعاية الصحية", "سياره اسعاف", "الحادث"];

  return (
    <div className="flex bg-lightGray-100 justify-center items-center pt-1">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`cursor-pointer py-2 px-4 ${
            activeTab === tab
              ? "bg-blue-400 text-white rounded-lg"
              : "bg-lightGray-100  "
          }`}
          onClick={() => onTabClick(tab)}
          style={{ pointerEvents: activeTab === tab ? "auto" : "none" }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
