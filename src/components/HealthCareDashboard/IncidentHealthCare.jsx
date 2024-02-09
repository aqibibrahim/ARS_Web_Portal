import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Listbox } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
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
        selected
          ? "bg-blue-500 text-white"
          : "bg-white text-black hover:bg-gray-200"
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
          .get(`https://ars.disruptwave.com/api/view-healthcare-incidents`, {
            headers: headers,
          })
          .then((response) => {
            setIncidentData(response.data?.data);
            setIsLoading(false);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchincidentData();
  }, [submitDone]);

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
    lat: 26.9894429391302,
    lng: 17.761961078429668,
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
      componentRestrictions: { country: "lby" }, // Set the country to Pakistan
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
  const getStatusStyle = (status) => {
    let backgroundColor, textColor;

    switch (status) {
      case "Active":
        backgroundColor = "bg-green-400";
        textColor = "text-white";
        break;
      case "Dispatched":
        backgroundColor = "bg-blue-400";
        textColor = "text-white";
        break;
      case "Inactive":
        backgroundColor = "bg-red-400";
        textColor = "text-white";
        break;

      default:
        backgroundColor = "bg-yellow-400";
        textColor = "text-white";
        break;
    }

    return ` ${backgroundColor} ${textColor} rounded-xl p-1`;
  };
  return (
    <div
      className={` bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
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
                selected={activeTab === "completed"}
                title="الحوادث المكتملة"
                onClick={() => setActiveTab("completed")}
                className={`${
                  activeTab === "completed"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              />{" "}
              <Tab
                selected={activeTab === "active"}
                title="الحوادث النشطة"
                onClick={() => setActiveTab("active")}
                className={`${
                  activeTab === "active"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
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

        {activeTab === "active" && (
          <div className="rtl">
            {isLoading ? (
              <p className="text-center text-xl text-primary-100">Loading...</p>
            ) : incidentData?.active?.length == 0 ? (
              <p className="text-center text-xl text-primary-100">
                No data available
              </p>
            ) : (
              incidentData.map(
                (incident) =>
                  incident.status === "Active" && (
                    <div className="w-full  justify-end items-center gap-2.5 inline-flex mt-5">
                      <div className="w-full bg-white bg-opacity-50 rounded-2xl shadow backdrop-blur-[20px] justify-end items-center flex">
                        <div className="grow shrink basis-0 self-stretch p-[15px] bg-white bg-opacity-50 justify-end items-center gap-[15px] flex">
                          <div className="grow shrink basis-0 h-[35px] justify-start items-end gap-3.5 flex">
                            <div className=" rounded-lg justify-center items-center gap-2.5 flex">
                              {/* <button
                                className={`text-white text-xs font-semibold font-inter`}
                              >
                                {incident?.ambulances?.map(
                                  (ambulance, index) => (
                                    <span
                                      className={`py-2.5 px-[15px]  ${getStatusStyle(
                                        ambulance?.status
                                      )}`}
                                      key={index}
                                    >
                                      {ambulance?.status}
                                    </span>
                                  )
                                )}
                              </button> */}
                            </div>
                          </div>
                          <div className="grow shrink basis-0 flex-col justify-center items-end gap-[3px] inline-flex">
                            <div className="self-stretch flex-col justify-start items-end gap-[5px] flex">
                              <div className="self-stretch text-right text-black text-opacity-75 text-base font-semibold font-['Inter'] rtl">
                                اسم السائق{" "}
                                {/* {incident?.ambulances?.map(
                                  (ambulance, index) => (
                                    <span key={index}>
                                      {ambulance?.driver?.first_name}
                                    </span>
                                  )
                                )} */}
                              </div>
                              <div className="self-stretch text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                                {incident?.ambulances?.map(
                                  (ambulance, index) => (
                                    <>
                                      {" "}
                                      <p key={index} className="m-1">
                                        {ambulance?.driver?.first_name}{" "}
                                        <span
                                          className={`grow shrink basis-0 ml-2 text-right  ${getStatusStyle(
                                            ambulance?.driver?.status
                                          )} text-xs font-normal font-['Inter']`}
                                        >
                                          {" "}
                                          {ambulance?.driver?.status}
                                        </span>
                                      </p>
                                      <div className="self-stretch justify-end items-center gap-[5px] inline-flex">
                                        <div></div>
                                        <span
                                          className={`grow shrink basis-0 ml-2 text-right  ${getStatusStyle(
                                            ambulance?.status
                                          )} text-xs font-normal font-['Inter']`}
                                        >
                                          {" "}
                                          {ambulance?.status}
                                        </span>{" "}
                                        <p
                                          key={index}
                                          className="flex flex-nowrap w-40 text-right "
                                        >
                                          {ambulance?.model?.make?.name}-{" "}
                                          {ambulance?.model?.name} -{" "}
                                          {ambulance?.plate_no}
                                        </p>
                                      </div>
                                    </>
                                  )
                                )}
                              </div>

                              <div className="  items-center ">
                                {/* <div className="grow shrink basis-0 text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                                  {incident?.ambulances?.map(
                                    (ambulance, index) => (
                                      <>
                                        {" "}
                                        <span key={index}>
                                          {ambulance?.model?.make?.name}-{" "}
                                          {ambulance?.model?.name} -{" "}
                                          {ambulance?.plate_no}
                                        </span>
                                        <span>
                                          {" "}
                                          {ambulance?.driver?.status}
                                        </span>
                                      </>
                                    )
                                  )}
                                </div> */}
                                <div className="w-6 h-6 px-0.5 pt-[5px] pb-1 justify-center items-center flex">
                                  <div className="w-5 h-[15px] relative flex-col justify-start items-start flex" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grow shrink basis-0 self-stretch p-[15px] justify-end items-center gap-2.5 flex">
                          <div className="grow shrink basis-0 flex-col justify-start items-end gap-[5px] inline-flex">
                            <div className="self-stretch justify-end items-center gap-[5px] inline-flex">
                              <div className="grow shrink basis-0 text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                                {incident?.latitude}- {incident?.longitude}
                              </div>
                              <div className="w-6 h-6 px-1 py-[2.50px] justify-center items-center flex">
                                <div className="w-4 h-[19px] relative">
                                  <MapPinIcon />
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch text-right text-black text-opacity-75 text-base font-semibold font-['Inter']">
                            التفاصيل  {" "}
                            </div>
                            <div className="w-[316px] h-[42px] text-right text-black text-opacity-50 text-xs font-normal font-['Inter']">
                              {incident?.description}{" "}
                            </div>
                          </div>
                        </div>
                        <div className="w-[292px] self-stretch p-[15px] justify-end items-center gap-2.5 flex">
                          <div className="grow shrink basis-0 flex-col justify-start items-end gap-[5px] inline-flex">
                            <div className="self-stretch text-right text-black text-opacity-75 text-base font-semibold font-['Inter']">
                              اسم المريض - {incident?.informer?.name}
                            </div>
                            <div className="justify-end items-start gap-[5px] inline-flex">
                              <div className="px-1.5 py-[3px] bg-blue-500 bg-opacity-50 rounded-[20px] justify-center items-center gap-[5px] flex">
                                <div className="text-right text-white text-opacity-90 text-xs font-normal font-['Inter']">
                                  {incident?.incident_type?.name}
                                </div>
                              </div>
                              <div className="px-1.5 py-[3px] bg-fuchsia-500 bg-opacity-75 rounded-[20px] justify-center items-center gap-[5px] flex">
                                <div className="text-right text-white text-opacity-90 text-xs font-normal font-['Inter']">
                                  {incident?.gender?.name}
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                              {incident?.informer?.phone_numbers?.map(
                                (phoneNumber, index) => (
                                  <p key={index}>{phoneNumber?.number}</p>
                                )
                              )}
                            </div>
                            <div className="h-5 px-[15px] py-2.5 bg-red-600 rounded-lg justify-center items-center gap-2.5 inline-flex">
                              <div className="text-white text-xs font-semibold font-['Inter']">
                                {incident?.emergency_type?.name}{" "}
                              </div>
                            </div>
                            <div className="text-black text-xs font-semibold font-inter">
                              {
                                <span>
                                  {new Date(incident.created_at).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                      timeZoneName: "short",
                                    }
                                  )}
                                </span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )
            )}
          </div>
        )}
        {activeTab === "completed" && (
          <div className="rtl">
            {isLoading ? (
              <p className="text-center text-xl text-primary-100">Loading...</p>
            ) : incidentData.length == 0 ? (
              <p className="text-center text-xl text-primary-100">
                No data available
              </p>
            ) : (
              incidentData.map((incident) =>
                incident?.status === "Complete" ? (
                  <div className="w-full  justify-end items-center gap-2.5 inline-flex mt-5">
                    <div className="w-full bg-white bg-opacity-50 rounded-2xl shadow backdrop-blur-[20px] justify-end items-center flex">
                      <div className="grow shrink basis-0 self-stretch p-[15px] bg-white bg-opacity-50 justify-end items-center gap-[15px] flex">
                        <div className="grow shrink basis-0 h-[35px] justify-start items-end gap-3.5 flex">
                          <div className=" rounded-lg justify-center items-center gap-2.5 flex">
                            <button
                              className={`text-white bg-green-400 rounded-lg text-xs font-semibold font-inter py-2.5 px-[15px] `}
                            >
                              {/* {incident?.ambulances?.map((ambulance, index) => ( */}
                              {/* <span
                              className={`py-2.5 px-[15px]  ${getStatusStyle(
                                ambulance?.driver.first_name
                              )}`}
                                key={index}
                              > */}
                              {incident?.status}
                              {/* </span> */}
                              {/* ))} */}
                            </button>
                          </div>
                        </div>
                        <div className="grow shrink basis-0 flex-col justify-center items-end gap-[3px] inline-flex">
                          <div className="self-stretch h-[88px] flex-col justify-start items-end gap-[5px] flex">
                            <div className="self-stretch text-right text-black text-opacity-75 text-base font-semibold font-['Inter'] rtl">
                              Ambulance Details
                            </div>
                            <div className="self-stretch text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                              {/* {incident?.ambulances?.map((ambulance, index) => ( */}
                              <>
                                {/* <span key={index}> */}
                                {incident?.ambulance?.model?.make?.name +
                                  " " +
                                  incident?.ambulance?.model?.name +
                                  " " +
                                  incident?.ambulance?.plate_no}
                                <p>{incident?.ambulance?.driver?.first_name}</p>
                                {/* </span> */}
                                <div className="self-stretch justify-end items-center gap-[5px] inline-flex">
                                  {/* <div
                                      className={`grow shrink basis-0 ml-2 text-right  ${getStatusStyle(
                                        ambulance?.driver?.status
                                      )} text-xs font-normal font-['Inter']`}
                                    >
                                      {ambulance?.driver?.status}
                                    </div> */}
                                </div>
                              </>
                              {/* ))} */}
                            </div>

                            {/* <div className="  items-center ">
                              <div className="grow shrink basis-0 text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                                {incident?.ambulances?.map(
                                  (ambulance, index) => (
                                    <span key={index}>
                                {ambulance?.make}- {ambulance?.model} -{" "}
                                {ambulance?.plate_no}
                                </span>
                                  )
                                )}
                              </div>
                              <div className="w-6 h-6 px-0.5 pt-[5px] pb-1 justify-center items-center flex">
                                <div className="w-5 h-[15px] relative flex-col justify-start items-start flex" />
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="grow shrink basis-0 self-stretch p-[15px] justify-end items-center gap-2.5 flex">
                        <div className="grow shrink basis-0 flex-col justify-start items-end gap-[5px] inline-flex">
                          <div className="self-stretch justify-end items-center gap-[5px]">
                            <div className="grow shrink basis-0 text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                              {incident?.latitude}- {incident?.longitude} -{" "}
                              {incident?.ambulance?.facility?.address}
                            </div>{" "}
                            <div className="grow shrink basis-0 text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                              {incident?.ambulance?.facility?.name}
                            </div>
                          </div>
                          <div className="self-stretch text-right text-black text-opacity-75 text-base font-semibold font-['Inter']">
                            Description{" "}
                          </div>
                          <div className="w-[316px] h-[42px] text-right text-black text-opacity-50 text-xs font-normal font-['Inter']">
                            {incident?.description}{" "}
                          </div>
                        </div>
                      </div>{" "}
                      <div className="w-6 h-6 justify-center items-center flex">
                        <div className="w-4 h-[19px] mb-14 relative">
                          <MapPinIcon />
                        </div>
                      </div>
                      <div className="w-[292px] self-stretch p-[15px] justify-end items-center gap-2.5 flex">
                        <div className="grow shrink basis-0 flex-col justify-start items-end gap-[5px] inline-flex">
                          <div className="self-stretch text-right text-black text-opacity-75 text-base font-semibold font-['Inter']">
                            اسم المريض - {incident?.informer?.name}
                          </div>
                          <div className="justify-end items-start gap-[5px] inline-flex">
                            <div className="px-1.5 py-[3px] bg-blue-500 bg-opacity-50 rounded-[20px] justify-center items-center gap-[5px] flex">
                              <div className="text-right text-white text-opacity-90 text-xs font-normal font-['Inter']">
                                {incident?.incident_type?.name}
                              </div>
                            </div>
                            <div className="px-1.5 py-[3px] bg-fuchsia-400 bg-opacity-75 rounded-[20px] justify-center items-center gap-[5px] flex">
                              <div className="text-right text-white  text-xs font-normal font-['Inter']">
                                {incident?.gender?.name}
                              </div>
                            </div>
                          </div>
                          <div className="self-stretch text-right text-black text-opacity-90 text-xs font-normal font-['Inter']">
                            {incident?.informer?.phone_numbers?.map(
                              (phoneNumber, index) => (
                                <p key={index}>{phoneNumber?.number}</p>
                              )
                            )}
                          </div>
                          <div
                            className="h-5 px-[15px] py-2.5 rounded-lg justify-center items-center gap-2.5 inline-flex"
                            style={{
                              backgroundColor:
                                incident?.emergency_type?.name === "Critical"
                                  ? "red"
                                  : incident?.emergency_type?.name ===
                                    "Moderate"
                                  ? "yellow"
                                  : incident?.emergency_type?.name === "Mild"
                                  ? "green"
                                  : "black",
                            }}
                          >
                            <div
                              className={`text-white text-xs font-semibold font-['Inter']`}
                            >
                              {incident?.emergency_type?.name}
                            </div>
                          </div>
                          <div className="text-black text-xs font-semibold font-inter">
                            {incident?.created_by?.created_at && (
                              <span>
                                {new Date(incident.updated_at).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                    timeZoneName: "short",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )
            )}
          </div>
        )}
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
                          handleAssignAmbulanceAndhealthCare(
                            "information update"
                          )
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
                          handleAssignAmbulanceAndhealthCare(
                            "Assign HealthCare"
                          )
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
    </div>
  );
}
