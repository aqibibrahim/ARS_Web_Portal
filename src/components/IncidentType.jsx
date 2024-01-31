import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import ModalComponent from "./Common/ModalComponent";
import { BsEye } from "react-icons/bs";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";
import { Spin } from "antd";

export default function IncidentType() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allIncidentTypes, setAllDriverIncidentTypes] = useState([""]);
  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editIncidentType, setEditIncidentType] = useState("");
  const [editIncidentID, setEditIncidentID] = useState("");
  const [deleteIncidentID, setDeleteIncidentID] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    IncidentTypeName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    IncidentTypeName: "",
    editIncidentType: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!state.IncidentTypeName.trim()) {
      errors.IncidentTypeName = "Incident Type Name is required";
      isValid = false;
    }

    setValidationErrors(errors);

    return isValid;
  };
  const resetValidationErrors = () => {
    setValidationErrors({
      IncidentTypeName: "",
      editIncidentType: "",
    });
  };
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
    setEditIncidentType(event.target.value);
    setValidationErrors({ ...validationErrors, [event.target.name]: "" });
  };
  const NewIncidentTypeCreation = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setDeleteModal(false);
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
          setAllDriverIncidentTypes(response?.data?.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting role:", error);
      }
    };
    getIncidentTypes();
  }, [isModalOpen, editOpen, deleteModal]);
  const handleView = (data) => {
    setViewOpen(true);
    setEditData(data);
  };
  const handleEdit = (data) => {
    setEditOpen(true);
    setEditIncidentType(data?.name);
    setEditIncidentID(data?.id);
  };
  const createNewIncidentType = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const data = {
        name: state?.IncidentTypeName,
      };

      const response = await axios.post(`${Vars.domain}/incident-type`, data, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Incident Type Created Successfully");
        setIsLoading(false);
        setState({ IncidentTypeName: "" });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.message);
    }

    setIsLoading(false);
  };

  const editNewIncidentType = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const data = {
        name: editIncidentType,
      };

      const response = await axios.patch(
        `${Vars.domain}/incident-type/${editIncidentID}`,
        data,
        {
          headers,
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Incident Type Updated Successfully");
        setIsLoading(false);
        setEditIncidentType("");
        setEditIncidentID("");
        setEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating Incident Type:", error);
      toast.error(error?.response?.data?.message);
    }

    setIsLoading(false);
  };

  const deleteIncidentType = async () => {
    setIsLoading(true);

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `${Vars.domain}/incident-type/${deleteIncidentID}`,
        {
          headers,
        }
      );
      if (response.status === 204 || response.status === 201) {
        toast.success("Incident Type Deleted Successfuly");
        setIsLoading(false);
        setDeleteIncidentID("");
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting Incident Type:", error);
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };
  const isSubmitDisabled = () => {
    return !state?.IncidentTypeName;
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
                  setState({ IncidentTypeName: "" });
                }}
              />
              <h3 className="text-xl font-semibold">
                Create New Incident Type
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Name:
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="IncidentTypeName"
                        onChange={handleChange}
                        value={state?.IncidentTypeName}
                        placeholder="Name of Incident Type"
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
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={createNewIncidentType}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100  py-2 px-5 transition-all duration-300 `}
                  >
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {viewOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="mt-5 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setViewOpen(false)}
              />
              <h3 className="text-xl font-semibold">
                Incident Type Details
                <span className="text-lime-600 ml-2">{editData?.status}</span>
              </h3>
            </div>
            <div>
              <div className="flex flex-row justify-end p-5">
                <p>
                  {" "}
                  <span className="font-semibold">Name:</span> {editData?.name}
                </p>
                {/* <p>
                  <span className="font-semibold">Model:</span>{" "}
                  {selectedAmbulance?.model}
                </p>
                <p>
                  <span className="font-semibold">Plate#:</span>{" "}
                  {selectedAmbulance?.plate_no}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      )}
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
              <h3 className="text-xl font-semibold">Edit Incident Type</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="persons_supported"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Name:
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="IncidentTypeName"
                        onChange={handleChange}
                        value={editIncidentType}
                        placeholder="Name of Incident Type"
                        className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0  bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>{" "}
                  {validationErrors.IncidentTypeName && (
                    <p className="text-red-500 text-sm text-right">
                      {validationErrors.IncidentTypeName}
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
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={editNewIncidentType}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Are you sure to delete this Incident Type?"
        open={deleteModal}
        onOk={deleteIncidentType}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "red" },
        }}
        okText="Delete"
      ></Modal>
      <div
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-b-lg overflow-y-scroll no-scrollbar h-screen  `}
      >
        {" "}
        <div className="text-right flex-col bg-white rounded-b-lg p-2 flex justify-end items-right  ml-20  -mt-1">
          <div className="p-4 text-right  bg-gray-100 ">
            <h1 className="text-xl font-semibold m-2">Incident Types</h1>
            <div>
              <button
                className="text-white bg-primary-100 rounded-b-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
                type="button"
                onClick={() => {
                  NewIncidentTypeCreation();
                }}
              >
                + Create New Incident Type
              </button>
            </div>
          </div>
          {loading ? (
            <p className="text-center justify-center flex m-auto p-32">
              <Spin size="large" />
            </p>
          ) : allIncidentTypes.length == 0 ? (
            <p className="text-center  text-primary-100">No data available</p>
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
                    Status
                  </th>

                  {/* <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  PIN
                </th> */}
                  {/* <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Driver Last Name
                </th> */}
                  <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Incident Type Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {allIncidentTypes?.map((data, index) => (
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
                        <button
                          onClick={() => {
                            handleView(data);
                          }}
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                        >
                          <BsEye />
                        </button>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        {data?.status}
                      </span>
                    </td>{" "}
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {data?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}{" "}
        </div>
      </div>
    </>
  );
}
