import React, { useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import MultiSelectDropdown from "../MultiSelectDropdown";
import StyledInput from "../StyledInput";
import { getToken } from "../../helpers/helpers";
import axios from "axios";

const ambulanceIDs = [];

export default function RegionModal({ setIsModalOpen, loading }) {
  const [selectedAmbulanceIds, setSelectedAmbulanceIds] = useState([]);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [regionName, setRegionName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = getToken();
    const formData = {
      ambulances: selectedAmbulanceIds,
      name: regionName,
      address,
      longitude,
      latitude,
    };

    console.log("Form Submitted: ", formData);

    axios
      .post("https://ars.disruptwave.com/api/regions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success) {
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert("Failed to save the Form...");
      });

    setSelectedAmbulanceIds([]);
    setRegionName("");
    setAddress("");
    setLongitude("");
    setLatitude("");
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-1 -left-96 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-screen mb-5">
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
          <BsArrowRightCircle
            width={9}
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <h3 className="text-xl font-semibold">Region Details</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col space-y-2 w-full">
              <MultiSelectDropdown
                options={ambulanceIDs}
                selectedOptions={selectedAmbulanceIds}
                setSelectedOptions={setSelectedAmbulanceIds}
                label={"Assigned Ambulances"}
                placeholder="Add Ambulance IDs"
                required={"true"}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <StyledInput
                label={"Region Name"}
                id={"region_name"}
                type={"text"}
                placeholder={"Type Region Name"}
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
              />
              <StyledInput
                label={"Address"}
                id={"address"}
                type={"text"}
                placeholder={"Address"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                minLength={10}
              />
              <StyledInput
                label={"Longitude"}
                id={"longitude"}
                type={"number"}
                placeholder={"Longitude"}
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              <StyledInput
                label={"latitude"}
                id={"latitude"}
                type={"number"}
                placeholder={"latitude"}
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
          </div>
          <div className="text-left mt-10">
            <button
              type="submit"
              className="text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
            >
              {loading ? "Saving..." : "Save Region"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
