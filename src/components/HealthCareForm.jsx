import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Select from "react-tailwindcss-select";

import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import DropdownListbox from "./DropdownListbox";
import { Vars } from "../helpers/helpers";
import { useFormik } from "formik";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { BiEdit } from "react-icons/bi";
import { useAmbulanceContext } from "./AmbulanceContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const HealthCares = [
  {
    title: "HealthCare1",
    current: false,
  },
  {
    title: "HealthCare2",
    current: false,
  },
  {
    title: "HealthCare3",
    current: false,
  },
];

const HealthCareForm = ({ onClick, datatt, onClose }) => {
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
  const [visibleDivIndex, setVisibleDivIndex] = useState(null);
  const [hasHiddenDivShown, setHasHiddenDivShown] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  const [ambulanceID, setAmbulanceID] = useState(0);
  const [dynamicIndex, setDynamicIndex] = useState(false);
  const [disabledAmbulanceIDs, setDisabledAmbulanceIDs] = useState([]);
  const [visibleDivAmbulanceID, setVisibleDivAmbulanceID] = useState(null);
  const [selectedFacilityOption, setSelectedFacilityOption] = useState();
  const [selectHealthCare, setSelectHealthCare] = useState(HealthCares[0]);
  console.log(ambulanceID, "ambID");
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
        await axios
          .get(
            `https://ars.disruptwave.com/api/get-available-facilities?incident_id=${
              datatt ? datatt : id
            }`,
            {
              headers: headers,
            }
          )
          .then((response) => {
            // setMyData(response.data?.data?.map(variant => ({
            //    label:variant.model, value: variant.id ,persons_supported:variant.persons_supported, id_no: variant.id_no
            // })))
            // setIsLoading(false);
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
            console.log(response?.data?.data, "asds");
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchRegionData();
  }, [datatt]);
  const handleViewOnMap = (value) => (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent elements
    setSelectedFacilityId(value);
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
  useEffect(() => {
    const fetchsingleincidentsData = async () => {
      const id = localStorage.getItem("IncidentID");

      try {
        await axios
          .get(
            `https://ars.disruptwave.com/api/incidents/${datatt ? datatt : id}`,
            {
              headers: headers,
            }
          )
          .then((response) => {
            setShowAssignAmbulance(response?.data?.data?.ambulances);
            console.log("fetchsingleData", response?.data?.data);
          });
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
      facility_id: selectedFacilityOption.value,
    };
    console.log(JSON);
    console.log(selectedFacilityOption, "dsdsds");
    try {
      await axios
        .patch(`${Vars.domain}/ambulances/${ambulanceID}`, JSON, config)
        .then((res) => {
          console.log(res);
          toast.success("HealthCare Assigned Successfuly");
          setBtnDisbale(true);
          //   setSelectedOption("")
          setOpen(false);
        });
    } catch (e) {
      // setLoadingMessage(false);
      toast.error("failed");
      console.log(e);
    }
    console.log(ambulanceID, "aaambID");
  };
  const activeIndex = (index) => {
    setDynamicIndex(index);
  };
  const handleChange = (selectedOption, ambulance) => {
    setAmbulanceID(ambulance?.id);

    setSelectedFacilityOption(selectedOption);
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
            </p>{" "}
            {/* <p className="text-right">
              Persons Supported:
              {ambulance?.distance_info}
            </p> */}
            <p className="text-right">Id No:{ambulance?.id_no}</p>
            <p className="text-right">
              Drver: {ambulance?.driver?.first_name}
            </p>{" "}
            <p className="text-right">
              Driver Email: {ambulance?.driver?.email}
            </p>{" "}
            {/* {disabledAmbulanceIDs.includes(ambulance?.id) && ( */}
            <div key={ambulance?.id} className="text-right">
              <div className="mb-5 mt-2 flex flex-col">
                <Select
                  value={selectedFacilityOption}
                  placeholder="Select HealthCare"
                  onChange={(selectedOption) => {
                    handleChange(selectedOption, ambulance);
                  }}
                  options={menuIsOpen}
                  formatOptionLabel={formatOptionLabel}
                  isMultiple={false}
                  isClearable={true}
                  primaryColor={"blue"}
                  className="peer w-full px-1 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                />

                <div className="flex mt-3 text-right justify-start ml-auto">
                  {selectedFacilityOption && (
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
              {selectedFacilityOption ? (
                <div className="border-t-4 flex justify-around flex-col ">
                  <p className="flex text-xl font-bold ">
                    Assigned Health Care
                  </p>
                  {/* <button
                    className="flex text-right text-blue-500 mt-2"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <BiEdit />
                  </button> */}
                  <p>
                    <span>Facility Name: </span> {selectedFacilityOption?.label}
                  </p>
                  <p>
                    <span>Email: </span> {selectedFacilityOption?.email}
                  </p>
                  <p>
                    <span>Distance: </span>{" "}
                    {selectedFacilityOption?.distance +
                      " " +
                      selectedFacilityOption?.duration}
                  </p>
                </div>
              ) : (
                <div className="border-t-4 flex justify-around flex-col ">
                  <p className="flex text-xl font-bold ">
                    Assigned Health Care
                  </p>
                  {/* <button
                    className="flex text-right text-blue-500 mt-2"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <BiEdit />
                  </button> */}
                  <p>
                    <span>Facility Name: </span> {ambulance?.facility?.name}
                  </p>
                  <p>
                    <span>Email: </span> {ambulance?.facility?.email}
                  </p>
                  <p>
                    <span>Distance: </span>{" "}
                    {ambulance?.distance_info?.from_incident_to_facility
                      ?.rows[0]?.elements[0]?.distance?.text +
                      " " +
                      ambulance?.distance_info?.from_incident_to_facility
                        ?.rows[0]?.elements[0]?.duration?.text}
                  </p>
                </div>
              )}
              {/* <p>
                  <span>Phone Number: </span>
                  {selectedFacilityOption?.phone_numbers?.map((phone) => (
                    <span key={phone?.id}>{phone?.number}</span>
                  ))}
                </p> */}
              {/* <p>
                  <span>Focal Person: </span>
                  {selectedFacilityOption?.focal_persons?.map((person) => (
                    <span key={person?.id}>
                      {person?.first_name}
                      {person?.last_name}
                    </span>
                  ))}
                </p> */}

              {/* <p>
                  <span>Focal Person: </span>
                  {selectedFacilityOption?.focal_persons?.map((person) => (
                    <span key={person?.id}>
                      {person?.first_name}
                      {person?.last_name}
                    </span>
                  ))}
                </p> */}
            </div>
            {/* )} */}
            {/* {!disabledAmbulanceIDs.includes(ambulance?.id) && (
              <button
                onClick={() => {
                  setOpen(true);
                  setAmbulanceID(ambulance?.id);

                  // Toggle the visibility of the div
                  setVisibleDivIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );

                  // Set the flag to true once the hidden div is shown
                  setHasHiddenDivShown(true);

                  // Disable the button and set the ambulance ID to the disabledAmbulanceIDs state
                  setDisabledAmbulanceIDs((prevIDs) => [
                    ...prevIDs,
                    ambulance?.id,
                  ]);
                }}
                className={`flex items-center m-1 px-1.5 py-1.5 w-36 rounded-md text-sm justify-center 
            ${
              visibleDivIndex === index
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-white border-2 border-primary-100 hover:border-primary-100 transition-all duration-300 hover:bg-primary-100 hover:text-white"
            }
          `}
              >
                Assign HealthCare
              </button>
            )} */}
          </div>
        ))
      )}
      <div className="flex  bottom-10 absolute">
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
};

export default HealthCareForm;
