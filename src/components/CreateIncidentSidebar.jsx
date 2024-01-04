import React, { useState } from "react";
import Tabs from "./Tabs";
import closeIcon from "../assets/close.svg";
import IncidentForm from "./IncidentForm";
import AmbulanceForm from "./AmbulanceForm";
import HealthCareForm from "./HealthCareForm";
import AssignedAmbulances from "./AssignedAmbulances";
import { Listbox, Transition } from "@headlessui/react";
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
const myData = [{ label: "Critical", value: 1 }];
const CreateIncidentSidebar = ({ onClose, data, selectmap }) => {
  const [activeTab, setActiveTab] = useState("Incident");
  const [isAssignedAmbulancesVisible, setIsAssignedAmbulancesVisible] =
    useState(false);
  const [incidentData, setIncidentData] = useState({});
  const [ambulanceData, setAmbulanceData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
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
      <div className={` flex  overflow-hidden b  `}>
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

            <div className="flex-1 overflow-y-auto">{renderFormForTab()}</div>
          </div>
        </div>
      </div>
    </>
  );
};
const Header = ({ handleIncidentNext, getlatitude, getmap }) => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [locationAddress, setLocationAddress] = useState({});
  const [submitDone, setSubmitDone] = useState(false);
  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);

  const CreateAmbulance = useFormik({
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
        type: selectedOption.label,
      };
      console.log(JSON);
      const createAmbulance = async () => {
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

      createAmbulance();
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
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <form onSubmit={CreateAmbulance.handleSubmit}>
        <div className="mb-5 mt-2">
          <div>
            <label
              htmlFor="informer_address"
              className=" text-sm  font-medium leading-6 text-gray-900 text-right"
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
                onChange={CreateAmbulance.handleChange}
                value={CreateAmbulance.values.informer_address}
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
                onChange={CreateAmbulance.handleChange}
                value={CreateAmbulance.values.informer_name}
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
                onChange={CreateAmbulance.handleChange}
                value={CreateAmbulance.values.informer_phone_numbers}
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
          <Listbox value={selectedOption} onChange={setSelectedOption}>
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
                onChange={CreateAmbulance.handleChange}
                value={CreateAmbulance.values.description}
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
    </>
  );
};

export { Header, CreateIncidentSidebar };
