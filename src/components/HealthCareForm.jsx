import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { useAmbulanceContext } from "./AmbulanceContext";
import { Vars } from "../helpers/helpers";
import { useFormik } from "formik";

function HealthCareForm({ onClick, datatt, onClose }) {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [menuIsOpen, setMenuIsOpen] = useState([]);
  const [showAssignAmbulance, setShowAssignAmbulance] = useState([]);
  const [open, setOpen] = useState(false);
  const [btnDisable, setBtnDisbale] = useState(false);
  const [ambulanceID, setAmbulanceID] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState({});

  const {
    selectedAmbulanceId,
    setAmbulanceId,
    resetState,
    setSelectedFacilityId,
  } = useAmbulanceContext();

  useEffect(() => {
    const fetchRegionData = async () => {
      const id = localStorage.getItem("IncidentID");
      try {
        const response = await axios.get(
          `https://ars.disruptwave.com/api/get-available-facilities?incident_id=${
            datatt ? datatt : id
          }`,
          {
            headers: headers,
          }
        );

        setMenuIsOpen(
          response.data?.data?.map((variant) => ({
            label: variant.name,
            value: variant.id,
            email: variant.email,
            distance: variant?.distance_info
              ? variant?.distance_info?.rows[0]?.elements[0]?.distance?.text
              : "Distance Not Available",
            duration:
              variant?.distance_info?.rows[0]?.elements[0]?.duration?.text,
          }))
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchRegionData();
  }, [datatt]);

  useEffect(() => {
    const fetchsingleincidentsData = async () => {
      const id = localStorage.getItem("IncidentID");

      try {
        const response = await axios.get(
          `https://ars.disruptwave.com/api/incidents/${datatt ? datatt : id}`,
          {
            headers: headers,
          }
        );

        setShowAssignAmbulance(response?.data?.data?.ambulances);
      } catch (e) {
        console.log(e);
      }
    };
    fetchsingleincidentsData();
  }, []);

  const assignAmbulance = useFormik({
    initialValues: {
      driver: "",
    },
  });

  const createAssignAmbulance = async () => {
    const JSON = {
      facility_id: selectedFacilities[ambulanceID]?.value,
    };

    try {
      await axios.patch(
        `${Vars.domain}/ambulances/${ambulanceID}`,
        JSON,
        config
      );
      toast.success("HealthCare Assigned Successfully");
      setBtnDisbale(true);
      setOpen(false);
    } catch (e) {
      toast.error("Failed to Assign HealthCare");
      console.log(e);
    }
  };

  const handleChange = (selectedOption, ambulance) => {
    setAmbulanceID(ambulance?.id);

    setSelectedFacilities((prevSelectedFacilities) => ({
      ...prevSelectedFacilities,
      [ambulance?.id]: selectedOption,
    }));
  };
  const formatOptionLabel = ({ label, value, distance, duration, email }) => (
    <>
      {" "}
      <div
        className={`flex flex-col hover:bg-gray-100 cursor-pointer justify-end gap-2 border  p-1 rounded-md mb-2 text-gray-800`}
      >
        <p className="text-right font-semibold">{label}</p>
        <p className="text-right">{email}</p>
        <p className="text-right text-green-500">
          {distance} {duration}
        </p>{" "}
        <div className="flex justify-end">
          <p
            className="text-white bg-blue-400 p-1 w-28 flex justify-center justify-items-end hover:bg-white hover:text-blue-400 hover:border-blue-400 hover:border rounded-xl text-right focus:outline-none"
            onClick={handleViewOnMap(value)}
          >
            View on Map
          </p>
        </div>
      </div>{" "}
    </>
  );
  const handleViewOnMap = (value) => (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent elements
    setSelectedFacilityId(value);
  };
  return (
    <>
      <Toaster position="bottom-right" richColors />

      {showAssignAmbulance.length === 0 ? (
        <div className="flex mt-4 flex-col hover:bg-gray-100 cursor-pointer justify-end gap-1 border  border-gray-400 p-1 rounded-md mb-2 text-gray-800">
          <p className="text-right">loading...</p>
        </div>
      ) : (
        showAssignAmbulance?.map((ambulance, index) => (
          <div
            key={ambulance?.id}
            className="flex mt-4 flex-col hover:bg-gray-100 cursor-pointer justify-end gap-1 border border-gray-400 p-1 rounded-md mb-2 text-gray-800"
          >
            <p className="text-right">
              Model:
              {ambulance?.model?.make?.name +
                " " +
                ambulance?.model?.name +
                " " +
                ambulance?.plate_no}
            </p>
            <p className="text-right">
              Persons Supported:{ambulance?.persons_supported}
            </p>
            <p className="text-right">Id No:{ambulance?.id_no}</p>
            <p className="text-right">
              Driver: {ambulance?.driver?.first_name}
            </p>
            <p className="text-right">
              Driver Email: {ambulance?.driver?.email}
            </p>

            <div key={ambulance?.id} className="text-right">
              <div className="mb-5 mt-2 flex flex-col">
                <Select
                  value={selectedFacilities[ambulance?.id]}
                  placeholder="Select HealthCare"
                  onChange={(selectedOption) => {
                    handleChange(selectedOption, ambulance);
                  }}
                  options={menuIsOpen}
                  isMultiple={false}
                  isClearable={true}
                  primaryColor={"blue"}
                  formatOptionLabel={formatOptionLabel}
                  className="peer w-full px-1 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                />

                <div className="flex mt-3 text-right justify-start ml-auto">
                  {selectedFacilities[ambulance?.id] && (
                    <button
                      className="text-white text-sm bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-2 transition-all duration-300 hover:bg-white hover:text-primary-100"
                      type="submit"
                      onClick={() => {
                        createAssignAmbulance();
                      }}
                    >
                      Assign HealthCare
                    </button>
                  )}
                </div>
              </div>

              {selectedFacilities[ambulance?.id] ? (
                <div className="border-t-4 flex justify-around flex-col ">
                  <p className="flex text-xl font-bold ">
                    Assigned Health Care
                  </p>
                  <p>
                    <span>Facility Name: </span>
                    {selectedFacilities[ambulance?.id]?.label}
                  </p>
                  <p>
                    <span>Email: </span>
                    {selectedFacilities[ambulance?.id]?.email}
                  </p>
                  <p>
                    <span>Distance: </span>
                    {selectedFacilities[ambulance?.id]?.distance +
                      " " +
                      selectedFacilities[ambulance?.id]?.duration}
                  </p>
                </div>
              ) : (
                <div className="border-t-4 flex justify-around flex-col ">
                  <p className="flex text-xl font-bold ">
                    Assigned Health Care
                  </p>
                  <p>
                    <span>Facility Name: </span>
                    {ambulance?.facility?.name}
                  </p>
                  <p>
                    <span>Email: </span>
                    {ambulance?.facility?.email}
                  </p>
                  <p>
                    <span>Distance: </span>
                    {ambulance?.distance_info?.from_incident_to_facility
                      ?.rows[0]?.elements[0]?.distance?.text +
                      " " +
                      ambulance?.distance_info?.from_incident_to_facility
                        ?.rows[0]?.elements[0]?.duration?.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <div className="flex mb-5">
        <button
          className="text-primary-100 flex  bg-white rounded-md border-2 border-primary-100 mr-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
          type="submit"
          onClick={() => {
            onClose();
          }}
        >
          Close
        </button>
      </div>
    </>
  );
}

export default HealthCareForm;
