import React, { useEffect, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import MultiSelectDropdown from "../MultiSelectDropdown";
import StyledInput from "../StyledInput";
import {
  createHealthcare,
  getAllDepartments,
  updateHealthcare,
} from "../../helpers/helpers";

export default function HealthcareModel({ healthcare, setIsModalOpen }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [selectedContactNos, setSelectedContactNos] = useState([]);
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (healthcare) {
      setFacilityName(healthcare.name);
      setEmail(healthcare.email);
      setAddress(healthcare.address);
      setLatitude(healthcare.latitude);
      setLongitude(healthcare.longitude);
      setSelectedContactNos(healthcare.phone_numbers);
      setUserId(healthcare.user_id);
      setSelectedDepartments(healthcare.departments);
    }

    const fetchDepartments = async () => {
      try {
        const response = await getAllDepartments();
        if (response.data.success) {
          setDepartments(response.data.data);
        } else {
          setError("Failed to fetch department data");
        }
      } catch (err) {
        console.log(err);
        setError(err.message || "An error occurred while fetching department");
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (healthcare) {
      updateHealthcare(
        selectedDepartments,
        selectedContactNos,
        email,
        latitude,
        longitude,
        address,
        facilityName,
        userId,
        setLoading,
        setError,
        healthcare.id
      );
    } else
      createHealthcare(
        selectedDepartments,
        selectedContactNos,
        email,
        latitude,
        longitude,
        address,
        facilityName,
        userId,
        setLoading,
        setError
      );

    setIsModalOpen(false);
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
          <h3 className="text-xl font-semibold">Healthcare Details</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col space-y-2 w-full">
              <MultiSelectDropdown
                options={departments}
                selectedOptions={selectedDepartments}
                setSelectedOptions={setSelectedDepartments}
                label={"Departments"}
                placeholder="Select Departments"
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
                label={"Latitude"}
                id={"latitude"}
                type={"number"}
                placeholder={"Latitude"}
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <StyledInput
                label={"User ID"}
                id={"user_id"}
                type={"number"}
                placeholder={"User ID"}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <StyledInput
                label={"Facility Name"}
                id={"facility_name"}
                type={"text"}
                placeholder={"Facility Name"}
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
              />
              <MultiSelectDropdown
                options={contactNumbers}
                selectedOptions={selectedContactNos}
                setSelectedOptions={setSelectedContactNos}
                label={"Contact Numbers"}
                placeholder="Type Number Here"
                inputType="number"
              />
              <StyledInput
                label={"Email"}
                id={"email"}
                type={"email"}
                placeholder={"email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <StyledInput
                label={"Address"}
                id={"address"}
                type={"text"}
                placeholder={"Address"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="text-left mt-10">
            <button
              type="submit"
              className="text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
            >
              {loading ? "Saving..." : "Save Healthcare"}
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
