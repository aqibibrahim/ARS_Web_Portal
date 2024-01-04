import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import { Vars } from "../helpers/helpers";
import { BsArrowRightCircle, BsEye, BsSearch } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

const Tab = ({ selected, title, onClick }) => {
  return (
    <button
      className={`px-4 py-2 transition-colors duration-150 ${
        selected ? "bg-white" : "bg-transparent text-gray-700"
      } focus:outline-none`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function IncidentList({}) {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const checkboxes = [
    {
      id: "activeIncidents",
      name: "Active Incidents",
      description: "Show all active incidents.",
    },
    {
      id: "closedIncidents",
      name: "Closed Incidents",
      description: "Show all closed incidents.",
    },
  ];
  const [activeTab, setActiveTab] = useState("active");
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  const [myData, setMyData] = useState([]);

  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [submitDone, setSubmitDone] = useState(false);
  const [ishealthCare, sethealthCare] = useState(false);
  const [assignAmbulans, setAssignAmbulance] = useState(false);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedHealthCareOpetion, setSelectedHealthCareOpetion] = useState(
    {}
  );
  const handleAssignAmbulanceAndhealthCare = (data) => {
    if (data === "Assign Ambulance") {
      setAssignAmbulance(true);
      console.log(data);
      sethealthCare(false);
    } else {
      sethealthCare(true);
      console.log("azhar");
      setAssignAmbulance(false);
    }
  };

  const handleEditClick = (incident) => {
    setSelectedIncident(incident);
    setUpdateFormOpen(true);
    setAssignAmbulance(true);
  };
  useEffect(() => {
    const fetchincidentData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/incidents`, {
            headers: headers,
          })
          .then((response) => {
            setIncidentData(response.data?.data);
            setIsLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchincidentData();
  }, [submitDone]);

  useEffect(() => {
    const fetchHealthCareData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/facilities`, {
            headers: headers,
          })
          .then((response) => {
            setMenuIsOpen(response?.data?.data);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchHealthCareData();
  }, []);
  useEffect(() => {
    const fetchAmbulanceData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/ambulances`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label: variant.model,
                value: variant.id,
                persons_supported: variant.persons_supported,
                id_no: variant.id_no,
              }))
            );
            // setIsLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchAmbulanceData();
  }, []);
  const handleViewClick = (incident) => {
    // setLongitude(null)
    // setLatitude(null)
    // setOptions(null)
    // setSelectedAmbulance(ambulance)
    // setLocationAddress({
    // 	latitude: ambulance?.parking_latitude,
    // 	longitude: ambulance?.parking_longitude,
    // 	address: '',
    // })
    // if (ambulance?.equipments.length === 0) {
    // 	setEditOptions(null)
    // } else {
    // 	setEditOptions(
    // 		ambulance?.equipments?.map((variant) => ({
    // 			label: variant.name,
    // 			value: variant.id,
    // 		}))
    // 	)
    // }
    setViewOpen(true);
    setSelectedIncident(incident);
    console.log(incident, "incident");
  };
  const assignAmbulance = useFormik({
    initialValues: {
      ambulance_id: "",
    },
    onSubmit: (values) => {
      const JSON = {
        ambulance_id: selectedOption[0].value,
      };
      const AssignAmbulance = async () => {
        console.log(JSON);
        try {
          await axios
            .patch(
              `${Vars.domain}/incidents/${selectedIncident?.id}`,
              JSON,
              config
            )
            .then((res) => {
              console.log(res);
              toast.success("Updated Successfuly");
              setSubmitDone(!submitDone);
              setSelectedOption(null);
              handleAssignAmbulanceAndhealthCare(false);
            });
        } catch (e) {
          toast.error("failed");
          console.log(e);
        }
      };
      AssignAmbulance();
    },

    enableReinitialize: true,
  });

  const assignHealthCare = useFormik({
    initialValues: {
      facility_id: "",
    },
    onSubmit: (values) => {
      const JSON = {
        facility_id: selectedHealthCareOpetion.id,
      };
      const AssignHealthCare = async () => {
        console.log(JSON);
        try {
          await axios
            .patch(
              `${Vars.domain}/incidents/${selectedIncident?.id}`,
              JSON,
              config
            )
            .then((res) => {
              console.log(res);
              toast.success("Updated Successfuly");
              setSubmitDone(!submitDone);
              setUpdateFormOpen(false);
            });
        } catch (e) {
          toast.error("failed");
          console.log(e);
        }
      };

      AssignHealthCare();
    },

    enableReinitialize: true,
  });

  const AmbulanceDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const result = await axios.delete(
          `${Vars.domain}/incidents/${isDeleteID}`,
          config
        );
        toast.success("Deleted successfully");
        setSubmitDone(!submitDone);
      } catch (e) {
        console.error(e);
        toast.error("Failed to delete");
      }
    },
    enableReinitialize: true,
  });
  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);
    console.log(selectedOptions);
  };
  const formatOptionLabel = ({ label, persons_supported, id_no }) => (
    <div className="flex flex-col hover:bg-gray-100 cursor-pointer justify-end gap-2 border  border-gray-400 p-1 rounded-md mb-2 text-gray-800">
      <p className="text-right">Model:{label}</p>
      <p className="text-right">Persons Supported:{persons_supported}</p>
      <p className="text-right">Id No:{id_no}</p>
    </div>
  );
  return (
    <div
      className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
    >
      <Toaster position="bottom-right" richColors />
      <div className="bg-lightGray-100 w-full h-auto rounded-lg p-2">
        <div className="p-4 text-right">
          <h1 className="text-2xl font-semibold">Incidents List</h1>
        </div>
        <div className="flex flex-row items-center p-4 space-x-4">
          <div className="flex flex-row space-x-2"></div>
          <div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 py-1">
            <BsSearch width={9} height={9} />
            <input
              className="bg-transparent focus:border-none border-0 w-full text-right"
              type="text"
              placeholder="Search Incidents..."
            />
          </div>
          <div className="flex flex-row items-center p-4 space-x-4">
            <div className="flex flex-row space-x-2">
              <Tab
                selected={activeTab === "active"}
                title="Active Incidents"
                onClick={() => setActiveTab("active")}
              />
              <Tab
                selected={activeTab === "closed"}
                title="Closed Incidents"
                onClick={() => setActiveTab("closed")}
              />
            </div>
          </div>
          {/* <button
          className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
          type="button"
          onClick={() => navigate("/equipment")}
        >
          Equipment
        </button>
        <button
          className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
          type="button"
          onClick={handleCreateAmbulanceClick}
        >
          + Create Ambulance
        </button> */}
        </div>
        <div className="rtl">
          {isLoading ? (
            <p className="text-center text-xl text-primary-100">Loading...</p>
          ) : incidentData.length == 0 ? (
            <p className="text-center text-xl text-primary-100">
              No data available
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-300 text-right">
              <thead>
                <tr>
                  <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Facility
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Contact Number
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    ID No
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Informer
                  </th>
                </tr>
              </thead>
              <tbody>
                {incidentData?.map((incident) => (
                  <tr key={incident?.id} className="hover:bg-gray-100">
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <span className="flex items-center justify-center gap-5">
                        {/* <span
                        className="text-red-500 flex justify-center  hover:text-red-600"
                        onClick={() => {
                          setDelete(true);
                          setDeleteID(incident?.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </span> */}
                        <button
                          onClick={() => {
                            handleEditClick(incident);
                            sethealthCare(false);
                            setSelectedHealthCareOpetion({});
                          }}
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                        >
                          <BiEdit />
                          <span className="sr-only">, {incident.name}</span>
                        </button>
                        <button
                          onClick={() => {
                            handleViewClick(incident);
                            sethealthCare(false);
                            setSelectedHealthCareOpetion({});
                          }}
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                        >
                          <BsEye />
                          <span className="sr-only">, {incident.name}</span>
                        </button>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {incident?.ambulance?.model}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {incident?.facility?.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {incident?.informer?.phone_numbers?.map((phone) => (
                        <div key={phone.id}>{phone.number}</div>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {incident.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {incident.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {incident?.ambulance?.id_no}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {incident?.informer?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {viewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mx-auto mt-10 p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setViewOpen(false)}
              />
              <h3 className="text-xl font-semibold text-red-500">
                {selectedIncident?.incident_type?.name}
                <span className="text-lime-600 ml-2">
                  {selectedIncident?.type}
                </span>
              </h3>
            </div>
            <div className="p-5 text-right">
              <p className="text-xl text-right font-bold">Informer Details</p>
              <p>
                {" "}
                <span className="font-semibold">Name: </span>{" "}
                {selectedIncident?.informer?.name}
              </p>
              <p>
                {" "}
                <span className="font-semibold">Phone Number: </span>{" "}
                {selectedIncident?.informer?.phone_numbers[0]?.number}
              </p>
            </div>
            <div>
              {/* <div className=" text-right p-5">
                <p>
                  {" "}
                  <span className="font-semibold text-right">
                    Phone No:{" "}
                  </span>{" "}
                  {selectedIncident?.informer?.phone_numbers[0]?.number}
                </p> */}
              {/* <p>
                  <span className="font-semibold">Model:</span>{" "}
                  {selectedAmbulance?.model}
                </p>
                <p>
                  <span className="font-semibold">Plate#:</span>{" "}
                  {selectedAmbulance?.plate_no}
                </p> */}
              {/* </div> */}
              <div className="px-5">
                <p className="text-lg text-right font-semibold">
                  Ambulance Details
                </p>
                {selectedIncident?.ambulances?.map((ambulance, index) => (
                  <div
                    className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
                    key={ambulance.id}
                  >
                    <div className="flex justify-between gap-12  ">
                      <p className="bg-blue-200 p-2 rounded-full">
                        {index + 1}
                      </p>
                      <p>
                        {" "}
                        <span className="font-semibold">Make: </span>{" "}
                        {ambulance.make}
                      </p>
                      <p>
                        <span className="font-semibold">Model:</span>{" "}
                        {ambulance?.model}
                      </p>
                      <p>
                        <span className="font-semibold">Plate#:</span>{" "}
                        {ambulance?.plate_no}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="px-5 mt-4">
                <p className="text-lg text-right font-semibold">
                  Equipment Details
                </p>
                {selectedAmbulance?.equipments?.map((equipment) => (
                  <p key={equipment.id} className="text-base text-right">
                    {equipment.name}
                  </p>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      )}
      {updateFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1 -left-[17rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full   p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setUpdateFormOpen(false);
                  setAssignAmbulance(false);
                  sethealthCare(false);
                }}
              />
              <div>
                <div className="">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                      onClick={() =>
                        handleAssignAmbulanceAndhealthCare("Assign HealthCare")
                      }
                      className={classNames(
                        ishealthCare
                          ? "bg-white  text-gray-800"
                          : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      HealthCare
                    </button>
                    <button
                      onClick={() =>
                        handleAssignAmbulanceAndhealthCare("Assign Ambulance")
                      }
                      className={classNames(
                        assignAmbulans
                          ? "bg-white  text-gray-800"
                          : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      Ambulance
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            {assignAmbulans && (
              <div className="px-5">
                <p className="text-lg text-right font-semibold">
                  Ambulance Details
                </p>
                {selectedIncident?.ambulances?.map((ambulance, index) => (
                  <div
                    className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
                    key={ambulance.id}
                  >
                    <div className="flex justify-between gap-12  ">
                      <p className="bg-blue-200 p-2 rounded-full">
                        {index + 1}
                      </p>
                      <p>
                        {" "}
                        <span className="font-semibold">Make: </span>{" "}
                        {ambulance.make}
                      </p>
                      <p>
                        <span className="font-semibold">Model:</span>{" "}
                        {ambulance?.model}
                      </p>
                      <p>
                        <span className="font-semibold">Plate#:</span>{" "}
                        {ambulance?.plate_no}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {ishealthCare && (
              <form
                className="p-5 h-[30rem] flex justify-between flex-col"
                onSubmit={assignHealthCare.handleSubmit}
              >
                <div className="flex flex-row justify-between gap-4 mb-4">
                  <div className="flex flex-col space-y-2 w-full">
                    <div className="mb-5 mt-2">
                      <Listbox
                        value={selectedHealthCareOpetion}
                        onChange={setSelectedHealthCareOpetion}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                              Incedent type
                            </Listbox.Label>
                            <div className="relative mt-2">
                              <Listbox.Button className="relative w-full h-8 cursor-default rounded-md bg-white py-1.5 pl-10 pr-3 text-right text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:text-sm sm:leading-6">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400 transform rotate-180"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="block truncate">
                                  {selectedHealthCareOpetion.name}
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {menuIsOpen?.map((option) => (
                                    <Listbox.Option
                                      key={option.name}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-primary-100 text-white"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-8 pr-4 text-right"
                                        )
                                      }
                                      value={option}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {option.name}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-primary-100",
                                                "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                  </div>
                </div>
                <div className="text-left mt-10">
                  <button
                    type="submit"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100`}
                  >
                    HealthCare
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Transition.Root show={isDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setDelete}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute left-0 top-0 hidden pl-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setDelete(false)}
                    >
                      <span className="sr-only">Close</span>
                      <BsArrowRightCircle
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base sr-only font-semibold leading-6 text-gray-900"
                      >
                        Deactivate account
                      </Dialog.Title>
                      <div className="mt-10 ">
                        <p className="text-sm flex justify-center items-center text-gray-500">
                          Are you sure want to DELETE?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 sm:mt-1 sm:flex sm:flex-row-reverse">
                    <form
                      onSubmit={AmbulanceDelete.handleSubmit}
                      className="mt-3 sm:mt-3"
                    >
                      <button
                        type="submit"
                        className="inline-flex w-full text-lg justify-center rounded-md bg-red-400 px-3 py-2 font-semibold text-white  hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        onClick={() => setDelete(false)}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
