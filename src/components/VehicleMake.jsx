import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import ModalComponent from "./Common/ModalComponent";
import { BsEye } from "react-icons/bs";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";

export default function VehicleMake() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMakes, setAllMakes] = useState([""]);
  const [allModels, setAllModels] = useState([""]);

  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editIncidentType, setEditIncidentType] = useState("");
  const [editIncidentID, setEditIncidentID] = useState("");
  const [deleteIncidentID, setDeleteIncidentID] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    vehicleMake: "",
    editVehicleMake: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    vehicleMake: "",
    editVehicleMake: "",
  });

  // const validateForm = () => {
  //     const errors = {};
  //     let isValid = true;
  //     if (!state.vehicleMake) {
  //         errors.vehicleMake = "Vehicle Make is required";
  //         isValid = false;
  //     } else if (!state.editVehicleMake) {
  //         errors.editVehicleMake = "Vehicle Make is required";
  //         isValid = false;
  //     }
  //     setValidationErrors(errors);

  //     return isValid;
  // };

  const resetValidationErrors = () => {
    setValidationErrors({
      vehicleMake: "",
      editVehicleMake: "",
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

  const AddNewVehicleMake = () => {
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
          setAllMakes(response?.data?.data);
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };
    getAllMakes();
  }, [isModalOpen, editOpen, deleteModal]);

  const handleView = (data) => {
    setViewOpen(true);
    setEditData(data);
  };
  const handleEdit = (data) => {
    setEditOpen(true);
    setState({
      editVehicleMake: data?.name,
    });
    setEditIncidentID(data?.id);
  };
  const createNewVehicleMake = async () => {
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
        name: state?.vehicleMake,
      };

      const response = await axios.post(`${Vars.domain}/vehicle-make`, data, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Vehicle Make Added Successfully");
        setIsLoading(false);
        setState({ vehicleMake: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.data?.name[0]);
    }

    setIsLoading(false);
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
        name: state.editVehicleMake, // Use state.editreason instead of editIncidentType
      };

      const response = await axios.patch(
        `${Vars.domain}/vehicle-make/${editIncidentID}`,
        data,
        {
          headers,
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Vehicle Make Updated Successfully");
        setIsLoading(false);
        setEditIncidentID("");
        setEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating Incident Type:", error);
      toast.error(error?.response?.data?.message);
    }

    setIsLoading(false);
  };

  const deleteVehicleMake = async () => {
    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `${Vars.domain}/vehicle-make/${deleteIncidentID}`,
        {
          headers,
        }
      );
      if (response.status === 204 || response.status === 201) {
        toast.success("Vehicle Make Deleted Successfuly");
        setIsLoading(false);
        setDeleteIncidentID("");
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting Vehicle Make :", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };
  const isSubmitDisabled = () => {
    return !state?.vehicleMake;
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setIsModalOpen(false);
                  resetValidationErrors();
                  setState({ vehicleMake: "" });
                }}
              />
              <h3 className="text-xl font-semibold">تسجيل نوع السيارة </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      نوع السيارة
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="vehicleMake"
                        onChange={handleChange}
                        value={state?.vehicleMake}
                        placeholder="نوع السيارة"
                        className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
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
                    تسجيل ...
                  </button>
                ) : (
                  <button
                    onClick={createNewVehicleMake}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100  py-2 px-5 transition-all duration-300 
                      `}
                  >
                    تسجيل
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* {viewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setViewOpen(false)}
              />
              <h3 className="text-xl font-semibold">
                Vehicle Make Details
              </h3>
            </div>
            <div>
              <div className="flex flex-row justify-end p-5">
                <p>
                  {" "}
                  <span className="font-semibold">Vehicle Make:</span>{" "}
                  {editData?.name}
                </p>
               
              </div>
            </div>
          </div>
        </div>
      )} */}
      {editOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setEditOpen(false);
                  resetValidationErrors();
                }}
              />
              <h3 className="text-xl font-semibold">تحديث نوع السيارة</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      نوع السيارة
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="editVehicleMake"
                        onChange={handleChange}
                        value={state?.editVehicleMake}
                        placeholder="نوع السيارة"
                        className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0  bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>{" "}
                  {validationErrors.editVehicleMake && (
                    <p className="text-red-500 text-sm text-right">
                      {validationErrors.editVehicleMake}
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
                    تحديث ...
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
            هل أنت متأكد من حذف نوع السيارة هذا؟
          </span>
        }
        open={deleteModal}
        onOk={deleteVehicleMake}
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
            <h1 className="text-xl font-semibold m-2">نوع السيارة</h1>
            <div>
              <button
                className="text-white bg-primary-100 rounded-b-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
                type="button"
                onClick={() => {
                  AddNewVehicleMake();
                }}
              >
                + اضافة نوع سيارة جديد
              </button>
            </div>
          </div>
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
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  نوع السيارة
                </th>
              </tr>
            </thead>
            <tbody>
              {allMakes?.map((data, index) => (
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
                    {data?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
