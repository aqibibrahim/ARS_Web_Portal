import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Tooltip as ReactTooltip } from "react-tooltip";

import {
  BsArrowRightCircle,
  BsEye,
  BsSearch,
  BsPlusCircle,
} from "react-icons/bs";
import { useFormik } from "formik";
import { json, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import Select from "react-tailwindcss-select";
import InputMask from "react-input-mask";
import { Pagination } from "antd";

const HealthCareFiles = () => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ambulanceData, setAmbulanceData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [locationAddress, setLocationAddress] = useState({});
  const [updateFocalPerson, setupdateFocalPerson] = useState(null);
  const [updateFocalOpetion, setUpdateFocalOpetion] = useState([]);
  const [open, setOpen] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState();
  const [submitDone, setSubmitDone] = useState(false);
  const [myData, setMyData] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsFocalPerson, setOptionsFocalPerson] = useState(null);
  const [cardFocalPersons, setCardFocalPersons] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedHealthCare, setSelectedHealthCare] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateDepartment, setIsUpdateDepartment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const itemsPerPage = 10; // You can adjust this based on your preference
  const [totalDepartments, setTotalDepartments] = useState(0);
  const navigate = useNavigate();
  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };
  const handleOnChange = (value) => {
    setupdateFocalPerson(value);
    console.log("value:", value);
  };
  const handleChangeFocalPerson = (value) => {
    setOptionsFocalPerson(value);
    console.log(">>", optionsFocalPerson);
    setCardFocalPersons(
      value?.map((item2) => {
        const user = allUsers.find((item1) => item1.id === item2.value);
        if (user) {
          return {
            ...item2,
            user,
          };
        } else {
          return item2;
        }
      })
    );
    console.log(">>Card", cardFocalPersons);
  };

  const handleCreateHealtCareClick = () => {
    setLongitude(null);
    setLatitude(null);
    setLocationAddress({
      latitude: "",
      longitude: "",
      address: "",
    });
    setOptions(null);
    setIsModalOpen(true);
    setCardFocalPersons([]);
    setOptionsFocalPerson(null);
  };

  const handleEditClick = (ambulance) => {
    setLongitude(ambulance?.latitude);
    setLatitude(ambulance?.longitude);
    setPosition({
      lat: ambulance?.latitude,
      lng: ambulance?.longitude,
    });
    if (ambulance?.focal_persons.length === 0) {
      setupdateFocalPerson(null);
    } else {
      setupdateFocalPerson(
        ambulance?.focal_persons?.map((item) => ({
          label: item.first_name,
          value: item.id,
        }))
      );
    }
    if (ambulance?.departments.length == 0) {
      setOptions([]);
    } else {
      setOptions(
        ambulance?.departments?.map((variant) => ({
          label: variant.name,
          value: variant.id,
        }))
      );
    }
    setSelectedAmbulance(ambulance);
    setLocationAddress({
      latitude: ambulance?.latitude,
      longitude: ambulance?.longitude,
      address: ambulance?.address,
    });
    setUpdateFormOpen(true);
  };
  useEffect(() => {
    debugger;
    const fetchFacilitiesData = async (page = currentPage) => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/facilities`, {
            headers: headers,
            params: {
              page,
              per_page: itemsPerPage,
            },
          })
          .then((response) => {
            setAmbulanceData(response?.data?.data);
            setIsLoading(false);
            console.log(response?.data?.data, "asds");
          });
      } catch (e) {
        if (e?.response?.data?.message === "Internal Server Error") {
          setIsLoading(false);
          setAmbulanceData([]);
        }
        console.log(e);
      }
    };
    fetchFacilitiesData();
  }, [submitDone, currentPage]);

  useEffect(() => {
    const fetchusersData = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/users`, {
            headers: headers,
          })
          .then((response) => {
            setAllUsers(response.data.data);
            setUpdateFocalOpetion(
              response.data?.data?.map((variant) => ({
                label: variant.first_name,
                value: variant.id,
              }))
            );
            console.log("Usersss", response.data.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchusersData();
  }, []);
  const handleModalClose = () => {
    setIsUpdateDepartment(false);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/departments`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label: variant.name,
                value: variant.id,
              }))
            );
            // setDepartments(response.data.data);
            // setLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        toast.error("An error occurred while fetching departments");
        console.log(e);
      }
    };
    fetchDepartments();
  }, []);
  const CreateHealtCare = useFormik({
    initialValues: {
      focal_persons: "",
      departments: "",
      name: "",
      email: "",
      phone_numbers: "",
      latitude: "",
      longitude: "",
      address: "",
    },
    onSubmit: (values) => {
      const JSON = {
        focal_persons: optionsFocalPerson?.map((item) => item.value),
        users: optionsFocalPerson?.map((item) => item.value),

        departments: options?.map((item) => item.value),
        name: values.name,
        email: values.email,
        phone_numbers: [values.phone_numbers],
        address: locationAddress?.address,
        latitude: locationAddress.latitude,
        longitude: locationAddress.longitude,
      };
      const uploadHealthCare = async () => {
        setLoadingMessage(true);
        console.log(JSON);
        try {
          await axios
            .post(`${window.$BackEndUrl}/facilities`, JSON, config)
            .then((res) => {
              console.log(res);
              toast.success("Healthcare Created Successfuly");
              CreateHealtCare.resetForm();
              setCardFocalPersons([]);
              setLoadingMessage(false);
              setOptions(null);
              setLocationAddress({ latitude: "", longitude: "", address: "" });
              setOptionsFocalPerson(null);
              setSubmitDone(!submitDone);
              setIsModalOpen(false);
            });
        } catch (e) {
          toast.error("failed");
          console.log(e);
          setLoadingMessage(false);
        }
      };

      uploadHealthCare();
    },

    enableReinitialize: true,
  });
  const UpdateHealtCare = useFormik({
    initialValues: {
      departments: "",
      name: selectedAmbulance?.name,
      email: selectedAmbulance?.email,
      phone_numbers: selectedAmbulance?.phone_numbers[0]?.number,
      latitude: selectedAmbulance?.latitude,
      longitude: selectedAmbulance?.longitude,
      address: "",
    },
    onSubmit: (values) => {
      const JSON = {
        focal_persons: updateFocalPerson?.map((item) => item.value),
        users: updateFocalPerson?.map((item) => item.value),
        departments: options?.map((item) => item.value),
        name: values.name,
        email: values.email,
        phone_numbers: [values.phone_numbers],
        latitude: selectedAmbulance?.latitude,
        longitude: selectedAmbulance?.longitude,
        address: locationAddress?.address,
      };
      const updateHealtCare = async () => {
        setLoadingMessage(true);
        console.log(JSON);
        try {
          const res = await axios.patch(
            `${window.$BackEndUrl}/facilities/${selectedAmbulance?.id}`,
            JSON,
            config
          );

          if (res.status === 200 || res.status === 201) {
            console.log(res);
            toast.success("Updated Successfully");
            setLoadingMessage(false);
            setSubmitDone(!submitDone);
            setIsModalOpen(false);
            setUpdateFormOpen(false);
          } else {
            console.error(`Unexpected response status: ${res.status}`);
            // Handle unexpected response status here
            toast.error("Update failed");
            setLoadingMessage(false);
          }
        } catch (e) {
          console.error(e);
          toast.error("Update failed");
          setLoadingMessage(false);
        }
      };

      updateHealtCare();
    },

    enableReinitialize: true,
  });
  const { ControlPosition, Geocoder } = google.maps;
  const [position, setPosition] = useState({
    lat: 33.7519137,
    lng: 72.7970134,
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
  const CreateDepartments = useFormik({
    initialValues: {
      incident_types: "",
      total_beds: "",
      occupied_beds_men: "",
      occupied_beds_women: "",
      unoccupied_beds_men: "",
      unoccupied_beds_women: "",
      department_id: "",
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        department_id: parseInt(selectedDepartment),
        total_beds: values.total_beds,
        occupied_beds_men: values.occupied_beds_men,
        occupied_beds_women: values.occupied_beds_women,
        unoccupied_beds_men: values.unoccupied_beds_men,
        unoccupied_beds_women: values.unoccupied_beds_women,
        facility_id: selectedHealthCare,
      };
      const createequipment = async () => {
        console.log(JSON);

        try {
          await axios
            .post(`${window.$BackEndUrl}/facility-department/add`, JSON, config)
            .then((res) => {
              console.log(res);
              toast.success("Department added successfully!");
              setIsModalOpen(false);
              setLoadingMessage(false);
              setSubmitDone(!submitDone);
              setIsUpdateDepartment(false);
            });
        } catch (e) {
          setLoadingMessage(false);
          toast.error(`${e?.response?.data?.data?.name[0]}`);
          console.log(e);
        }
      };

      createequipment();
    },

    enableReinitialize: true,
  });
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
      componentRestrictions: { country: null }, // Set the country to Pakistan
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
          `${window.$BackEndUrl}/facilities/${isDeleteID}`,
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
  const handleViewClick = (healthcare) => {
    console.log("Ambulance Details", healthcare);
    setSelectedHealthCare(healthcare);
    setViewOpen(true);
  };
  const handleUpdateDepartment = (healthcare) => {
    setSelectedHealthCare(healthcare?.id);
    setIsUpdateDepartment(true);
  };
  return (
    <div
      className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
    >
      <Toaster position="bottom-right" richColors />
      <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
        <div className="p-4 text-right  bg-gray-100 ">
          <h1 className="text-xl font-semibold">Health Cares</h1>
        </div>
        <div className="flex flex-row items-center p-4 space-x-4 bg-gray-100  ">
          <div className="flex flex-row space-x-2"></div>
          <div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 ">
            <BsSearch width={9} height={9} />
            <input
              className="bg-transparent focus:border-none border-0 w-full text-right placeholder:text-sm"
              type="text"
              placeholder="Search Ambulances..."
            />
          </div>
          {/* <button
              className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
              type="button"
              onClick={() => navigate("/departments")}
            >
              Department
            </button> */}
          <button
            className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
            type="button"
            onClick={handleCreateHealtCareClick}
          >
            + Create Healthcare
          </button>
        </div>

        <div className="rtl">
          {isLoading ? (
            <p className="text-center text-xl text-primary-100">Loading...</p>
          ) : ambulanceData?.data?.length == 0 ? (
            <p className="text-center text-xl text-primary-100">
              No data available
            </p>
          ) : (
            <>
              {" "}
              <table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1">
                <thead>
                  <tr>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-xs font-medium  tracking-wide text-gray-500 sm:pl-0"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                    >
                      Facility Email Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                    >
                      Facilty Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ambulanceData?.data?.map((healthcare) => (
                    <tr key={healthcare.id} className="hover:bg-gray-100">
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <span className="flex items-center justify-center gap-3">
                          <button
                            data-tooltip-id="my-tooltip-1"
                            className="text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                            onClick={() => {
                              setDelete(true);
                              setDeleteID(healthcare?.id);
                            }}
                            data-tip
                            data-for={`deleteTooltip${healthcare.id}`}
                          >
                            <BiMessageAltX />
                          </button>

                          <button
                            data-tooltip-id="my-tooltip-2"
                            onClick={() => handleEditClick(healthcare)}
                            className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            data-tip
                            data-for={`editTooltip${healthcare.id}`}
                          >
                            <BiEdit />
                            <span className="sr-only">{healthcare?.name}</span>
                          </button>

                          <button
                            data-tooltip-id="my-tooltip-3"
                            onClick={() => handleViewClick(healthcare)}
                            className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            data-tip
                            data-for={`viewTooltip${healthcare.id}`}
                          >
                            <BsEye />{" "}
                            <span className="sr-only"> {healthcare?.name}</span>
                          </button>

                          <button
                            data-tooltip-id="my-tooltip-4"
                            onClick={() => handleUpdateDepartment(healthcare)}
                            className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            data-tip
                            data-for={`updateDepartmentTooltip${healthcare.id}`}
                          >
                            <BsPlusCircle />
                            <span className="sr-only"> {healthcare?.name}</span>
                          </button>
                        </span>
                      </td>{" "}
                      <ReactTooltip
                        id="my-tooltip-1"
                        place="bottom"
                        variant="info"
                        content="Delete"
                      />{" "}
                      <ReactTooltip
                        id="my-tooltip-2"
                        place="bottom"
                        variant="info"
                        content="Edit"
                      />{" "}
                      <ReactTooltip
                        id="my-tooltip-3"
                        place="bottom"
                        variant="info"
                        content="View"
                      />{" "}
                      <ReactTooltip
                        id="my-tooltip-4"
                        place="bottom"
                        variant="info"
                        content="Add Department"
                      />
                      <td className="px-3 py-4 text-xs">
                        {healthcare?.address}
                      </td>
                      <td className="px-3 py-4 text-xs">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          {healthcare?.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-xs">{healthcare?.email}</td>
                      <td className="px-3 py-4 text-xs">
                        {healthcare?.phone_numbers?.map((phone) => (
                          <div key={phone.id}>{phone.number}</div>
                        ))}
                      </td>
                      <td className="px-3 py-4 text-xs">{healthcare?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-5 ">
                <Pagination
                  className="flex text-sm text-semi-bold mb-2"
                  current={currentPage}
                  total={ambulanceData?.total || 0}
                  pageSize={itemsPerPage}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
      {isUpdateDepartment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-0 mx-auto p-5 border w-[650px] shadow-lg rounded-md bg-white">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={handleModalClose}
              />
              <h3 className="text-xl font-semibold">Assign Department</h3>
            </div>
            <form onSubmit={CreateDepartments.handleSubmit}>
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="occupied_beds_women"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Occupied Beds Women
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="occupied_beds_women"
                        name="occupied_beds_women"
                        type="number"
                        min={0}
                        onChange={CreateDepartments.handleChange}
                        value={CreateDepartments.values.occupied_beds_women}
                        placeholder="Occupied Beds Women"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>{" "}
                  <div>
                    <label
                      htmlFor="unoccupied_beds_men"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Unoccupied Beds Men
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="unoccupied_beds_men"
                        name="unoccupied_beds_men"
                        type="number"
                        min={0}
                        onChange={CreateDepartments.handleChange}
                        value={CreateDepartments.values.unoccupied_beds_men}
                        placeholder="Unoccupied Beds Men"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>{" "}
                  <div>
                    <label
                      htmlFor="unoccupied_beds_women"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Unoccupied Beds women
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="unoccupied_beds_women"
                        name="unoccupied_beds_women"
                        type="number"
                        min={0}
                        onChange={CreateDepartments.handleChange}
                        value={CreateDepartments.values.unoccupied_beds_women}
                        placeholder="Unoccupied Beds women"
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

                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                      Departments
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {myData.map((details, index) => (
                        <option key={index} value={details?.value}>
                          {details?.label}
                        </option>
                      ))}
                    </select>
                    {/* <Select
                      value={options}
                      placeholder="Select"
                      onChange={(e) => handleChange(e)}
                      options={myData}
                      isMultiple={false}
                      isClearable={true}
                      primaryColor={"blue"}
                      isSearchable={true} // Add this line to enable search
                      className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    /> */}
                  </div>{" "}
                  <div>
                    <label
                      htmlFor="occupied_beds_men"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Occupied Beds Men
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="occupied_beds_men"
                        name="occupied_beds_men"
                        type="number"
                        min={0}
                        onChange={CreateDepartments.handleChange}
                        value={CreateDepartments.values.occupied_beds_men}
                        placeholder="Occupied Beds Men"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  {/* <div>
                    <label
                      htmlFor="name"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Department Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="name"
                        name="name"
                        onChange={CreateDepartments.handleChange}
                        value={CreateDepartments.values.name}
                        placeholder="Department Name"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div> */}
                  <div>
                    <label
                      htmlFor="total_beds"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Total Beds
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="total_beds"
                        name="total_beds"
                        min={0}
                        type="number"
                        onChange={CreateDepartments.handleChange}
                        value={CreateDepartments.values.total_beds}
                        placeholder="Total Beds"
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
              </div>
              <div className="flex justify-start">
                {loadingMessage ? (
                  <button
                    type="button"
                    className="text-white bg-primary-100 w-60 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                  >
                    loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="text-white bg-primary-100 rounded-md w-60 border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                  >
                    Add Department
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {viewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ">
          <div className="relative top-1 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden  mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setViewOpen(false)}
              />
              <h3 className="text-xl font-semibold">
                {selectedHealthCare?.name}
                <span className="text-lime-600 ml-2">
                  {selectedHealthCare?.status}
                </span>
              </h3>
            </div>
            <div>
              <div className="flex flex-row mr-2 p-5 -mt-6 justify-end">
                <p>
                  <span className="font-semibold flex justify-end">Name</span>
                  <p> {selectedHealthCare?.name}</p>
                </p>
                {/* <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedHealthCare?.email}
                </p> */}
              </div>
              <div className="px-5 ">
                <p className="text-lg text-right font-semibold">
                  Department Details
                </p>
                {selectedHealthCare?.departments.length > 0 ? (
                  selectedHealthCare?.departments?.map((departments) => (
                    <p key={departments.id} className="text-base text-right">
                      {departments.name}
                    </p>
                  ))
                ) : (
                  <p className="text-right">No Data</p>
                )}
              </div>
              <div className="px-5 mt-4 mb-5">
                <p className="text-lg text-right font-semibold">
                  Phone Number(s)
                </p>
                {selectedHealthCare?.phone_numbers?.map((phone_numbers) => (
                  <p key={phone_numbers.id} className="text-base text-right">
                    {phone_numbers.number}
                  </p>
                ))}
              </div>{" "}
              <div className="px-5 mt-4 mb-5">
                <p className="text-lg text-right font-semibold">Focal Person</p>
                {selectedHealthCare?.focal_persons?.map((person) => (
                  <p key={person.id} className="text-base text-right">
                    {`${person?.first_name || ""} ${person?.last_name || ""}`}
                  </p>
                ))}
              </div>
              <div className="h-80 w-10">
                <Map
                  google={window.google}
                  zoom={8}
                  style={{ width: "100%", height: "100%" }}
                  initialCenter={{
                    lat: parseFloat(selectedHealthCare?.latitude - 0.956858),
                    lng: parseFloat(selectedHealthCare?.longitude),
                  }}
                >
                  <Marker
                    position={{
                      lat: parseFloat(selectedHealthCare?.latitude),
                      lng: parseFloat(selectedHealthCare?.longitude),
                    }}
                  />
                </Map>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative mt-4 mx-auto  p-0 border w-2/4 shadow-lg rounded-md bg-white  h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setIsModalOpen(false)}
              />
              <h3 className="text-xl font-semibold">Create HealthCare</h3>
            </div>
            <form className="p-5" onSubmit={CreateHealtCare.handleSubmit}>
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="phone_numbers"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-2">
                      <InputMask
                        mask="00218 99 9999999"
                        maskChar=""
                        placeholder="00218 XX XXXXXXX"
                        onChange={CreateHealtCare.handleChange}
                        value={CreateHealtCare.values.phone_numbers}
                        type="tel"
                        name="phone_numbers"
                        id="phone_numbers"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />

                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 text-right mb-2">
                      Departments
                    </label>

                    <Select
                      value={options}
                      placeholder="Select"
                      onChange={(e) => handleChange(e)}
                      options={myData}
                      isMultiple={true}
                      isClearable={true}
                      primaryColor={"blue"}
                      isSearchable={true} // Add this line to enable search
                      className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    />
                  </div> */}
                  <div>
                    <label
                      htmlFor="addresss"
                      className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      Address
                    </label>
                    <div className="relative mt-2">
                      <input
                        onClick={() => setOpen(true)}
                        // onChange={CreateHealtCare.handleChange}
                        value={locationAddress?.address}
                        type="text"
                        name="addresss"
                        id="addresss"
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
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={CreateHealtCare.handleChange}
                        value={CreateHealtCare.values.name}
                        placeholder="Enter Name"
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Email
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={CreateHealtCare.handleChange}
                        value={CreateHealtCare.values.email}
                        placeholder="Enter Email"
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="focal_persons"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Focal Persons
                    </label>
                    <div className="relative mt-2">
                      <Select
                        value={optionsFocalPerson}
                        placeholder="Select"
                        onChange={(e) => handleChangeFocalPerson(e)}
                        options={allUsers?.map((variant) => ({
                          label: variant.first_name,
                          value: variant.id,
                        }))}
                        isMultiple={true}
                        isClearable={true}
                        primaryColor={"blue"}
                        isSearchable={true}
                        className="peer w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      />

                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <ul
                role="list"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {cardFocalPersons?.map((person) => (
                  <li
                    key={person.user.id}
                    className="col-span-2 divide-y divide-gray-200 rounded-lg bg-white shadow"
                  >
                    <div className="flex w-full items-center justify-between space-x-6 px-3 py-2">
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {person.user.first_name +
                              " " +
                              person.user.last_name}
                          </h3>
                          <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {person.user.designation}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {person.user.email}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="text-left mt-10">
                {loadingMessage ? (
                  <button
                    type="button"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      {updateFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setUpdateFormOpen(false)}
              />
              <h3 className="text-xl font-semibold">HealtCare Details</h3>
            </div>
            <form className="p-5" onSubmit={UpdateHealtCare.handleSubmit}>
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="phone_numbers"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Phone Number
                    </label>
                    <div className="relative mt-2">
                      <InputMask
                        mask="00218 99 9999999"
                        maskChar=""
                        placeholder="00218 XX XXXXXXX"
                        onChange={UpdateHealtCare.handleChange}
                        value={UpdateHealtCare.values.phone_numbers}
                        type="tel"
                        name="phone_numbers"
                        id="phone_numbers"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />

                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium leading-6 mb-2 text-gray-900 text-right">
                      Departments
                    </label>

                    <Select
                      value={options}
                      placeholder="Select"
                      onChange={(e) => handleChange(e)}
                      options={myData}
                      isMultiple={true}
                      isClearable={true}
                      primaryColor={"blue"}
                      isSearchable={true} // Add this line to enable search
                      className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    />
                  </div> */}
                  <div>
                    <label
                      htmlFor="addresss"
                      className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      Address
                    </label>
                    <div className="relative mt-2">
                      <input
                        onClick={() => setOpen(true)}
                        value={locationAddress?.address}
                        type="text"
                        name="addresss"
                        id="addresss"
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
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={UpdateHealtCare.handleChange}
                        value={UpdateHealtCare.values.name}
                        placeholder="Enter Name"
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Email
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={UpdateHealtCare.handleChange}
                        value={UpdateHealtCare.values.email}
                        placeholder="Enter Email"
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="focal_persons"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Focal Persons
                    </label>
                    <div className="relative mt-2">
                      <Select
                        value={updateFocalPerson}
                        placeholder="Select"
                        options={updateFocalOpetion}
                        onChange={(e) => handleOnChange(e)}
                        isMultiple={true}
                        isClearable={true}
                        primaryColor={"blue"}
                        isSearchable={true} // Add this line to enable search
                        className="peer w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      />

                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-left mt-10">
                {loadingMessage ? (
                  <button
                    type="button"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100`}
                  >
                    Update
                  </button>
                )}
              </div>
            </form>
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
                        center={position}
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
    </div>
  );
};
export default HealthCareFiles;
