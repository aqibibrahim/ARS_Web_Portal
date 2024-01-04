import React, { useState, useEffect } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import MultiSelectDropdown from "../MultiSelectDropdown";
import StyledInput from "../StyledInput";
import {
  getAllEquipment,
  createAmbulance,
  updateAmbulance,
} from "../../helpers/helpers";

export default function AmbulanceModal({ ambulance, setIsModalOpen }) {
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [plateNo, setPlateNo] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [gpsNo, setGpsNo] = useState(null);
  const [gpsLatitude, setGpsLatitude] = useState(null);
  const [gpsLongitude, setGpsLongitude] = useState(null);
  const [parkingLatitude, setParkingLatitude] = useState(null);
  const [parkingLongitude, setParkingLongitude] = useState(null);
  const [personsSupported, setPersonsSupported] = useState(null);
  const [password, setPassword] = useState("");

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ambulance) {
      setPlateNo(ambulance.plate_no);
      setMake(ambulance.make);
      setModel(ambulance.model);
      setGpsNo(ambulance.gps_no);
      setPersonsSupported(ambulance.persons_supported);
      setPassword(ambulance.password);
      setGpsLatitude(ambulance.gps_latitude);
      setGpsLongitude(ambulance.gps_longitude);
      setParkingLatitude(ambulance.parking_latitude);
      setParkingLongitude(ambulance.parking_longitude);
      setSelectedEquipment(ambulance.equipments);
    }

    const fetchEquipment = async () => {
      try {
        const response = await getAllEquipment();
        if (response.data.success) {
          setEquipment(response.data.data);
        } else {
          console.error("Failed to fetch equipment data");
        }
      } catch (err) {
        console.log(err);
        console.error(
          err.message || "An error occurred while fetching equipment"
        );
      }
    };

    fetchEquipment();
  }, [ambulance]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (ambulance) {
      updateAmbulance(
        setLoading,
        ambulance.id,
        make,
        model,
        gpsNo,
        personsSupported,
        password,
        gpsLatitude,
        gpsLongitude,
        parkingLatitude,
        parkingLongitude,
        setIsModalOpen,
        setError,
        selectedEquipment
      );
    } else {
      createAmbulance(
        setLoading,
        plateNo,
        make,
        model,
        gpsNo,
        personsSupported,
        password,
        gpsLatitude,
        gpsLongitude,
        parkingLatitude,
        parkingLongitude,
        setIsModalOpen,
        setError,
        selectedEquipment
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-1 -left-96 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
          <BsArrowRightCircle
            width={9}
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <h3 className="text-xl font-semibold">Create New Ambulance</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col space-y-2 w-full">
              <MultiSelectDropdown
                options={equipment}
                selectedOptions={selectedEquipment}
                setSelectedOptions={setSelectedEquipment}
                label={"Equipment"}
                placeholder="Select Equipment"
                bgColor={"#91EAAA"}
              />
              <StyledInput
                label={"GPS Latitude"}
                id={"gps_latitude"}
                type={"number"}
                placeholder={"gps_latitude"}
                value={gpsLatitude}
                onChange={(e) => setGpsLatitude(e.target.value)}
              />
              <StyledInput
                label={"GPS Longitude"}
                id={"gps_longitude"}
                type={"number"}
                placeholder={"gps_longitude"}
                value={gpsLongitude}
                onChange={(e) => setGpsLongitude(e.target.value)}
              />
              <StyledInput
                label={"Parking Latitude"}
                id={"parking_latitude"}
                type={"number"}
                placeholder={"parking_latitude"}
                value={parkingLatitude}
                onChange={(e) => setParkingLatitude(e.target.value)}
              />
              <StyledInput
                label={"Parking Longitude"}
                id={"parking_longitude"}
                type={"number"}
                placeholder={"parking_longitude"}
                value={parkingLongitude}
                onChange={(e) => setParkingLongitude(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              {ambulance ? null : (
                <StyledInput
                  label={"Plate No"}
                  id={"plate_no"}
                  type={"text"}
                  placeholder={"Enter Plate No"}
                  value={plateNo}
                  onChange={(e) => setPlateNo(e.target.value)}
                />
              )}
              <StyledInput
                label={"Make"}
                id={"make"}
                type={"text"}
                placeholder={"Enter Make"}
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
              <StyledInput
                label={"Model"}
                id={"model"}
                type={"text"}
                placeholder={"Enter Model"}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <StyledInput
                label={"GPS No"}
                id={"gps_no"}
                type={"number"}
                placeholder={"GPS No"}
                value={gpsNo}
                onChange={(e) => setGpsNo(e.target.value)}
              />
              <StyledInput
                label={"Persons Supported"}
                id={"persons_supported"}
                type={"number"}
                placeholder={"Persons Supported"}
                value={personsSupported}
                onChange={(e) => setPersonsSupported(e.target.value)}
              />
              <StyledInput
                label={"Password"}
                id={"password"}
                type={"password"}
                placeholder={"Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="text-left mt-10">
            <button
              type="submit"
              className="text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
            >
              {loading ? "Saving..." : "Save Ambulance"}
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
