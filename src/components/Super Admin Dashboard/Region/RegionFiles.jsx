import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { BsArrowRightCircle, BsEye, BsSearch } from "react-icons/bs";
import InputMask from "react-input-mask";
import { Select as AntSelect } from "antd";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Spin } from "antd";
import noData from "../../../assets/noData.png";
const RegionFiles = () => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    pin: "",
    phoneNumbers: "",
  });
  const resetValidationErrors = () => {
    setValidationErrors({
      name: "",
      email: "",
      pin: "",
      phoneNumbers: "",
    });
  };
  const [editData, setEditData] = useState({
    phoneNumbers: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ambulanceData, setAmbulanceData] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [locationAddress, setLocationAddress] = useState({});
  const [formattedAddress, setFormattedAddress] = useState();
  const [submitDone, setSubmitDone] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [myData, setMyData] = useState([]);
  const navigate = useNavigate();
  const handleChange = (value) => {
    setOptions(value);

    console.log("value:", value);
  };
  useEffect(() => {
    const fetchambulances = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/ambulances`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label:
                  variant?.model?.make?.name +
                  " " +
                  variant?.model?.name +
                  " " +
                  variant?.plate_no,
                value: variant.id,
              }))
            );
            // setDepartments(response.data.data);
            // setLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        // toast.error("An error occurred while fetching departments");
        console.log(e);
      }
    };
    fetchambulances();
  }, []);
  const handleCreateRegionClick = () => {
    setLongitude(null);
    setLatitude(null);
    setOptions(null);
    setPhoneNumbers([]);
    setLocationAddress({
      latitude: "",
      longitude: "",
      address: "",
      setNewPhoneNumber: "",
      setPhoneNumbers: [],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (region) => {
    setLongitude(null);
    setLatitude(null);
    if (region?.ambulances.length == 0) {
      setOptions(null);
    } else {
      setOptions(
        region?.ambulances?.map((variant) => ({
          label: variant?.model?.make?.name + " " + variant?.model?.name,
          value: variant?.id,
        }))
      );
    }
    setPhoneNumbers(region?.phone_numbers?.map((phone) => phone.number));
    setSelectedAmbulance(region);
    setLocationAddress({
      latitude: region?.latitude,
      longitude: region?.longitude,
      address: region?.address,
    });

    setUpdateFormOpen(true);
  };

  useEffect(() => {
    const fetchRegionsData = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/regions`, {
            headers: headers,
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
    fetchRegionsData();
  }, [submitDone]);
  const toastErrorMessages = (data) => {
    Object.entries(data).forEach(([field, messages]) => {
      messages.forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    });
  };

  const CreateRegion = useFormik({
    initialValues: {
      ambulances: "",
      name: "",
      latitude: "",
      longitude: "",
      address: "",
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        ambulances: options?.map((item) => item),
        name: values.name,
        address: locationAddress?.address,
        latitude: locationAddress.latitude,
        longitude: locationAddress.longitude,
        phone_numbers: phoneNumbers,
      };

      const UploadRegion = async () => {
        console.log(JSON);
        try {
          await axios
            .post(`${window.$BackEndUrl}/regions`, JSON, config)
            .then((res) => {
              console.log(res);
              setSubmitDone(!submitDone);
              setLoadingMessage(false);
              toast.success("Created Successfuly");
              setIsModalOpen(false);
              CreateRegion.resetForm();
            });
        } catch (e) {
          setLoadingMessage(false);
          if (e.response?.data?.code === 400) {
            toastErrorMessages(e?.response?.data?.data);
            setLoadingMessage(false);
          } else {
            toast.error("failed");
            setLoadingMessage(false);
          }
          console.log(e);
        }
      };

      UploadRegion();
    },

    enableReinitialize: true,
  });
  const EditRegion = useFormik({
    initialValues: {
      name: selectedAmbulance?.name,
      latitude: selectedAmbulance?.latitude,
      longitude: selectedAmbulance?.longitude,
      address: locationAddress?.address,
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        ambulances: options?.map((item) => item.value),
        name: values.name,
        address: locationAddress?.address,
        latitude: locationAddress.latitude,
        longitude: locationAddress.longitude,
        phone_numbers: phoneNumbers,
      };
      const UpdateRegion = async () => {
        console.log(JSON);
        try {
          await axios
            .patch(
              `${window.$BackEndUrl}/regions/${selectedAmbulance?.id}`,
              JSON,
              config
            )
            .then((res) => {
              console.log(res);
              setSubmitDone(!submitDone);
              setLoadingMessage(false);
              toast.success("Updated Successfuly");
              setUpdateFormOpen(close);
            });
        } catch (e) {
          toast.error("failed");
          setLoadingMessage(false);
          console.log(e);
        }
      };

      UpdateRegion();
    },

    enableReinitialize: true,
  });

  const GOOGLE_MAPS_APIKEY = "AIzaSyDZiTIdSoTe6XJ7-kiAadVrOteynKR9_38";
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

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber.trim() !== "") {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
      setNewPhoneNumber("");
    }
  };
  const handleRemovePhoneNumber = (index) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const AmbulanceDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const result = await axios.delete(
          `${window.$BackEndUrl}/regions/${isDeleteID}`,
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

  const isSubmitDisabled = () => {
    const { name } = CreateRegion.values;
    return (
      !options?.length > 0 ||
      !phoneNumbers?.length > 0 ||
      name?.trim() === "" ||
      !locationAddress?.address
    );
  };

  return (
    <div
      className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
    >
      <Toaster position="bottom-right" richColors />
      <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
        <div className="p-4 text-right  bg-gray-100 ">
          <h1 className="text-xl font-semibold">المناطق</h1>
        </div>
        <div className="flex flex-row items-center p-4 space-x-4 bg-gray-100 justify-end ">
          <div className="flex flex-row space-x-2"></div>
          <div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 ">
            <BsSearch width={9} height={9} />
            <input
              className="bg-transparent focus:border-none border-0 w-full text-right placeholder:text-sm"
              type="text"
              placeholder="البحث عن المنطقة"
            />
          </div>

          <button
            className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
            type="button"
            onClick={handleCreateRegionClick}
          >
            + تسجيل المنطقة
          </button>
        </div>

        <div className="rtl">
          {isLoading ? (
            <p className="text-center justify-center flex m-auto p-56">
              <Spin size="large" />
            </p>
          ) : ambulanceData?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1">
              <thead>
                <tr>
                  <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                  {/* <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                  >
                    Phone Number(s)
                  </th> */}
                  <th
                    scope="col"
                    className="py-3 pl-4 pr-3 text-xs font-medium  tracking-wide text-gray-500 sm:pl-0"
                  >
                    أرقام الهواتف
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                  >
                    عدد سيارات الإسعاف
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                  >
                    حالة
                  </th>
                  {/* <th
                scope="col"
                className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
              >
                Location
              </th> */}
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                  >
                    عنوان
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                  >
                    اسم المنطقة
                  </th>
                </tr>
              </thead>
              <tbody>
                {ambulanceData?.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-100">
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <span className="flex items-center justify-center gap-5">
                        <button
                          className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                          onClick={() => {
                            setDelete(true);
                            setDeleteID(region?.id);
                          }}
                        >
                          {" "}
                          <BiMessageAltX />
                        </button>
                        <button
                          onClick={() => handleEditClick(region)}
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                        >
                          <BiEdit />
                          <span className="sr-only">, {region.name}</span>
                        </button>{" "}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs">
                      {region?.phone_numbers?.map((phone_numbers) => (
                        <p
                          key={phone_numbers?.id}
                          className=" text-right text-xs"
                        >
                          {phone_numbers?.number}
                        </p>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs">
                      <span className="inline-flex items-center rounded-full  px-2 py-1 text-xs font-medium ">
                        {region?.ambulances?.length}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-1 mt-4 text-xs">
                      {" "}
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {region?.status}
                      </span>
                    </td>
                    {/* <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {region.latitude} {region.longitude}
                </td> */}
                    <td className="whitespace-nowrap px-3 py-4 text-xs">
                      {region?.address}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs">
                      {region?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">
              <img src={noData} />
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1  mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setIsModalOpen(false);
                  CreateRegion.resetForm();
                }}
              />
              <h3 className="text-xl font-semibold">تسجيل المنطقة</h3>
            </div>
            <form className="p-5" onSubmit={CreateRegion.handleSubmit}>
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  {/* <div>
                    <label
                      htmlFor="ambulances"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Assigned Ambulances
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="ambulances"
                        name="ambulances"
                        type="number"
                        placeholder="Enter Ambulances ID"
                        onChange={CreateRegion.handleChange}
                        value={CreateRegion.values.ambulances}
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
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
                      htmlFor="addresss"
                      className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      عنوان
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={1}
                        required
                        onClick={() => setOpen(true)}
                        onChange={CreateRegion.handleChange}
                        value={locationAddress?.address}
                        type="text"
                        name="addresss"
                        id="addresss"
                        className="peer mt-3 block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        placeholder=" اختر على الخريطة"
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="2"]').focus();
                          }
                        }}
                        readOnly
                      />
                    </div>
                    <div className="relative mt-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                        سيارات الإسعاف المخصصة
                      </label>

                      <AntSelect
                        mode="multiple"
                        value={options || []} // Ensure value is an empty array if options are null
                        placeholder={
                          <span
                            className="flex justify-end mr-3"
                            style={{ fontFamily: "Cairo" }}
                          >
                            اختر سيارة الإسعاف
                          </span>
                        }
                        onChange={(value) => handleChange(value)}
                        options={myData}
                        showSearch
                        optionFilterProp="label"
                        className="w-full mt-2"
                        dropdownStyle={{ textAlign: "right" }}
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
                      اسم المنطقة
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={0}
                        type="text"
                        name="name"
                        id="name"
                        onChange={CreateRegion.handleChange}
                        value={CreateRegion.values.name}
                        placeholder="اكتب اسم المنطقة"
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
                      htmlFor="phone_numbers"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      رقم التليفون
                    </label>

                    <div className="w-full  mb-6 ">
                      <div className="flex w-full ">
                        <div className="relative mt-2 w-full">
                          <InputMask
                            {...(phoneNumbers
                              ? { required: false }
                              : { required: true })}
                            tabIndex={2}
                            mask="00218 99 9999999"
                            maskChar=""
                            placeholder="00218 XX XXXXXXX"
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                console.log("e.key", e.key);
                                e.preventDefault();
                                handleAddPhoneNumber();
                              }
                            }}
                            value={newPhoneNumber}
                            type="tel"
                            name="phone_numbers"
                            id="phone_numbers"
                            className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              {phoneNumbers.length > 0 && (
                <div className="flex flex-wrap mt-2">
                  {phoneNumbers.map((phoneNumber, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-2 rounded-md flex items-center mr-2 mb-2"
                    >
                      <span className="mr-1 text-xs">{phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoneNumber(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="text-xs">X</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100  py-2 px-5 transition-all duration-300  `}
                  >
                    تسجيل المنطقة
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
              <h3 className="text-xl font-semibold">تفاصيل المنطقة</h3>
            </div>
            <form className="p-5" onSubmit={EditRegion.handleSubmit}>
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="addresss"
                      className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
                    >
                      عنوان{" "}
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={1}
                        onClick={() => setOpen(true)}
                        onChange={EditRegion.handleChange}
                        value={EditRegion.values.address}
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
                            document.querySelector('[tabIndex="2"]').focus();
                          }
                        }}
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                      سيارات الإسعاف المخصصة
                    </label>

                    <AntSelect
                      value={options}
                      placeholder={
                        <span
                          style={{
                            fontFamily: "Cairo",
                            display: "flex",
                            justifyContent: "flex-end",
                            marginRight: 13,
                          }}
                        >
                          اختر سيارات الإسعاف
                        </span>
                      }
                      className="w-full mt-2"
                      mode="multiple"
                      dropdownStyle={{ textAlign: "right" }}
                      onChange={(e) => handleChange(e)}
                      options={myData}
                      isMultiple={true}
                      isClearable={true}
                      primaryColor={"blue"}
                      // className="peer  w-full  flex justify-end border-0 bg-offWhiteCustom-100  text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      اسم المنطقة
                    </label>
                    <div className="relative mt-2">
                      <input
                        tabIndex={0}
                        type="text"
                        name="name"
                        id="name"
                        onChange={EditRegion.handleChange}
                        value={EditRegion.values.name}
                        placeholder="اكتب اسم المنطقة"
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            document.querySelector('[tabIndex="1"]').focus();
                          }
                        }}
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone_numbers"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      رقم التليفون
                    </label>

                    <div className="w-full  mb-6 ">
                      <div className="flex w-full ">
                        <div className="relative mt-2  w-full">
                          <InputMask
                            tabIndex={2}
                            mask="00218 99 9999999" // Define your desired mask here
                            maskChar=""
                            placeholder="00218 XX XXXXXXX"
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                console.log("e.key", e.key);
                                e.preventDefault();
                                handleAddPhoneNumber();
                              }
                            }}
                            value={newPhoneNumber}
                            type="tel"
                            name="phone_numbers"
                            id="phone_numbers"
                            className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          />

                          <div
                            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              {phoneNumbers.length > 0 && (
                <div className="flex flex-wrap mt-2 justify-end">
                  {phoneNumbers.map((phoneNumber, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-2 rounded-md flex items-center mr-2 mb-2"
                    >
                      <span className="mr-1 text-xs">{phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoneNumber(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="text-xs hover:cursor-pointer">X</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    تحديث
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
                        <p className="text-sm flex justify-center items-center text-gray-500">
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
                        placeholder="أدخل الموقع"
                        onChange={handlePlaceChange}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <strong> عنوان : </strong> {address}
                      </div>
                      <button
                        onClick={() => setOpen(false)}
                        className="bg-blue-400 rounded-xl px-3 text-white mt-1 font-semibold"
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

export default RegionFiles;
