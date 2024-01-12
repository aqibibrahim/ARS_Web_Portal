import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useFormik } from "formik";
import { Select as AntSelect } from "antd";
import { BiMessageAltX } from "react-icons/bi";

const DepartmentsFiles = () => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { Option } = AntSelect;
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitDone, setSubmitDone] = useState(false);
  const [editOptions, setEditOptions] = useState([]);
  const [options, setOptions] = useState(null);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [myData, setMyData] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const handleChange = (value) => {
    setOptions(value);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/departments`, {
            headers: headers,
          })
          .then((response) => {
            setDepartments(response.data.data);
            setLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        toast.error("An error occurred while fetching departments");
        console.log(e);
      }
    };
    fetchDepartments();
  }, [submitDone]);

  useEffect(() => {
    const fetchAllIncidents = async () => {
      try {
        await axios
          .get(`${window.$BackEndUrl}/incident-type`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label: variant.name,
                value: variant.id,
              }))
            );
            console.log(response?.data?.data);
          });
      } catch (e) {
        toast.error("An error occurred while fetching incidenttypes");
        console.log(e);
      }
    };
    fetchAllIncidents();
  }, []);

  const CreateDepartments = useFormik({
    initialValues: {
      name: "",
      incident_types: "",
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        name: values.name,
        incident_types: options?.map((item) => item.value),
      };
      const UploadDepartments = async () => {
        console.log(JSON);

        try {
          await axios
            .post(`${window.$BackEndUrl}/departments`, JSON, config)
            .then((res) => {
              console.log(res);
              toast.success("Equipment added successfully!");
              setIsModalOpen(false);
              setLoadingMessage(false);
              setSubmitDone(!submitDone);
            });
        } catch (e) {
          setLoadingMessage(false);
          toast.error(`${e?.response?.data?.data?.name[0]}`);
          console.log(e);
        }
      };

      UploadDepartments();
    },

    enableReinitialize: true,
  });

  const updatedepartment = useFormik({
    initialValues: {
      name: editingDepartment?.name,
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        name: values.name,
      };
      const UpdateDepartments = async () => {
        console.log(JSON);

        try {
          await axios
            .patch(
              `${window.$BackEndUrl}/departments/${editingDepartment?.id}`,
              JSON,
              config
            )
            .then((res) => {
              toast.success("Equipment added successfully!");
              setIsUpdateModalOpen(false);
              setLoadingMessage(false);
              setSubmitDone(!submitDone);
            });
        } catch (e) {
          toast.error("failed");
          setLoadingMessage(false);
          console.log(e);
        }
      };

      UpdateDepartments();
    },

    enableReinitialize: true,
  });

  const handleAddDepartment = () => {
    setIsModalOpen(true);
  };

  const handleEditDepartmentClick = (item) => {
    console.log("ITEM: ", item);
    setEditingDepartment(item);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const AmbulanceDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const result = await axios.delete(
          `${window.$BackEndUrl}/departments/${isDeleteID}`,
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
  return (
    <>
      <div
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
      >
        {" "}
        <Toaster position="bottom-right" richColors />
        <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
          <h1 className="text-2xl font-semibold m-2">Departments</h1>
          <div>
            <button
              className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
              type="button"
              onClick={handleAddDepartment}
            >
              Add Department
            </button>

            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                <div className="relative top-0 mx-auto p-5 -left-[20rem] border w-[450px] shadow-lg rounded-md bg-white">
                  <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
                    <BsArrowRightCircle
                      width={9}
                      className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                      onClick={handleModalClose}
                    />
                    <h3 className="text-xl font-semibold">
                      Create New Department
                    </h3>
                  </div>
                  <form onSubmit={CreateDepartments.handleSubmit}>
                    <div className="flex flex-row justify-between gap-4 mb-4">
                      <div className="flex flex-col space-y-2 w-full">
                        <div>
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
                        </div>

                        <div>
                          <label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                            Incident Type
                          </label>

                          <AntSelect
                            value={options}
                            placeholder="Select"
                            onChange={(value) => handleChange(value)}
                            mode="multiple"
                            allowClear={true}
                            showSearch={true}
                            className="w-full"
                            filterOption={(input, option) =>
                              option?.label
                                ?.toLowerCase()
                                .indexOf(input?.toLowerCase()) >= 0
                            }
                          >
                            {myData.map((item) => (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            ))}
                          </AntSelect>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start mt-8">
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

            {isUpdateModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                <div className="relative top-0 mx-auto p-5 -left-[21.5rem] border w-1/3 shadow-lg rounded-md bg-white">
                  <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
                    <BsArrowRightCircle
                      width={9}
                      className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                      onClick={handleModalClose}
                    />
                    <h3 className="text-xl font-semibold">Update Department</h3>
                  </div>
                  <form onSubmit={updatedepartment.handleSubmit}>
                    <div>
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
                          onChange={updatedepartment.handleChange}
                          value={updatedepartment.values.name}
                          placeholder="Department Name"
                          className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="flex mt-8 justify-start">
                      {loadingMessage ? (
                        <button
                          type="button"
                          className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                        >
                          loading...
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-100 p-2 rounded-lg shadow my-2">
            {loading ? (
              <p className="text-gray-700 text-center">
                Loading departments...
              </p>
            ) : (
              <ul className="list-none">
                {departments.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-gray-300 last:border-0 p-2 flex justify-between items-center"
                  >
                    <span className="flex items-center justify-center gap-5">
                      <span
                        className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                        onClick={() => {
                          setDelete(true);
                          setDeleteID(item?.id);
                        }}
                      >
                        <BiMessageAltX />
                      </span>
                      <button
                        className="text-white bg-blue-500 rounded-md border-blue-500 hover:border-blue-500 py-1 px-4 transition-all duration-300 hover:bg-white hover:text-blue-500 mr-2"
                        type="button"
                        onClick={() => handleEditDepartmentClick(item)}
                      >
                        Edit
                      </button>
                    </span>
                    <div
                      className={`px-2 py-1 rounded text-white ${
                        item.status === "Active" ? "bg-green-300" : "bg-red-500"
                      }`}
                    >
                      {item.status}
                    </div>
                    <div className="text-gray-800 w-full">
                      {item.incident_types.name}
                    </div>
                    <div className="text-gray-800 w-full">{item.name}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
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
    </>
  );
};

export default DepartmentsFiles;
