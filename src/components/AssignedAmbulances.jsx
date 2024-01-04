import React, { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { VscEdit } from "react-icons/vsc";
import { MdOutlineDeleteOutline } from "react-icons/md";

const AssignedAmbulances = ({ onClose }) => {
  return (
    <div className="relative top-0 left-0 h-full w-80 bg-grayBg-100 transition-all duration-300 overflow-y-scroll no-scrollbar z-[10] rounded-l-lg">
      <div className="flex flex-col p-2 m-4 rounded-[12px] bg-grayBg-200 max-h-screen">
        <div className="flex flex-row justify-between items-center p-2 border-b-2">
          <IoIosArrowRoundForward
            className="w-6 h-6 text-primary-100 hover:text-white  hover:bg-primary-100 rounded-full transition-all duration-300"
            onClick={onClose}
          />
          <h1 className="text-xl font-semi">Selected Ambulances</h1>
        </div>
        <div class="flex items-start justify-between p-2 rounded-lg bg-white mt-4">
          <div class="flex flex-row justify-between p-2">
            <VscEdit
              className="w-6 h-6 p-1 bg-primary-300 text-primary-100 hover:text-white  hover:bg-primary-100 rounded-md transition-all duration-300"
              onClick={onClose}
            />
            <MdOutlineDeleteOutline
              className="w-6 h-6 p-1 bg-red-200 text-red-500 hover:text-white  hover:bg-red-500 rounded-md transition-all duration-300 ml-1"
              onClick={onClose}
            />
          </div>

          <div class="ml-4">
            <p class="text-sm text-gray-900 text-right font-bold">Ambulance1</p>
            <p class="text-sm text-gray-900 text-right">KJASFHJKD</p>
            <p class="text-sm text-gray-900 text-right">H6C-4653</p>
            <p class="text-sm text-gray-900 text-right">
              <span className="text-primary-100">14 mins</span> •
              <span className="text-primary-100">7 Km</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedAmbulances;
