import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import closeIcon from "../assets/close.svg";
import IncidentForm from "./IncidentForm";
import AmbulanceForm from "./AmbulanceForm";
import HealthCareForm from "./HealthCareForm";
import AssignedAmbulances from "./AssignedAmbulances";
import { Listbox, Transition } from "@headlessui/react";
import { Select as AntSelect } from "antd";
import InputMask from "react-input-mask";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Vars } from "../helpers/helpers";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const GOOGLE_MAPS_APIKEY = "AIzaSyDZiTIdSoTe6XJ7-kiAadVrOteynKR9_38";
const tabConfig = {
  Incident: "Create Incident",
  Ambulance: "Select Ambulance",
  HealthCare: "Select HealthCare",
};

const EmergencyType = [
  { label: "Critical", value: 1 },
  { label: "Moderate", value: 2 },
  { label: "Mild", value: 3 },
];
const Gender = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Both", value: "Both" },
];
const CreateIncidentSidebar = ({ onClose, data, selectmap }) => {
  const [activeTab, setActiveTab] = useState("Incident");
  const [isAssignedAmbulancesVisible, setIsAssignedAmbulancesVisible] =
    useState(false);
  const [incidentData, setIncidentData] = useState({});
  const [ambulanceData, setAmbulanceData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [incidentType, setIncidentType] = useState([]);
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    const getIncidentTypes = async () => {
      try {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/incident-type`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          setIncidentType(response?.data?.data);
          setMyData(
            response.data?.data?.map((variant) => ({
              label: variant.name,
              value: variant.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };
    getIncidentTypes();
  }, []);

  const handleShowIncidentSummary = () => {
    setIsAssignedAmbulancesVisible(true);
  };
  const handleIncidentNext = (formData) => {
    setIncidentData(formData);

    setActiveTab("Ambulance");
  };
  const handleAmbulanceNext = (formData) => {
    setAmbulanceData(formData);

    setActiveTab("HealthCare");
  };
  const handelclose = () => {
    onClose();
  };
  const handelselectmap = () => {
    selectmap();
  };
  const renderFormForTab = () => {
    switch (activeTab) {
      case "Incident":
        return (
          <Header getlatitude={data} handleIncidentNext={handleIncidentNext} />
        );
      case "Ambulance":
        return (
          <AmbulanceForm
            handleAmbulanceNext={handleAmbulanceNext}
            getid={incidentData}
            showIncidentSummary={handleShowIncidentSummary}
          />
        );
      case "HealthCare":
        return <HealthCareForm onClick={handelclose} datatt={ambulanceData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={` flex  overflow-hidden   `}>
        {isAssignedAmbulancesVisible && (
          <AssignedAmbulances
            onClose={() => setIsAssignedAmbulancesVisible(false)}
          />
        )}
        <div
          className={`h-full bg-grayBg-100 transition-all duration-300 ${
            isAssignedAmbulancesVisible ? "" : "rounded-l-lg"
          } 
           overflow-y-scroll no-scrollbar`}
        >
          <div className="flex flex-col px-2 py-1 my-2 rounded-[12px] bg-white w-[400px] h-screen overflow-hidden">
            <div className="flex flex-row justify-between items-center p-2">
              <img
                src={closeIcon}
                alt="close"
                className="w-7 h-7 cursor-pointer"
                onClick={onClose}
              />
              <h1 className="text-2xl font-semi">{tabConfig[activeTab]}</h1>
            </div>

            <Tabs activeTab={activeTab} onTabClick={setActiveTab} />

            <div className="flex-1 overflow-y-auto ">{renderFormForTab()}</div>
          </div>
        </div>
      </div>
    </>
  );
};
const Header = ({ handleIncidentNext, getlatitude, getmap }) => {
  var token = localStorage.getItem("token");
  const [myData, setMyData] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  useEffect(() => {
    const getIncidentTypes = async () => {
      try {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/incident-type`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          // setIncidentType(response?.data?.data)
          setMyData(
            response.data?.data?.map((variant) => ({
              label: variant.name,
              value: variant.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };
    getIncidentTypes();
  }, []);
  const [open, setOpen] = useState(false);
  const [emergencyOpen, setEmergecnyOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState({});
  const [selectedEmergencyOption, setSelectedEmergencyOption] = useState({});
  const [selectedGender, setSelectedGender] = useState({});

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [locationAddress, setLocationAddress] = useState({});
  const [submitDone, setSubmitDone] = useState(false);
  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);

  const createIncident = useFormik({
    initialValues: {
      ambulances: "",
      name: "",
      latitude: "",
      longitude: "",
      address: "",
      informer_address: locationAddress?.address,
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        latitude: locationAddress.latitude,
        longitude: locationAddress.longitude,
        incident_type_id: selectedOption.value,
        description: values.description,
        informer_name: values.informer_name,
        informer_phone_numbers: [values.informer_phone_numbers],
        informer_address: locationAddress.address,
        type: selectedEmergencyOption.label,
        gender: selectedGender.value,
      };
      console.log(JSON);
      const createIncident = async () => {
        try {
          await axios
            .post(`${Vars.domain}/incidents`, JSON, config)
            .then((res) => {
              console.log(res);
              setSubmitDone(!submitDone);
              setLoadingMessage(false);
              toast.success("Created Successfuly");
              handleIncidentNext(res?.data?.data?.id);
              setLocationAddress({});
            });
        } catch (e) {
          setLoadingMessage(false);
          toast.error("failed");
          console.log(e);
        }
      };

      createIncident();
    },

    enableReinitialize: true,
  });

  const GOOGLE_MAPS_APIKEY = "AIzaSyDZiTIdSoTe6XJ7-kiAadVrOteynKR9_38";
  const { ControlPosition, Geocoder } = google.maps;
  const [position, setPosition] = useState({
    lat: 33.7519137,
    lng: 72.7970134,
  });
  const [uncontrolledAddress, setUncontrolledAddress] = useState("");
  const [address, setAddress] = useState("No address Selected");
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
          createIncident.setFieldValue("latitude", newPosition.lat);
          createIncident.setFieldValue("longitude", newPosition.lng);
          createIncident.setFieldValue(
            "informer_address",
            results[0].formatted_address
          );
        } else {
          setAddress("No address available");
        }
      } else {
        setAddress("Geocoding failed due to: " + status);
      }
    });

    setPosition(newPosition);

    console.log(newPosition, "asd");
  };
  const sendDataToParent = (latitude, longitude, formatted_address) => {
    setLocationAddress({
      latitude: latitude,
      longitude: longitude,
      address: formatted_address,
    });
    setPosition({
      lat: latitude,
      lng: longitude,
    });
    createIncident.setFieldValue("latitude", latitude);
    createIncident.setFieldValue("longitude", longitude);
    createIncident.setFieldValue("informer_address", formatted_address);
  };

  const handlePlaceChange = () => {
    const input = document.getElementById("address");
    const options = {
      // bounds: defaultBounds, // Uncomment this line if you have specific bounds
      componentRestrictions: { country: "pk" },
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

      // Set the input value with a timeout to ensure reactivity

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      sendDataToParent(latitude, longitude, address, postalCode);
      setUncontrolledAddress(address);
    });
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <form onSubmit={createIncident.handleSubmit}>
        <div className="mb-5 mt-2">
          <div>
            <label
              htmlFor="informer_address"
              className=" text-sm  font-sm leading-6 text-gray-900 text-right"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="block text-sm font-sm leading-6 text-gray-900 text-right"
              >
                Choose Map
              </button>
            </label>
            <div className="relative mt-2">
              <input
                onClick={() => setOpen(true)}
                // onChange={(e) => {
                //   createIncident.handleChange(e);
                //   console.log(createIncident.values.informer_address);
                // }}
                value={createIncident.values.informer_address}
                type="text"
                name="informer_address"
                id="informer_address"
                className="peer block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                placeholder="Choose On Map"
                required
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
              className="block text-sm font-sm leading-6 text-gray-900 text-right placeholder:text-sm mr-2"
            >
              Name
            </label>
            <div className="relative mt-2">
              <input
                onChange={createIncident.handleChange}
                value={createIncident.values.informer_name}
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
              className="block text-sm mr-2 leading-6 text-gray-900 text-right"
            >
              Contact
            </label>
            <div className="relative mt-2">
              <InputMask
                mask="00218 99 9999999"
                maskChar=""
                placeholder="00218 XX XXXXXXX"
                onChange={createIncident.handleChange}
                value={createIncident.values.informer_phone_numbers}
                type="tel"
                name="informer_phone_numbers"
                id="informer_phone_numbers"
                className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
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
          <Listbox value={selectedOption} onChange={setSelectedOption}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 mr-2 text-gray-900 text-right">
                  Incident type
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
                      {selectedOption.label}
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
                      {myData.map((option) => (
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
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {option.label}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-primary-100",
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
          <Listbox
            value={selectedEmergencyOption}
            onChange={setSelectedEmergencyOption}
          >
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 mr-2 text-gray-900 text-right">
                  Emergency type
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
                      {selectedEmergencyOption.label}
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
                      {EmergencyType.map((option) => (
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
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {option.label}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-primary-100",
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
          <Listbox value={selectedGender} onChange={setSelectedGender}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 mr-2 text-gray-900 text-right">
                  Gender{" "}
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
                      {selectedGender.value}
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
                      {Gender.map((option) => (
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
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {option.label}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-primary-100",
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
              className="block text-sm mr-2 font-medium leading-6 text-gray-900 text-right"
            >
              Description
            </label>
            <div className="mt-2">
              <textarea
                rows={4}
                name="description"
                id="description"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 bg-offWhiteCustom-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6 text-right"
                onChange={createIncident.handleChange}
                value={createIncident.values.description}
                placeholder="Description"
              />
            </div>
          </div>
        </div>

        <button
          className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
          type="submit"
        >
          Next
        </button>
      </form>

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
                          // value={createIncident.values.informer_address}
                        />
                        <div style={{ marginTop: "10px" }}>
                          <strong>Address:</strong> {address}
                        </div>
                        <button
                          onClick={() => setOpen(false)}
                          className="bg-blue-400 rounded-xl px-3 text-white mt-1 font-semibold"
                        >
                          Close
                        </button>
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
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export { Header, CreateIncidentSidebar };
