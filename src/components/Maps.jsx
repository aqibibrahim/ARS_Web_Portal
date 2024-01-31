import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import axios from "axios";
import ambulaceMarker from "../assets/ambulance_1353940.png";
import HealthCare from "../assets/HealthCare.png";
import Regions from "../assets/Regions.png";
import { PlusCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAmbulanceContext } from "./AmbulanceContext";
import "../index.css";
import { useLocation } from "react-router-dom";
import { CreateIncidentSidebar } from "./CreateIncidentSidebar";
import Sidebar from "./SIdebar";
const GOOGLE_MAPS_APIKEY = "AIzaSyDZiTIdSoTe6XJ7-kiAadVrOteynKR9_38";

const Maps = (props) => {
  const location = useLocation();
  const incidentId = location?.state?.incidentData;
  const [openSidebar, setOpenSidebar] = useState(false);

  console.log(incidentId, "incidentID");

  const { selectedAmbulanceId, resetState } = useAmbulanceContext();
  console.log("Selected Ambulance ID in Other Component:", selectedAmbulanceId);

  console.log(props);
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [ambulanceData, setAmbulanceData] = useState([]);
  const [selectedAmbulanceData, setSelectedAmbulanceData] = useState([]);

  const [healthCareData, setHealthCareData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [position, setPosition] = useState({
    lat: 33.7519137,
    lng: 72.7970134,
  });
  const [newposition, setNewPosition] = useState({
    lat: "",
    lng: "",
  });
  const [childData, setChildData] = useState("Data from child");
  const sendDataToParent = (e) => {
    props.onData(e);
  };
  useEffect(() => {
    const fetchAmbulanceData = async () => {
      try {
        await axios
          .get(
            `https://ars.disruptwave.com/api/ambulances/${selectedAmbulanceId}`,
            {
              headers: headers,
            }
          )
          .then((response) => {
            setSelectedAmbulanceData(response.data?.data);
            console.log("ambulance", response?.data?.data);
            SelectedAmbulanceView(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchAmbulanceData();
  }, [selectedAmbulanceId]);
  useEffect(() => {
    const fetchAmbulanceData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/ambulances`, {
            headers: headers,
          })
          .then((response) => {
            setAmbulanceData(response.data?.data);
            console.log("ambulance", response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchAmbulanceData();
  }, []);
  useEffect(() => {
    const fetchHealthCareData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/facilities`, {
            headers: headers,
          })
          .then((response) => {
            setHealthCareData(response.data?.data);
            console.log(">>>>>>>>", response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchHealthCareData();
  }, []);
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/regions`, {
            headers: headers,
          })
          .then((response) => {
            setRegionData(response.data?.data);
            console.log(">>>>>>>>", response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchRegionData();
  }, []);
  const handleMarkerDragEnd = (t, map, coord) => {
    const newPosition = {
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    };
    setPosition({
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    });
    console.log(coord.latLng.lat());
    sendDataToParent(newPosition);
  };
  const handleMapClick = (mapProps, map, clickEvent) => {
    const newPosition = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };
    sendDataToParent(newPosition);
    console.log(clickEvent.latLng.lat());
    setPosition(newPosition);
  };
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeMarker, setactiveMarker] = useState(null);
  const [VisibalPopup, setVisibalPopup] = useState(false);
  const handleMarkerClick = (region) => {
    setSelectedRegion(region);
    console.log("><><><", region);
    setVisibalPopup(true);
    setactiveMarker(marker);
  };
  const [state, setState] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });

  const [ambulanceInfo, setAmbulanceInfo] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });

  const [healthCareInfo, setHealthCareInfo] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });

  const [regionInfo, setRegionInfo] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  });
  const SelectedAmbulanceView = (props, marker) => {
    const driverInfo = props?.driver;
    setNewPosition({
      lat: props?.gps_latitude,
      lng: props?.gps_longitude,
    });
    setAmbulanceInfo({
      selectedPlace: {
        id: props?.id,
        equipments: props?.equipments,
        model: props?.model,
        make: props?.make,
        plate_no: props?.plate_no,
        status: props?.status,
        latitude: props?.gps_latitude,
        longitude: props?.gps_longitude,
        driver: driverInfo
          ? {
              name: `${driverInfo?.first_name} 
              `,
              email: driverInfo?.email,
              status: driverInfo?.status,
              phoneNumber: driverInfo?.phone_numbers,
            }
          : null,
        button: "Ambulance",
      },
      activeMarker: marker,
      showingInfoWindow: true,
    });

    // Close other info windows
    setHealthCareInfo({ showingInfoWindow: false });
    setRegionInfo({ showingInfoWindow: false });
  };
  const onAmbulanceMarkerClick = async (props, marker) => {
    try {
      await axios
        .get(`https://ars.disruptwave.com/api/ambulances/${props?.id}`, {
          headers: headers,
        })
        .then((response) => {
          const data = response.data?.data;
          setAmbulanceInfo({
            selectedPlace: {
              id: data?.id,
              equipments: data?.equipments,
              model: data?.model,
              make: data?.make,
              plate_no: data?.plate_no,
              status: data?.status,
              latitude: data?.gps_latitude,
              longitude: data?.gps_longitude,
              driver: data
                ? {
                    name: `${data?.driver?.first_name} `,
                    email: data?.driver?.email,
                    status: data?.driver?.status,
                    phoneNumber: data?.driver?.phone_numbers,
                  }
                : null,
              button: "Ambulance",
            },
            activeMarker: marker,
            showingInfoWindow: true,
          });
          console.log("ambulance", response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    }
    console.log("Props", props);
    const driverInfo = props?.driver;

    // Close other info windows
    setHealthCareInfo({ showingInfoWindow: false });
    setRegionInfo({ showingInfoWindow: false });
  };

  const onHealthCareMarkerClick = async (props, marker) => {
    try {
      await axios
        .get(`https://ars.disruptwave.com/api/facilities/${props?.id}`, {
          headers: headers,
        })
        .then((response) => {
          const data = response?.data?.data;
          setHealthCareInfo({
            selectedPlace: {
              name: data?.name,
              status: data?.status,
              phoneNumbers: data?.phone_numbers || [], // Add phoneNumbers to the selectedPlace
              focalPersons: data?.focal_persons || [],
              departments: data?.departments || [],
              latitude: data?.latitude,
              longitude: data?.longitude,
              button: "HealthCare",
            },
            activeMarker: marker,
            showingInfoWindow: true,
          });
          console.log(">>>>>>>>", response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    }

    // Close other info windows
    setAmbulanceInfo({ showingInfoWindow: false });
    setRegionInfo({ showingInfoWindow: false });
  };

  const onRegionMarkerClick = (props, marker) => {
    setRegionInfo({
      selectedPlace: {
        name: props?.name,
        status: props?.status,
        ambulances: props?.ambulances || [],
        address: props?.address,
        latitude: props?.latitude,
        longitude: props?.longitude,
        phoneNumber: props?.phone_numbers,
        button: "Region",
      },
      activeMarker: marker,
      showingInfoWindow: true,
    });
    // Close other info windows
    setAmbulanceInfo({ showingInfoWindow: false });
    setHealthCareInfo({ showingInfoWindow: false });
  };
  const renderAmbulanceEquipment = (ambulanceId) => {
    console.log("AMbulance id", ambulanceId);
    const ambulance = ambulanceData?.data?.find(
      (ambulance) => ambulance.id === ambulanceId
    );
    if (ambulance && ambulance.equipments && ambulance.equipments.length > 0) {
      return (
        <div>
          <h3 className="text-lg text-gray-900 text-right font-medium mb-2">
            Ambulance Equipment
          </h3>
          <ul className="list-disc pl-6 text-right">
            {ambulance.equipments.map((equipment) => (
              <li key={equipment.id} className="text-base">
                {equipment.name}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const onClose = () => {
    if (state.showingInfoWindow) {
      setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  const getStatusStyle = (status) => {
    let backgroundColor, textColor;

    switch (status) {
      case "Available":
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

    return `${backgroundColor} ${textColor}`;
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Map
        Map
        google={google}
        zoom={10}
        initialCenter={position}
        disableDefaultUI
        center={newposition}
      >
        {ambulanceData.map((c, index) => (
          <Marker
            key={c?.id}
            className={"map"}
            position={{
              lat: Number(c?.gps_latitude),
              lng: Number(c?.gps_longitude),
            }}
            name={c.model}
            icon={{
              url: ambulaceMarker,
              anchor: new google.maps.Point(28, 28),
              scaledSize: new google.maps.Size(20, 40),
            }}
            onClick={() => onAmbulanceMarkerClick(c)}
          />
        ))}
        {healthCareData.map((healthCare, index) => (
          <Marker
            key={healthCare?.id}
            className={"map"}
            position={{
              lat: Number(healthCare?.latitude),
              lng: Number(healthCare?.longitude),
            }}
            name={healthCare?.name}
            icon={{
              url: HealthCare,
              anchor: new google.maps.Point(28, 28),
              scaledSize: new google.maps.Size(26, 26),
            }}
            onClick={() => onHealthCareMarkerClick(healthCare)}
          />
        ))}
        {regionData?.map((region, index) => (
          <Marker
            key={region?.id}
            className={"map"}
            position={{
              lat: Number(region?.latitude),
              lng: Number(region?.longitude),
            }}
            name={region?.name}
            icon={{
              url: Regions,
              anchor: new google.maps.Point(28, 28),
              scaledSize: new google.maps.Size(32, 32),
            }}
            onClick={() => onRegionMarkerClick(region)}
          />
        ))}

        <InfoWindow
          marker={ambulanceInfo.activeMarker}
          visible={ambulanceInfo.showingInfoWindow}
          position={{
            lat: Number(ambulanceInfo?.selectedPlace?.latitude),
            lng: Number(ambulanceInfo?.selectedPlace?.longitude),
          }}
          onClose={() => {
            setAmbulanceInfo({ showingInfoWindow: false });
            resetState();
          }}
        >
          <div
            className="m-auto overflow-hidden w-72 max-h-fit"
            style={{ fontFamily: "Inter, sans-serif", overflow: "hidden" }}
          >
            <div className="mb-5 mt-5 text-right  pr-4">
              <span
                className={`text-sm ${getStatusStyle(
                  ambulanceInfo?.selectedPlace?.status
                )} p-1 rounded-xl text-white`}
              >
                {ambulanceInfo?.selectedPlace?.status}
              </span>
              <span className="text-lg font-bold mb-2 font-Inter ml-2">
                {ambulanceInfo?.selectedPlace?.model?.name +
                  " " +
                  ambulanceInfo?.selectedPlace?.model?.make?.name}{" "}
              </span>
              <p className="text-md font-bold mb-2 font-Inter ml-2">
                {ambulanceInfo?.selectedPlace?.plate_no}{" "}
              </p>{" "}
            </div>
            <div className=" bg-white  overflow-hidden pt-1 pb-6">
              <p className="text-base font-semibold mb-1 text-gray-900    text-right pr-4">
                Equipments
              </p>
              <div className="justify-end flex-wrap flex bg-white pr-4">
                {ambulanceInfo?.selectedPlace?.equipments?.length > 0 ? (
                  ambulanceInfo?.selectedPlace?.equipments?.map((equipment) => (
                    <p key={equipment.id} className="text-base text-right">
                      <p className="text-sm text-right inline-block font-semibold text-white bg-blue-400 px-2 m-1 rounded-xl">
                        {equipment.name}
                      </p>
                    </p>
                  ))
                ) : (
                  <p className="text-md text-right pr-4">No Data Found</p>
                )}
              </div>
              {renderAmbulanceEquipment(ambulanceInfo?.selectedPlace?.id)}
              <p className="text-base font-semibold mb-1 text-gray-900   text-right pr-4">
                Driver Information
              </p>

              {ambulanceInfo?.selectedPlace?.driver?.status !== undefined &&
              ambulanceInfo?.selectedPlace?.driver !== null ? (
                <div className="mb-2 text-right  gap-y-2 px-1.5">
                  <span className=" text-sm bg-green-500 px-2 rounded-xl mr-1 text-white pr-4">
                    {ambulanceInfo?.selectedPlace?.driver?.status}
                  </span>
                  <span className="text-sm text-gray-500  text-right font-semibold pr-4">
                    {ambulanceInfo?.selectedPlace?.driver?.name}
                  </span>

                  {ambulanceInfo?.selectedPlace?.driver?.phoneNumber?.map(
                    (phoneNumber) => (
                      <p className="text-sm text-gray-500  text-right font-semibold pr-4">
                        +{phoneNumber?.number}
                      </p>
                    )
                  )}
                  <p className="text-sm text-gray-500  text-right font-semibold pr-4">
                    {ambulanceInfo?.selectedPlace?.driver?.email}
                  </p>
                </div>
              ) : (
                <div className="text-base text-right pr-4">
                  No Driver Assigned yet
                </div>
              )}
            </div>
          </div>
        </InfoWindow>

        <InfoWindow
          marker={healthCareInfo.activeMarker}
          visible={healthCareInfo.showingInfoWindow}
          position={{
            lat: Number(healthCareInfo?.selectedPlace?.latitude),
            lng: Number(healthCareInfo?.selectedPlace?.longitude),
          }}
          onClose={() => setHealthCareInfo({ showingInfoWindow: false })}
        >
          <div
            className="m-auto     overflow-hidden w-72 "
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div className="backdrop-blur-lg  ">
              {" "}
              <div className="mb-5 mt-5 text-right  pr-4">
                <span className="mr-2 text-md bg-green-500 p-1 rounded-xl text-white">
                  {healthCareInfo?.selectedPlace?.status}
                </span>
                <span className="text-lg font-bold mb-2 font-Inter">
                  {healthCareInfo?.selectedPlace?.name}
                </span>
              </div>
              <div className=" bg-white  overflow-hidden pt-1 pb-6">
                <div className="mb-2 flex gap-y-2 flex-col text-right">
                  {/* <p className="text-lg text-gray-900 text-left font-medium">
                {healthCareInfo?.selectedPlace?.status}
              </p> */}
                  <div>
                    {healthCareInfo?.selectedPlace?.phoneNumbers?.length > 0 ? (
                      <div>
                        <p className="text-base font-semibold mb-1 text-gray-900   text-right  pr-4">
                          Phone Number<i className="bi bi-shield-check"></i>
                        </p>
                        {healthCareInfo?.selectedPlace?.phoneNumbers.map(
                          (phoneNumber) => (
                            <p
                              key={phoneNumber.id}
                              className="text-sm text-gray-500  text-right font-semibold  pr-4 "
                            >
                              +{phoneNumber.number}
                            </p>
                          )
                        )}
                      </div>
                    ) : (
                      <p>NO Data Found</p>
                    )}
                  </div>
                </div>
                <p className="text-base font-semibold mb-1 text-gray-900   text-right  pr-4">
                  {healthCareInfo?.selectedPlace?.departments?.length}{" "}
                  {healthCareInfo?.selectedPlace?.departments?.length === 1
                    ? "Department "
                    : "Departments "}
                  Available
                  <i className="bi bi-shield-check"></i>
                </p>
                <div className="justify-end flex-wrap flex  pr-4">
                  {healthCareInfo?.selectedPlace?.departments?.length > 0 ? (
                    healthCareInfo?.selectedPlace?.departments?.map(
                      (departments) => (
                        <p key={departments.id}>
                          <p className="text-sm text-right inline-block font-semibold text-white bg-blue-400 px-2 m-1 rounded-xl">
                            {departments.name}
                          </p>
                        </p>
                      )
                    )
                  ) : (
                    <p className="text-md text-left">No Data Found</p>
                  )}
                </div>
                <p className="text-base font-semibold mb-1 text-gray-900   pr-4  text-right">
                  Focal Persons <i className="bi bi-shield-check"></i>
                </p>
                <div>
                  {healthCareInfo?.selectedPlace?.focalPersons?.length > 0 ? (
                    healthCareInfo?.selectedPlace?.focalPersons?.map(
                      (focalPerson) => (
                        <p
                          key={focalPerson.id}
                          className="text-sm text-gray-500  text-right font-semibold  pr-4 "
                        >
                          {focalPerson.first_name} {focalPerson.last_name}
                        </p>
                      )
                    )
                  ) : (
                    <p>No Data Found</p>
                  )}
                </div>
              </div>{" "}
            </div>
          </div>
          {/* </div> */}
        </InfoWindow>

        <InfoWindow
          marker={regionInfo.activeMarker}
          visible={regionInfo.showingInfoWindow}
          position={{
            lat: Number(regionInfo?.selectedPlace?.latitude),
            lng: Number(regionInfo?.selectedPlace?.longitude),
          }}
          onClose={() => setRegionInfo({ showingInfoWindow: false })}
        >
          <div
            className="m-auto   overflow-auto w-72 "
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div className="mb-5 mt-5 text-right  pr-4">
              <span className="mr-2 text-md bg-green-500 p-1 rounded-xl text-white">
                {regionInfo?.selectedPlace?.status}
              </span>
              <span className="text-lg text-right font-bold mb-2">
                {regionInfo?.selectedPlace?.name}
              </span>
            </div>
            <div className=" bg-white  overflow-hidden pt-1 pb-6">
              <div className="mt-2">
                {" "}
                <p className="text-base font-semibold mb-1 text-gray-900 pr-4  text-right">
                  Phone Number<i className="bi bi-shield-check"></i>
                </p>
                {regionInfo?.selectedPlace?.phoneNumber?.map((phoneNumber) => (
                  <p
                    key={phoneNumber.id}
                    className="text-sm text-gray-500  text-right font-semibold pr-4 "
                  >
                    +{phoneNumber.number}
                  </p>
                ))}
              </div>
              <p className="text-base font-semibold mb-1 text-gray-900 pr-4  text-right">
                Address<i className="bi bi-shield-check"></i>
              </p>
              <p className="text-sm text-gray-500  text-right font-semibold pr-4 flex-wrap flex pl-2">
                {regionInfo?.selectedPlace?.address}
              </p>
              {/* <div className="mb-2 flex gap-y-2 flex-col">
              <p className="text-lg text-gray-900 text-right font-medium">
                {" "}
                {regionInfo?.selectedPlace?.status}
              </p>
            </div> */}
              <p className="text-base font-semibold mb-1 text-gray-900 pr-4  text-right ">
                No. of Ambulances: <i className="bi bi-shield-check"></i>
              </p>
              <p className="text-right pr-4">
                {regionInfo?.selectedPlace?.ambulances?.length}
              </p>

              <p className="text-base font-semibold mb-1 text-gray-900 pr-4  text-right">
                Ambulance Details<i className="bi bi-shield-check"></i>
              </p>
              <p className="text-base text-right">
                {regionInfo?.selectedPlace?.ambulances?.map((ambulance) => (
                  <p key={ambulance.id} className="text-right mb-4 pr-4">
                    <span
                      className={`mr-2 text-md 
                      ${getStatusStyle(
                        ambulance.status
                      )} p-1 rounded-xl text-white`}
                    >
                      {ambulance?.status}
                    </span>
                    {ambulance?.make +
                      " " +
                      ambulance?.model +
                      " " +
                      ambulance?.plate_no}
                  </p>
                ))}
              </p>
            </div>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_APIKEY,
})(Maps);
