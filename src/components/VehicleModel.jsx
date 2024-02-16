import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import ModalComponent from "./Common/ModalComponent";
import { BsEye } from "react-icons/bs";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";
import { Select, Skeleton } from "antd";

export default function VehicleModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMakes, setAllMakes] = useState([""]);
  const [allModels, setAllModels] = useState([""]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [myData, setMyData] = useState([]);
  const [editOptions, setEditOptions] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editIncidentType, setEditIncidentType] = useState("");
  const [editIncidentID, setEditIncidentID] = useState("");
  const [deleteIncidentID, setDeleteIncidentID] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    vehicleModel: "",
    editVehicleModel: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    vehicleModel: "",
    editVehicleModel: "",
  });

  // const validateForm = () => {
  //     const errors = {};
  //     let isValid = true;
  //     if (!state.vehicleModel) {
  //         errors.vehicleModel = "Vehicle Make is required";
  //         isValid = false;
  //     } else if (!state.editVehicleModel) {
  //         errors.editVehicleModel = "Vehicle Make is required";
  //         isValid = false;
  //     }
  //     setValidationErrors(errors);

  //     return isValid;
  // };

  const resetValidationErrors = () => {
    setValidationErrors({
      vehicleModel: "",
      editVehicleModel: "",
    });
  };
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
    setValidationErrors({
      ...validationErrors,
      [event.target.name]:
        event.target.value.trim() === "" ? `Vehicle Make is required` : "",
    });
  };

  const AddNewVehicleModel = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setDeleteModal(false);
  };
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
          setIsLoading(false);
          setAllMakes(response?.data?.data);
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
          setAllModels(response?.data?.data);
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };
    getAllMakes();
    getAllModels();
  }, [isModalOpen, editOpen, deleteModal]);

  const handleView = (data) => {
    setViewOpen(true);
    setEditData(data);
  };
  const handleEdit = (data) => {
    setEditOpen(true);
    setState({
      editVehicleModel: data?.name,
    });
    setSelectedOption({
      label: data?.make?.name,
      value: data?.make?.id,
    });
    setEditIncidentID(data?.id);
  };
  const toastErrorMessages = (errors) => {
    Object.keys(errors).forEach((field) => {
      const messages = errors[field];
      messages.forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    });
  };
  const createNewVehicleModel = async () => {
    // if (!validateForm()) {
    //     return;
    // }

    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const data = {
        name: state?.vehicleModel,
        make_id: selectedOption,
      };
      const response = await axios.post(`${Vars.domain}/vehicle-models`, data, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Vehicle Model Added Successfully");
        setIsLoading(false);
        setState({ vehicleModal: "" });
        setIsModalOpen(false);
        setSelectedOption("");
        setState({ vehicleModel: "" });
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.data?.name[0]);
      setIsLoading(false);
    }

    setIsLoading(false);
  };
  const handleSelect = (selectedOptions) => {
    setSelectedOption(selectedOptions);
    console.log(selectedOptions);
  };
  const editVehcileMake = async () => {
    // if (!validateForm()) {
    //     return;
    // }

    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const data = {
        name: state?.editVehicleModel,
        make_id: selectedOption?.value ? selectedOption?.value : selectedOption,
      };
      const response = await axios.patch(
        `${Vars.domain}/vehicle-models/${editIncidentID}`,
        data,
        {
          headers,
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Vehicle Model Updated Successfully");
        setIsLoading(false);
        setEditIncidentID("");
        setEditOpen(false);
        setState({ editVehicleModel: "" });
      }
    } catch (error) {
      console.error("Error updating Incident Type:", error);
      toast.error(error?.response?.data?.message);
    }

    setIsLoading(false);
  };

  const deleteVehicleModel = async () => {
    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `${Vars.domain}/vehicle-models/${deleteIncidentID}`,
        {
          headers,
        }
      );
      if (response.status === 204 || response.status === 201) {
        toast.success("Vehicle Model Deleted Successfuly");
        setIsLoading(false);
        setDeleteIncidentID("");
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting Vehicle Model :", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
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
      title: "رقم الاتصال",
      dataIndex: "informer.phone_numbers",
      key: "phone_numbers",
      align: "right",
    },
  ];
  const renderSkeleton1 = () => {
    return columns.map((column) => (
      <tr className="flex justify-between my-3 px-4 pb-4">
        {columns.map((column, index) => {
          if (index === columns.length - 3) {
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
    <>
      <Toaster position="bottom-right" richColors />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white   mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 ">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setIsModalOpen(false);
                  resetValidationErrors();
                  setSelectedOption("");
                  setState({ vehicleModel: "" });
                }}
              />
              <h3 className="text-xl font-semibold">اضافة موديل سيارة جديد</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      موديل السيارة
                    </label>
                    <div className="relative mt-2">
                      <input
                        required
                        type="text"
                        name="vehicleModel"
                        onChange={handleChange}
                        value={state?.vehicleModel}
                        placeholder="    موديل السيارة "
                        className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      />
                    </div>{" "}
                    <div className="flex flex-col space-y-2 w-full mt-4 text-right">
                      <label
                        htmlFor="persons_supported"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        نوع السيارة
                      </label>
                      <Select
                        style={{ fontFamily: "Cairo" }}
                        value={selectedOption}
                        showSearch={true}
                        placeholder={
                          <span
                            className="flex justify-end mr-3"
                            style={{ fontFamily: "Cairo" }}
                          >
                            حدد نوع السيارة
                          </span>
                        }
                        onChange={handleSelect}
                        options={myData}
                        isMulti={false}
                        isClearable={true}
                        primaryColor={"blue"}
                        dropdownStyle={{
                          textAlign: "right",
                          fontFamily: "Cairo",
                        }}
                        className="peer w-full flex justify-end border-0 bg-offWhiteCustom-100  text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      />
                    </div>
                  </div>{" "}
                </div>
              </div>
              {/* <FiDivideCircle /> */}

              <div className="text-left mt-10">
                {isLoading ? (
                  <button
                    type="button"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    اضافة...
                  </button>
                ) : (
                  <button
                    onClick={createNewVehicleModel}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100  py-2 px-5 transition-all duration-300 
                      `}
                  >
                    اضافة
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* {viewOpen && (
        <div className=" inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setViewOpen(false)}
              />
              <h3 className="text-xl font-semibold">
                Vehicle Model Details
              </h3>
            </div>
            <div>
              <div className="flex flex-row justify-end p-5">
                <p>
                  {" "}
                  <p className="font-semibold">
                    Vehicle Make: {editData?.make?.name}
                  </p>
                  <p className="font-semibold">
                    Vehicle Model: {editData?.name}{" "}
                  </p>
                </p>
              
              </div>
            </div>
          </div>
        </div>
      )} */}
      {editOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setEditOpen(false);
                  resetValidationErrors();
                  setSelectedOption("");
                }}
              />
              <h3 className="text-xl font-semibold"> تحديث موديل السيارة</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      موديل السيارة
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="editVehicleModel"
                        onChange={handleChange}
                        value={state?.editVehicleModel}
                        placeholder="موديل السيارة"
                        className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0  bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-col space-y-2 w-full mt-4">
                      <label
                        htmlFor="persons_supported"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        نوع السيارة{" "}
                      </label>
                      <Select
                        style={{ fontFamily: "Cairo" }}
                        value={selectedOption}
                        placeholder={
                          <span
                            className="flex justify-end mr-3"
                            style={{ fontFamily: "Cairo" }}
                          >
                            نوع السيارة
                          </span>
                        }
                        onChange={handleSelect}
                        options={myData}
                        isMultiple={false}
                        isClearable={true}
                        showSearch={true}
                        dropdownStyle={{
                          textAlign: "right",
                          fontFamily: "Cairo",
                        }}
                        primaryColor={"blue"}
                        className="peer  w-full  flex justify-end border-0 bg-offWhiteCustom-100  text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                      />
                    </div>
                  </div>{" "}
                  {validationErrors.editVehicleModel && (
                    <p className="text-red-500 text-sm text-right">
                      {validationErrors.editVehicleModel}
                    </p>
                  )}
                </div>
              </div>
              {/* <FiDivideCircle /> */}

              <div className="text-left mt-10">
                {isLoading ? (
                  <button
                    type="button"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    تحديث...
                  </button>
                ) : (
                  <button
                    onClick={editVehcileMake}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    تحديث
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        title={
          <span className="flex justify-end " style={{ fontFamily: "Cairo" }}>
            هل أنت متأكد من حذف موديل الطوارئ هذا؟
          </span>
        }
        open={deleteModal}
        onOk={deleteVehicleModel}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "red", fontFamily: "Cairo" },
        }}
        cancelButtonProps={{
          style: { fontFamily: "Cairo" },
        }}
        okText="حذف"
        cancelText="أغلق"
      ></Modal>
      <div
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-b-lg overflow-y-scroll no-scrollbar h-screen  `}
      >
        {" "}
        <div className="text-right flex-col bg-white rounded-b-lg p-2 flex justify-end items-right  ml-20  -mt-1">
          <div className="p-4 text-right  bg-gray-100 ">
            <h1 className="text-xl font-semibold m-2">موديل السيارة</h1>
            <div>
              <button
                className="text-white bg-primary-100 rounded-b-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
                type="button"
                onClick={() => {
                  AddNewVehicleModel();
                }}
              >
                + اضافة موديل السيارة جديد
              </button>
            </div>
          </div>

          {isLoading ? (
            renderSkeleton1()
          ) : (
            <table className="w-full justify-center rounded-xl divide-y divide-gray-300 text-right mt-5 bg-white-100">
              <thead>
                <tr>
                  <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {/* Status */}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {/* PIN */}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {/* Driver Last Name */}
                  </th>{" "}
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    نوع السيارة
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    موديل السيارة{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allModels?.map((data, index) => (
                  <tr key={index} className="hover:bg-white">
                    <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <span className="flex gap-5">
                        <span
                          className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                          onClick={() => {
                            setDeleteIncidentID(data?.id);
                            setDeleteModal(true);
                          }}
                        >
                          <BiMessageAltX />
                        </span>
                        <button
                          onClick={() => {
                            handleEdit(data);
                          }}
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                        >
                          <BiEdit />
                        </button>
                        {/* <button
                        onClick={() => {
                          handleView(data);
                        }}
                        className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                      >
                        <BsEye />
                      </button> */}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {/* <span className="">{data?.reason}</span> */}
                    </td>{" "}
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      <span className="">{/* {data?.status} */}</span>
                    </td>{" "}
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      <span className="">{/* {data?.status} */}</span>
                    </td>{" "}
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {data?.make?.name}
                    </td>{" "}
                    <td className="whitespace-nowrap px-3 py-4 text-md">
                      {data?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
