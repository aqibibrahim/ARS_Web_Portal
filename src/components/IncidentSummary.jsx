import React, { useState } from "react";
import CheckboxItem from "./CheckboxItem";
import closeIcon from "../assets/close.svg";

const dummyData = [
  {
    id: 1,
    name: "Waqas Zia",
    description: "Mazda - LLC321",
  },
  {
    id: 2,
    name: "Waqas Zia",
    description: "Mazda - LLC321",
  },
  {
    id: 3,
    name: "Waqas Zia",
    description: "Mazda - LLC321",
  },
  {
    id: 4,
    name: "Waqas Zia",
    description: "Mazda - LLC321",
  },
];
const IncidentSummary = ({ onClose }) => {
  const [checkedState, setCheckedState] = useState(false);
  const toggleCheckbox = (id) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="relative top-0 left-0 h-full w-80 bg-grayBg-100 transition-all duration-300 overflow-y-auto z-[10]">
      <div className="p-2">
        <div className="flex flex-row justify-between items-center p-2 border-b-2">
          <img
            src={closeIcon}
            alt="clos"
            className="w-7 h-7 cursor-pointer"
            onClick={onClose}
          />
          <h1 className="text-2xl font-semi">Incident Summary</h1>
        </div>
        <div className="mt-4">
          {dummyData.length &&
            dummyData.map((data) => (
              <CheckboxItem
                key={data.id}
                name={data.name}
                description={data.description}
                checked={checkedState[data.id] || false}
                onChange={() => toggleCheckbox(data.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentSummary;
