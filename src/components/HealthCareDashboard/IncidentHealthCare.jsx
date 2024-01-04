import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import { Vars } from "../../helpers/helpers";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

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
export default function IncidentHealthCare({}) {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const lableData = [{ label: "Critical", value: 1 }];
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
  const [updateInformarInformation, setUpdateInformarInformation] =
    useState(false);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [SelectincidentType, setSelectincidentType] = useState({});
  const [menuIsOpen, setMenuIsOpen] = useState([]);
  const [open, setOpen] = useState(false);
  const [locationAddress, setLocationAddress] = useState({});
  const [selectedHealthCareOpetion, setSelectedHealthCareOpetion] = useState(
    {}
  );
  const handleAssignAmbulanceAndhealthCare = (data) => {
    if (data === "Assign Ambulance") {
      setAssignAmbulance(true);
      console.log(data);
      sethealthCare(false);
      setUpdateInformarInformation(false);
    } else if (data === "Assign HealthCare") {
      sethealthCare(true);
      setAssignAmbulance(false);
      setUpdateInformarInformation(false);
    } else if (data === "information update") {
      sethealthCare(false);
      setUpdateInformarInformation(true);
      setAssignAmbulance(false);
    }
  };

  const handleEditClick = (incident) => {
    setSelectedIncident(incident);
    setLocationAddress({
      latitude: incident?.latitude,
      longitude: incident?.longitude,
      address: incident.informer?.address,
    });

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

  const assignAmbulance = useFormik({
    initialValues: {
      ambulance_id: "",
    },
    onSubmit: (values) => {
      console.log(selectedOption);
      const JSON = {
        ambulance_id: [selectedOption[0].value],
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
              handleAssignAmbulanceAndhealthCare("Assign HealthCare");
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

  const informarInfarmation = useFormik({
    initialValues: {
      description: selectedIncident?.description,
      informer_name: selectedIncident?.informer?.name,
      informer_phone_numbers:
        selectedIncident?.informer.phone_numbers[0].number,
      informer_address: locationAddress?.address,
    },
    onSubmit: (values) => {
      // setLoadingMessage(true);
      const JSON = {
        latitude: locationAddress.latitude,
        longitude: locationAddress.longitude,
        // incident_type_id:selectedIncident.value,
        description: values.description,
        informer_name: values.informer_name,
        informer_phone_numbers: [values.informer_phone_numbers],
        informer_address: locationAddress.address,
        type: SelectincidentType.label,
      };
      console.log(JSON);
      const informarinformation = async () => {
        try {
          await axios
            .patch(
              `${Vars.domain}/incidents/${selectedIncident?.id}`,
              JSON,
              config
            )
            .then((res) => {
              console.log(res);
              setSubmitDone(!submitDone);
              // setLoadingMessage(false);
              toast.success("Created Successfuly");
              setLocationAddress({});
              setUpdateFormOpen(false);
              setUpdateInformarInformation(false);
            });
        } catch (e) {
          // setLoadingMessage(false);
          toast.error("failed");
          console.log(e);
        }
      };

      informarinformation();
    },

    enableReinitialize: true,
  });

  const GOOGLE_MAPS_APIKEY = "AIzaSyDZiTIdSoTe6XJ7-kiAadVrOteynKR9_38";
  const { ControlPosition, Geocoder } = google.maps;
  const [position, setPosition] = useState({
    lat: 23.8859,
    lng: 45.0792,
  });

  const [address, setAddress] = useState("No address available");
  const geocoder = new Geocoder();
  const handleMarkerDragEnd = (t, map, coord) => {
    const newPosition = {
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    };
    geocoder.geocode({ location: newPosition }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          setLocationAddress({
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: results[0].formatted_address,
          });
        } else {
          setAddress("No address available");
        }
      } else {
        setAddress("Geocoding failed due to: " + status);
      }
    });

    setPosition(newPosition);
    console.log(newPosition);
  };

  const handleMapClick = (mapProps, map, clickEvent) => {
    const newPosition = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };

    geocoder.geocode({ location: newPosition }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          setLocationAddress({
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: results[0].formatted_address,
          });
        } else {
          setAddress("No address available");
        }
      } else {
        setAddress("Geocoding failed due to: " + status);
      }
    });

    setPosition(newPosition);

    console.log(newPosition);
  };
  const sendDataToParent = (latitude, longitude, formatted_address) => {
    setLocationAddress({
      latitude: latitude,
      longitude: longitude,
      address: formatted_address,
    });
  };
  const handlePlaceChange = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 50.064192, lng: -130.605469 },
      zoom: 3,
    });

    const card = document.getElementById("pac-card");
    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(card);

    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    const input = document.getElementById("address");
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "sa" }, // Set the country to Pakistan
      fields: [
        "address_components",
        "geometry",
        "icon",
        "name",
        "formatted_address",
      ],
      strictBounds: false,
    };

    const autocomplete = new window.google.maps.places.Autocomplete(
      input,
      options
    );
    const southwest = { lat: 23.6345, lng: 60.8724 };
    const northeast = { lat: 37.0841, lng: 77.8375 };
    const newBounds = new window.google.maps.LatLngBounds(southwest, northeast);
    autocomplete.setBounds(newBounds);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      let address = "";
      let postalCode = "";

      if (place.address_components) {
        address = place.formatted_address;

        const postalCodeComponent = place.address_components.find((component) =>
          component.types.includes("postal_code")
        );

        postalCode = postalCodeComponent ? postalCodeComponent.short_name : "";
      }

      console.log("Formatted Address:", address);
      console.log("Postal Code:", postalCode);

      // The rest of your code...
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      sendDataToParent(latitude, longitude, address, postalCode);
    });
  };

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
                          Edit
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
      {updateFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1 -left-96 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full   p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setUpdateFormOpen(false);
                  setAssignAmbulance(false);
                  sethealthCare(false);
                  setUpdateInformarInformation(false);
                }}
              />
              <div>
                <div className="">
                  <nav className="flex space-x-4" aria-label="Tabs">
                    <button
                      onClick={() =>
                        handleAssignAmbulanceAndhealthCare("information update")
                      }
                      className={classNames(
                        updateInformarInformation
                          ? "bg-white  text-gray-800"
                          : "text-gray-500 hover:text-gray-700",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      Informar Information
                    </button>
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
              <form
                className="p-5 h-[30rem] flex justify-between flex-col "
                onSubmit={assignAmbulance.handleSubmit}
              >
                <div className="flex flex-row justify-between gap-4 mb-4">
                  <div className="flex flex-col space-y-2 w-full">
                    <div className="mb-5 mt-2 ">
                      <Select
                        value={selectedOption}
                        placeholder="Select"
                        onChange={handleChange}
                        options={myData}
                        formatOptionLabel={formatOptionLabel}
                        isMultiple={true}
                        isClearable={true}
                        primaryColor={"blue"}
                        className="peer  w-full px-1 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-left mt-10">
                  <button
                    type="submit"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100`}
                  >
                    Next
                  </button>
                </div>
              </form>
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
            {updateInformarInformation && (
              <form
                className="p-5  flex justify-between flex-col "
                onSubmit={informarInfarmation.handleSubmit}
              >
                <div className="mb-5 mt-2">
                  <div>
                    <label
                      htmlFor="informer_address"
                      className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        Choose Map
                      </button>
                    </label>
                    <div className="relative mt-2">
                      <input
                        onClick={() => setOpen(true)}
                        onChange={informarInfarmation.handleChange}
                        value={informarInfarmation.values.informer_address}
                        type="text"
                        name="informer_address"
                        id="informer_address"
                        className="peer block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        placeholder=" Choose On Map"
                        required
                        readOnly
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5 mt-2">
                  <div>
                    <label
                      htmlFor="informer_name"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        onChange={informarInfarmation.handleChange}
                        value={informarInfarmation.values.informer_name}
                        type="text"
                        name="informer_name"
                        id="informer_name"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        placeholder="Enter Name"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div>
                    <label
                      htmlFor="informer_phone_numbers"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Contact
                    </label>
                    <div className="relative mt-2">
                      <input
                        onChange={informarInfarmation.handleChange}
                        value={
                          informarInfarmation.values.informer_phone_numbers
                        }
                        type="text"
                        name="informer_phone_numbers"
                        id="informer_phone_numbers"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        placeholder="Enter Contact"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <Listbox
                    value={SelectincidentType}
                    onChange={setSelectincidentType}
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
                              {SelectincidentType.label}
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
                              {lableData?.map((option) => (
                                <Listbox.Option
                                  key={option.label}
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
                                        {option.label}
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
                <div className="mb-5">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        name="description"
                        id="description"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 bg-offWhiteCustom-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6 text-right"
                        onChange={informarInfarmation.handleChange}
                        value={informarInfarmation.values.description}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="text-primary-100 w-40 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
                  type="submit"
                >
                  Next
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <Transition.Root show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)}>
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

          <div className="fixed inset-0 z-50  overflow-y-auto">
            <div className="flex w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform mx-auto w-[90rem] h-screen overflow-hidden rounded-lg bg-white  shadow-xl transition-all">
                  <div className="mt-2">
                    <div
                      style={{
                        width: "100%",
                        height: "100vh",
                      }}
                    >
                      {" "}
                      <div
                        id="pac-card"
                        className="flex rounded-md gap-10 justify-center my-4"
                      >
                        <input
                          id="address"
                          name="address"
                          required
                          className="peer block w-[30rem] rounded-md px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          type="text"
                          placeholder="Enter a location"
                          onChange={handlePlaceChange}
                        />
                        <button onClick={() => setOpen(false)}>Close </button>
                      </div>
                      <div
                        id="map"
                        // style={{ height: "0px", width: "0px" }}
                      ></div>
                      <Map
                        google={google}
                        zoom={10}
                        onClick={handleMapClick}
                        zoomControlOptions={{
                          position: ControlPosition.BOTTOM_LEFT,
                        }}
                        mapTypeControlOptions={{
                          position: ControlPosition.TOP_CENTER,
                        }}
                        initialCenter={position}
                      >
                        <Marker
                          position={position}
                          draggable={true}
                          onDragend={handleMarkerDragEnd}
                        />
                      </Map>
                      <div style={{ marginTop: "10px" }}>
                        <strong>Address:</strong> {address}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
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
