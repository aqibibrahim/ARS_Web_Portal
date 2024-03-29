import React, { useEffect, useState, useRef } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Pagination } from "antd";

import {
  BsArrowRightCircle,
  BsEye,
  BsSearch,
  BsEyeSlash,
  BsShieldCheck,
} from "react-icons/bs";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { Select } from "antd";
import { Spin, Skeleton } from "antd";
import AmbulanceViewModal from "../../AmbulanceViewModal";
import { Modal } from "antd";
import { Vars } from "../../../helpers/helpers";
import noData from "../../../assets/noData.png";
// const { Option } = AntSelect;
const AmbulanceFiles = () => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myMakeData, setMyMakeData] = useState([]);
  const [myModelData, setMyModelData] = useState([]);
  const [myData, setMyData] = useState([]);
  const selectRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [allMakes, setAllMakes] = useState([""]);
  const [allModels, setAllModels] = useState([""]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMakeOption, setSelectedMakeOption] = useState(null);
  const [selectedModelOption, setSelectedModelOption] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [ambulanceData, setAmbulanceData] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [submitDone, setSubmitDone] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [options, setOptions] = useState([]);
  const [locationAddress, setLocationAddress] = useState({});
  const [open, setOpen] = useState(false);
  const [editOptions, setEditOptions] = useState(null);
  const [isSaveDisabled, setSaveDisabled] = useState(true);
  const [state, setState] = useState({ password: "" });
  const [pinModal, setPinModal] = useState(false);
  const [updatePinState, setupdatePinState] = useState({
    newPin: "",
  });
  const [updatePINId, setUpdatePINId] = useState("");

  const handlePasswordChange = (event) => {
    const inputValue = event.target.value;
    const maxLength = 6;

    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
    }

    CreateAmbulance.setFieldValue("password", event.target.value);
  };
  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchAmbulanceData(1, searchKeyword);
    }
  };
  const handleEditPasswordChange = (event) => {
    const inputValue = event.target.value;
    const maxLength = 6;

    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
    }

    EditAmbulance.setFieldValue("password", event.target.value);
  };
  const navigate = useNavigate();
  const HandelOpenMap = () => {
    setOpen(true);
    console.log("value:");
  };

  const handleChange = (value) => {
    setOptions(value);
    console.log("value:", value);
  };
  const handleChangeEquiments = (value) => {
    setEditOptions(value);
    console.log("value:", value);
  };

  const handleCreateAmbulanceClick = () => {
    setLongitude(null);
    setLatitude(null);
    setOptions(null);
    setLocationAddress({
      latitude: "",
      longitude: "",
      address: "",
    });
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchequipmentsData = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/equipments`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label: variant.name,
                value: variant.id,
              }))
            );
            // setIsLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchequipmentsData();
  }, []);
  const handleEditClick = (ambulance) => {
    console.log("Ambulance details", ambulance);
    setLongitude(null);
    setLatitude(null);
    setOptions(null);
    setSelectedAmbulance(ambulance);
    setLocationAddress({
      latitude: ambulance?.gps_latitude,
      longitude: ambulance?.gps_longitude,
      address: "",
    });

    setSelectedModelOption({
      label: ambulance?.model?.name,
      value: ambulance?.model?.id,
    });

    if (ambulance?.equipments.length === 0) {
      setEditOptions(null);
    } else {
      setEditOptions(
        ambulance?.equipments?.map((variant) => ({
          label: variant.name,
          value: variant.id,
        }))
      );
    }
    setUpdateFormOpen(true);
  };
  const handleViewClick = (ambulance) => {
    setViewOpen(true);
    setSelectedAmbulance(ambulance);
  };

  const fetchAmbulanceData = async (page = currentPage, keyword = "") => {
    try {
      await axios
        .get(`${window.$BackEndUrl}/ambulances`, {
          headers: headers,
          params: {
            page,
            per_page: itemsPerPage,
            search: keyword,
          },
        })
        .then((response) => {
          setAmbulanceData(response.data?.data);
          setIsLoading(false);
          console.log(response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    fetchAmbulanceData(currentPage, searchKeyword);
  }, [submitDone, currentPage, isDelete, searchKeyword]);

  const CreateAmbulance = useFormik({
    initialValues: {
      plate_no: "",
      make: "",
      model: "",
      gps_no: "",
      persons_supported: "",
      password: "",
      gps_latitude: "",
      gps_longitude: "",
      parking_latitude: "",
      parking_longitude: "",
      equipments: "",
    },
    onSubmit: (values) => {
      console.log("Equipement values", options);
      const JSON = {
        plate_no: values.plate_no,
        // make_id: selectedMakeOption?.value,
        model_id: selectedModelOption,
        gps_no: values.gps_no,
        persons_supported: values.persons_supported,
        password: values.password,
        gps_latitude: locationAddress?.latitude,
        gps_longitude: locationAddress?.longitude,
        parking_latitude: locationAddress?.latitude,
        parking_longitude: locationAddress?.longitude,
        equipments: options?.map((item) => item),
      };
      const createAmbulance = async () => {
        setLoadingMessage(true);
        console.log(JSON);
        try {
          const response = await axios.post(
            `${window.$BackEndUrl}/ambulances`,
            JSON,
            config
          );

          if (response.status === 200 || response.status === 201) {
            console.log(response);
            toast.success("تم تسجيل سيارة الإسعاف بنجاح");
            setSubmitDone(!submitDone);
            setLoadingMessage(false);
            CreateAmbulance.resetForm();
            setLocationAddress("");
            setEditOptions(null);
            setIsModalOpen(false);
            setSelectedMakeOption("");
            setSelectedModelOption("");
          } else {
            toast.error("فشل في تسجيل سيارة الإسعاف");
            setLoadingMessage(false);
            setIsModalOpen(false);
          }
        } catch (error) {
          toast.error(error?.response?.data?.data?.plate_no[0]);
          console.log(error);
          setLoadingMessage(false);
        }
      };
      createAmbulance();
    },
  });
  const EditAmbulance = useFormik({
    initialValues: {
      plate_no: selectedAmbulance?.plate_no,
      // make: selectedAmbulance?.make,
      model: selectedAmbulance?.model,
      gps_no: selectedAmbulance?.gps_no,
      persons_supported: selectedAmbulance?.persons_supported,
      password: selectedAmbulance?.password,
      gps_latitude: "",
      gps_longitude: "",
      parking_latitude: locationAddress?.latitude,
      parking_longitude: locationAddress?.longitude,
    },
    onSubmit: (values) => {
      console.log("Edit values", selectedModelOption);
      const JSON = {
        plate_no: values.plate_no,
        // make: values.make,
        model_id: selectedModelOption?.label
          ? selectedModelOption?.value
          : selectedModelOption,
        gps_no: values.gps_no,
        persons_supported: values?.persons_supported,
        password: values.password,
        gps_latitude: locationAddress?.latitude,
        gps_longitude: locationAddress?.longitude,
        parking_latitude: locationAddress?.latitude,
        parking_longitude: locationAddress?.longitude,
        equipments: editOptions?.map((item) =>
          item?.label ? item?.value : item
        ),
      };
      const editAmbulance = async () => {
        setLoadingMessage(true);
        console.log(JSON);
        try {
          await axios
            .patch(
              `${window.$BackEndUrl}/ambulances/${selectedAmbulance?.id}`,
              JSON,
              config
            )
            .then((res) => {
              console.log(res);
              toast.success("تم تحديث سيارة الإسعاف بنجاح", {
                className: "toast-align-right", // Apply the class name here
                // Other options...
              });
              setUpdateFormOpen(false);
              setSubmitDone(!submitDone);
              setLoadingMessage(false);
              setSelectedModelOption("");
            });
        } catch (e) {
          toast.error("failed");
          setLoadingMessage(false);
          console.log(e);
        }
      };

      editAmbulance();
    },

    enableReinitialize: true,
  });
  useEffect(() => {
    const getAllMakes = async () => {
      try {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/vehicle-make`, {
          headers,
        });
        if (response.status === 200 || response.status === 201) {
          setAllMakes(response?.data?.data);
          setMyMakeData(
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
    const getAllModels = async () => {
      try {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/vehicle-models`, {
          headers,
        });
        if (response.status === 200 || response.status === 201) {
          console.log("Response models", response?.data?.data);
          setAllModels(response?.data?.data);
          setMyModelData(
            response.data?.data?.map((variant) => ({
              label: variant.make.name + "-" + variant.name,
              value: variant.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };
    getAllMakes();
    getAllModels();
  }, [isModalOpen]);
  const { ControlPosition, Geocoder } = google.maps;
  const [position, setPosition] = useState({
    lat: 26.9894429391302,
    lng: 17.761961078429668,
  });

  const [address, setAddress] = useState("لم يتم تحديد عنوان");
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
          CreateAmbulance.setFieldValue("latitude", newPosition.lat);
          CreateAmbulance.setFieldValue("longitude", newPosition.lng);
          CreateAmbulance.setFieldValue(
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

    console.log(newPosition);
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

    CreateAmbulance.setFieldValue("latitude", latitude);
    CreateAmbulance.setFieldValue("longitude", longitude);
    CreateAmbulance.setFieldValue("informer_address", formatted_address);
  };
  const handlePlaceChange = () => {
    const input = document.getElementById("address");
    const options = {
      // bounds: defaultBounds, // Uncomment this line if you have specific bounds
      componentRestrictions: { country: "lby" },
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

  const AmbulanceDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const result = await axios.delete(
          `${window.$BackEndUrl}/ambulances/${isDeleteID}`,
          config
        );

        if (result.status === 200 || result.status === 204) {
          setDelete(false);

          toast.success("حذف بنجاح");
          setSubmitDone(!submitDone);
        } else {
          // Handle other status codes if needed
          console.error(`Unexpected status code: ${result.status}`);
          toast.error(result?.message);
        }
      } catch (e) {
        console.error(e);
        toast.error(e.response?.data?.message);
      }
    },
    enableReinitialize: true,
  });
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

    return `inline-flex items-center rounded-full ${backgroundColor} px-2 py-1 text-xs font-medium ${textColor}`;
  };
  const handleMakeSelect = (selectedOptions) => {
    setSelectedMakeOption(selectedOptions);
    console.log(selectedOptions);
  };
  const handleModelSelect = (selectedOptions) => {
    console.log("Selected Model", selectedOptions);
    setSelectedModelOption(selectedOptions);
    console.log(selectedOptions);
  };

  const isSubmitDisabled = () => {
    const { password, gps_no, plate_no, persons_supported } =
      CreateAmbulance.values;

    return (
      password.length !== 6 ||
      !gps_no ||
      plate_no.trim() === "" ||
      !locationAddress?.address ||
      !persons_supported ||
      !options ||
      !selectedModelOption
    );
  };
  const handleUpdatePin = (data) => {
    setPinModal(true);
    setUpdatePINId(data?.id);
  };
  const handleNewPin = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        newPassword: updatePinState.newPin,
      };

      const response = await axios.patch(
        `${Vars.domain}/ambulances/update-password/${updatePINId}`,
        data,
        {
          headers,
        }
      );

      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        toast.success("تم تحديث كلمة مرور سيارة الإسعاف بنجاح");
        resetPinState();
        setUpdatePINId("");
        setupdatePinState({ newPin: "" });
        setPinModal(false);
      }
    } catch (error) {
      // setPinModal(false);

      toast.error(error?.response?.data?.data?.newPassword[0]);
    }
  };
  const handlePinChange = (event) => {
    const inputValue = event.target.value;
    const maxLength = 6;

    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
    }
    setupdatePinState({
      ...updatePinState,
      [event.target.name]: event.target.value,
    });
  };
  const handleCancel = () => {
    setPinModal(false);
    setupdatePinState({ newPin: "" });
  };
  const columns = [
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "right",
    },
    {
      title: "رقم الاتصال",
      dataIndex: "informer.phone_numbers",
      key: "phone_numbers",
      align: "right",
    },

    {
      title: "انشأ من قبل",
      dataIndex: ["created_by", "first_name", "created_at"],
      key: "created_by",
      align: "right",
    },
    {
      title: "نوع الطوارئ",
      dataIndex: "emergency_type.name",
      key: "emergency_type",
      align: "right",
    },
    {
      title: "نوع الحادث",
      dataIndex: "incident_type.name",
      key: "incident_type",
      align: "right",
    },
    {
      title: "تفاصيل المتصل",
      dataIndex: "informer.name",
      key: "informer_name",
      align: "right",
    },
  ];
  const renderSkeleton1 = () => {
    return columns.map((column) => (
      <tr className="flex justify-between my-3 px-4 pb-4">
        {columns.map((column, index) => {
          if (index === columns.length - 6) {
            // Render buttons for the last column
            return (
              <td key={column.key}>
                <div className="flex justify-around gap-4">
                  <Skeleton.Button
                    active
                    size="small"
                    style={{ width: "20px", borderRadius: "4px" }}
                    className="mt-4"
                  />
                  <Skeleton.Button
                    active
                    size="small"
                    style={{ width: "20px", borderRadius: "4px" }}
                    className="mt-4"
                  />
                  <Skeleton.Button
                    active
                    size="small"
                    style={{ width: "20px", borderRadius: "4px" }}
                    className="mt-4"
                  />
                  <Skeleton.Button
                    active
                    size="small"
                    style={{ width: "20px", borderRadius: "4px" }}
                    className="mt-4"
                  />
                </div>
              </td>
            );
          } else {
            // Render skeleton inputs for other columns
            return (
              <td key={column.key}>
                <Skeleton.Input
                  active
                  size="small"
                  className="mt-4 mr-1"
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              </td>
            );
          }
        })}
      </tr>
    ));
  };
  return (
    <div
      className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
    >
      <Toaster position="bottom-right" richColors />
      <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
        <div className="p-4 text-right  bg-gray-100 ">
          <h1 className="text-xl font-semibold">سيارات الإسعاف</h1>
        </div>
        <div className="flex flex-row items-center p-4 space-x-4 bg-gray-100 justify-end  ">
          <div className="flex flex-row space-x-2 "></div>
          <div className="flex flex-1 ml-4 items-center bg-gray-300 rounded-lg px-3 ">
            <BsSearch width={9} height={9} />
            <input
              className="bg-transparent focus:border-none border-0 w-full text-right placeholder:text-sm"
              type="text"
              placeholder="البحث عن سيارات الإسعاف"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </div>

          <button
            className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-primary-100 text-base"
            type="button"
            onClick={handleCreateAmbulanceClick}
          >
            + تسجيل سيارة إسعاف
          </button>
        </div>
        <div className="rtl">
          {isLoading ? (
            renderSkeleton1()
          ) : (
            <>
              {ambulanceData?.data?.length > 0 ? (
                <>
                  <table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1 ">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="relative py-3 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                        {/* <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium   tracking-wide text-gray-500"
                      >
                        Region
                      </th>{" "} */}
                        <th
                          scope="col"
                          className="px-3 py-3 text-sm font-medium   tracking-wide text-gray-500"
                        >
                          موديل
                        </th>
                        <th
                          scope="col"
                          className="py-3 pl-4 pr-3 text-sm font-medium    tracking-wide text-gray-500 sm:pl-0"
                        >
                          ماركة
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-sm font-medium   tracking-wide text-gray-500"
                        >
                          رقم لوحة
                        </th>
                        {/* <th
                    scope="col"
                    className="px-3 py-3 text-sm font-medium   tracking-wide text-gray-500"
                  >
                    Contact Number
                  </th> */}
                        <th
                          scope="col"
                          className="px-3 py-3 text-sm font-medium   tracking-wide text-gray-500"
                        >
                          حالة
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-sm font-medium   tracking-wide text-gray-500 "
                        >
                          رقم تسلسل سيارة الإسعاف
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ambulanceData.data?.map((ambulance) => (
                        <tr key={ambulance.id} className="hover:bg-gray-100">
                          <td className="m-auto  text-sm  sm:pr-0">
                            <span className="flex items-center justify-center gap-5">
                              <span
                                className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                                onClick={() => {
                                  setDelete(true);
                                  setDeleteID(ambulance?.id);
                                }}
                              >
                                <BiMessageAltX />
                              </span>
                              <button
                                onClick={() => handleEditClick(ambulance)}
                                className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                              >
                                <BiEdit />
                                <span className="sr-only">
                                  , {ambulance.name}
                                </span>
                              </button>
                              <button
                                onClick={() => handleViewClick(ambulance)}
                                className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                              >
                                <BsEye />
                                <span className="sr-only">
                                  , {ambulance.name}
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdatePin(ambulance)}
                                className="text-green-400 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                              >
                                <BsShieldCheck />
                              </button>
                            </span>
                          </td>
                          {/* <td className="whitespace-nowrap px-3 py-4 text-xs">
                        {ambulance?.regions[0]?.name}
                      </td> */}
                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {ambulance.model?.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {ambulance?.model?.make?.name}
                          </td>
                          {/* <td className="whitespace-nowrap px-3 py-4 text-md">
                      {ambulance?.contact_nos?.map((phone) => (
                      <div key={phone}>{phone}</div>
                    ))}
                    </td> */}
                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {ambulance.plate_no}
                          </td>
                          <td className="px-2 py-4 text-md  flex items-baseline justify-end ">
                            <span
                              className={` ${getStatusStyle(ambulance.status)}`}
                            >
                              {ambulance.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {ambulance.id_no}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-5 ">
                    <Pagination
                      className="flex text-sm text-semi-bold mb-2"
                      style={{ fontFamily: "Cairo" }}
                      current={currentPage}
                      total={ambulanceData?.total || 0}
                      pageSize={itemsPerPage}
                      onChange={(page) => setCurrentPage(page)}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} سيارات الإسعاف`
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <img src={noData} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <AmbulanceViewModal
        viewOpen={viewOpen}
        setViewOpen={setViewOpen}
        selectedAmbulance={selectedAmbulance}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className=" top-5 -left-[16rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setIsModalOpen(false);
                  CreateAmbulance.resetForm();
                }}
              />
              <h3 className="text-xl font-semibold">تسجيل سيارة إسعاف جديدة</h3>
            </div>
            <form
              className="p-5"
              onSubmit={CreateAmbulance.handleSubmit}
              autoComplete="off"
            >
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label className="block text-base font-medium leading-6 text-gray-900 text-right">
                      معدات
                    </label>
                    <div className="mt-[7px] ">
                      <Select
                        tabIndex={1}
                        showSearch={true}
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder={
                          <span
                            className="flex justify-end mr-3"
                            style={{ fontFamily: "Cairo" }}
                          >
                            حدد المعدات
                          </span>
                        }
                        onChange={(value) => handleChange(value)}
                        options={myData}
                        dropdownStyle={{
                          textAlign: "right",
                          fontFamily: "Cairo",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="2"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-base mt-2 font-medium leading-6 text-gray-900 text-right"
                    >
                      الأشخاص المدعومين
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={3}
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        type="number"
                        name="persons_supported"
                        id="persons_supported"
                        onChange={CreateAmbulance.handleChange}
                        value={CreateAmbulance.values.persons_supported}
                        placeholder="الأشخاص المدعومين"
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="4"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="addresss"
                      className=" text-base flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      منطقة مواقف السيارات
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={5}
                        onClick={HandelOpenMap}
                        value={locationAddress?.address}
                        type="text"
                        name="addresss"
                        id="addresss"
                        className="peer block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        placeholder=" اختر على الخريطة"
                        required
                        readOnly
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="6"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="plate_no"
                      className="block text-base font-medium leading-6 text-gray-900 text-right"
                    >
                      رقم لوحة{" "}
                    </label>
                    <div className="relative mt-2 ">
                      <input
                        tabIndex={0}
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        type="text"
                        name="plate_no"
                        id="plate_no"
                        onChange={CreateAmbulance.handleChange}
                        value={CreateAmbulance.values.plate_no}
                        placeholder="أدخل رقم اللوحة"
                        required
                        autoComplete="nope"
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="1"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="model"
                      className="block text-base font-medium leading-6 text-gray-900 text-right"
                    >
                      ماركة وموديل
                    </label>
                    <div className="relative mt-2 ">
                      <Select
                        tabIndex={2}
                        value={selectedModelOption}
                        placeholder={
                          <span
                            className="flex justify-end"
                            style={{ fontFamily: "Cairo" }}
                          >
                            حدد طراز السيارة
                          </span>
                        }
                        onChange={handleModelSelect}
                        options={myModelData}
                        showSearch
                        optionFilterProp="label"
                        className="w-full mt-2 text-right"
                        dropdownStyle={{
                          textAlign: "right",
                          fontFamily: "Cairo",
                        }}
                        style={{ fontFamily: "Cairo" }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="3"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="gps_no"
                      className="block text-base font-base leading-6 text-gray-900 text-right"
                    >
                      GPS رقم{" "}
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={4}
                        type="number"
                        name="gps_no"
                        id="gps_no"
                        onChange={CreateAmbulance.handleChange}
                        value={CreateAmbulance.values.gps_no}
                        placeholder="GPS رقم"
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b-2 border-gray-300 mb-6">
                {/* Separator */}
              </div>
              <h3 className="text-xl font-semibold text-right">
                كلمة المرور لحساب سيارة الإسعاف
              </h3>
              <div className="flex justify-end mt-1">
                <div className="justify-end">
                  <label
                    htmlFor="password"
                    className="block text-base font-medium leading-6 text-gray-900 text-right"
                  >
                    كلمة المرور
                  </label>
                  <div className="relative mt-2">
                    <input
                      tabIndex={6}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      onChange={handlePasswordChange}
                      value={CreateAmbulance.values.password}
                      placeholder="أدخل كلمة المرور"
                      className="peer block px-2 w-64 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      required
                    />

                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-5 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </button>
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
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 py-2 px-5 transition-all duration-300 
                     `}
                  >
                    تسجيل سيارة الإسعاف
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {updateFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1  mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setUpdateFormOpen(false);
                  setSelectedModelOption("");
                }}
              />
              <h3 className="text-xl font-semibold">تحديث سيارة الإسعاف</h3>
            </div>
            <form className="p-5" onSubmit={EditAmbulance.handleSubmit}>
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label className="block text-base font-medium leading-6 text-gray-900 text-right">
                      معدات
                    </label>
                    <Select
                      style={{ fontFamily: "Cairo" }}
                      tabIndex={1}
                      value={editOptions}
                      placeholder={
                        <span
                          className="flex justify-end mr-3"
                          style={{ fontFamily: "Cairo" }}
                        >
                          حدد طراز السيارة{" "}
                        </span>
                      }
                      onChange={(e) => handleChangeEquiments(e)}
                      options={myData}
                      showSearch
                      dropdownStyle={{
                        textAlign: "right",
                        fontFamily: "Cairo",
                      }}
                      mode="multiple"
                      optionFilterProp="label"
                      className="w-full mt-2 text-right justify-end"
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          document.querySelector('[tabIndex="2"]').focus();
                        }
                      }}
                    />
                    {/* <Select
                      tabIndex={1}
                      showSearch={true}
                      style={{ width: "100%" }}
                      // placeholder={<span className="flex ">حدد المعدات</span>}
                      onChange={(e) => handleChangeEquiments(e)}
                      options={
                        // <div className="flex justify-end mr-5"> {myData}</div>
                        ""
                      }
                      mode="multiple"
                      // value={editOptions}
                      // allowClear={true}
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          document.querySelector('[tabIndex="2"]').focus();
                        }
                      }}
                    /> */}
                  </div>

                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-base mt-2 font-medium leading-6 text-gray-900 text-right"
                    >
                      الأشخاص المدعومين
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={3}
                        type="number"
                        name="persons_supported"
                        id="persons_supported"
                        onChange={EditAmbulance.handleChange}
                        value={EditAmbulance.values.persons_supported}
                        placeholder="أدخل الشخص المدعوم"
                        className="peer block mt-4  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="4"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="addresss"
                      className=" text-base flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      منطقة مواقف السيارات
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={5}
                        onClick={HandelOpenMap}
                        onChange={EditAmbulance.handleChange}
                        value={[
                          "latitude " +
                            locationAddress?.latitude +
                            " longitude " +
                            locationAddress?.longitude,
                        ]}
                        type="text"
                        name="addresss"
                        id="addresss"
                        className="peer block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        placeholder="اختر على الخريطة"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="plate_no"
                      className="block text-base font-medium leading-6 text-gray-900 text-right"
                    >
                      رقم لوحة{" "}
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={0}
                        type="text"
                        name="plate_no"
                        id="plate_no"
                        onChange={EditAmbulance.handleChange}
                        value={EditAmbulance.values.plate_no}
                        placeholder="أدخل رقم اللوحة"
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="1"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="model"
                      className="block text-base font-medium leading-6 text-gray-900 text-right"
                    >
                      ماركة وموديل
                    </label>
                    <div className=" mt-2">
                      {/* <Select
                        dropdownStyle={{
                          textAlign: "right",
                          display: "flex",
                          justifyContent: "end",
                        }}
                        placeholder={
                          <span
                            className="flex justify-end mr-3"
                            style={{ fontFamily: "Cairo" }}
                          >
                            حدد طراز السيارة{" "}
                          </span>
                        }
                        tabIndex={2}
                        value={selectedModelOption}
                        onChange={handleModelSelect}
                        options={myModelData}
                        showSearch
                        optionFilterProp="label"
                        className="w-full mt-2 text-right ml-auto"
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="3"]').focus();
                          }
                        }}
                      /> */}
                      <Select
                        tabIndex={2}
                        value={selectedModelOption}
                        placeholder={
                          <span
                            className="flex justify-end"
                            style={{ fontFamily: "Cairo" }}
                          >
                            حدد طراز السيارة
                          </span>
                        }
                        onChange={handleModelSelect}
                        options={myModelData}
                        showSearch
                        optionFilterProp="label"
                        className="w-full mt-2 text-right"
                        dropdownStyle={{
                          textAlign: "right",
                          fontFamily: "Cairo",
                        }}
                        style={{ fontFamily: "Cairo" }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="3"]').focus();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="gps_no"
                      className="block text-base font-medium leading-6 text-gray-900 text-right"
                    >
                      رقم GPS
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={4}
                        type="number"
                        name="gps_no"
                        id="gps_no"
                        onChange={EditAmbulance.handleChange}
                        value={EditAmbulance.values.gps_no}
                        placeholder=" رقم GPS"
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="5"]').focus();
                          }
                        }}
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
                    تحميل...
                  </button>
                ) : (
                  <button
                    type="submit"
                    // disabled={isEditSubmitDisabled()}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  hover:border-primary-100 "`}
                  >
                    تحديث سيارة الإسعاف
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <Modal
        title={
          <span className="flex justify-end">
            تحديث كلمة المرور لسيارة الإسعاف
          </span>
        }
        style={{ fontFamily: "Cairo" }}
        open={pinModal}
        onOk={handleNewPin}
        onCancel={handleCancel}
        closable={false}
        cancelText="أغلق"
        okButtonProps={{
          style: { backgroundColor: "green", fontFamily: "Cairo" },
        }}
        okText="تحديث"
        cancelButtonProps={{
          style: { fontFamily: "Cairo" },
        }}
      >
        <div className="flex flex-col space-y-2 w-full">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6  text-gray-900 text-right"
            >
              كلمة المرور الجديدة
            </label>
            <div className="relative mt-2">
              <input
                onChange={handlePinChange}
                value={updatePinState.newPin}
                name="newPin"
                type="number"
                placeholder="أدخل كلمة المرور الجديدة"
                className={`peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right 
                }`}
                required
              />
              {/* {validationErrors.newPin && (
                <span className="text-red-500 text-xs mt-1">
                  {validationErrors.newPin}
                </span>
              )} */}
              <div
                className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Modal>
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
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 "
                      onClick={() => setDelete(false)}
                    >
                      <span className="sr-only">أغلق</span>
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
                        <p className="text-xl flex justify-center items-center text-gray-500">
                          هل أنت متأكد أنك تريد حذف؟
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
                        يمسح
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
                <Dialog.Panel className="relative transform mx-auto w-[90rem] h-screen overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                  <div className="flex flex-col h-full">
                    <div
                      id="pac-card"
                      className="flex rounded-md gap-10 justify-center my-4 p-4 bg-white relative z-10"
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
                      <div style={{ marginTop: "10px" }}>
                        <strong>Address:</strong> {address}
                      </div>
                      <button
                        onClick={() => setOpen(false)}
                        className="bg-blue-400 rounded-xl px-4 text-white mt-1 font-semibold"
                      >
                        أغلق
                      </button>
                    </div>
                    <Map
                      google={google}
                      zoom={5}
                      onClick={handleMapClick}
                      disableDefaultUI
                      zoomControlOptions={{
                        position: ControlPosition.BOTTOM_LEFT,
                      }}
                      mapTypeControlOptions={{
                        position: ControlPosition.TOP_CENTER,
                      }}
                      initialCenter={position}
                      center={position}
                      className="flex-grow z-0"
                    >
                      <Marker
                        position={position}
                        draggable={true}
                        onDragend={handleMarkerDragEnd}
                      />
                    </Map>
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

export default AmbulanceFiles;
