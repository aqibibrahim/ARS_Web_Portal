import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useFormik } from "formik";
import { Select as AntSelect } from "antd";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { Spin, Skeleton } from "antd";
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
  }, [submitDone, isModalOpen]);

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
      incident_types: [],
    },
    onSubmit: (values, { resetForm }) => {
      setLoadingMessage(true);
      const JSON = {
        name: values.name,
        incident_types: options?.map((item) => item),
      };
      const UploadDepartments = async () => {
        console.log(JSON);

        try {
          const res = await axios.post(
            `${window.$BackEndUrl}/departments`,
            JSON,
            config
          );

          if (res.status === 200 || res.status === 201) {
            console.log(res);
            toast.success("Equipment added successfully!");
            setIsModalOpen(false);
            setLoadingMessage(false);
            setSubmitDone(!submitDone);
            resetForm();
            setOptions(null);
          } else {
            console.error(`Unexpected response status: ${res.status}`);
            // Handle unexpected response status here
          }
        } catch (e) {
          setLoadingMessage(false);
          toast.error(`${e?.response?.data?.data?.name[0]}`);
          console.error(e);
        }
      };
      UploadDepartments();
    },
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
              toast.success("Equipment Updated successfully!");
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
    setEditingDepartment(item);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsUpdateModalOpen(false);
    CreateDepartments.resetForm();
    setOptions(null);
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

  const isSubmitDisabled = () => {
    const { name } = CreateDepartments.values;

    return !name || !options?.length > 0;
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
      <div
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-b-lg overflow-y-scroll no-scrollbar h-screen  `}
      >
        {" "}
        <Toaster position="bottom-right" richColors />
        <div className="text-right flex-col bg-white rounded-b-lg p-2 flex justify-end items-right  ml-20  -mt-1">
          <div className="p-4 text-right  bg-gray-100 ">
            <h1 className="text-xl font-semibold m-2">الاقسام</h1>
            <div>
              <button
                className="text-white bg-primary-100 rounded-b-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
                type="button"
                onClick={handleAddDepartment}
              >
                + اضافة قسم
              </button>
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-0 mx-auto p-5  border w-[450px] shadow-lg rounded-md bg-white">
                <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
                  <BsArrowRightCircle
                    width={9}
                    className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                    onClick={() => {
                      handleModalClose();
                      CreateDepartments.resetForm();
                    }}
                  />
                  <h3 className="text-xl font-semibold">اضافة قسم جديد </h3>
                </div>
                <form onSubmit={CreateDepartments.handleSubmit}>
                  <div className="flex flex-row justify-between gap-4 mb-4">
                    <div className="flex flex-col space-y-2 w-full">
                      <div>
                        <label
                          htmlFor="name"
                          className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                        >
                          اسم القسم{" "}
                        </label>
                        <div className="relative mt-2">
                          <input
                            id="name"
                            name="name"
                            onChange={CreateDepartments.handleChange}
                            value={CreateDepartments.values.name}
                            placeholder="اسم القسم"
                            className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                          نوع الحادث{" "}
                        </label>

                        <AntSelect
                          value={options}
                          placeholder={<span className="mr-4">نوع الحادث</span>}
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
                          style={{ fontFamily: "Cairo" }}
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
                        اضافة قسم...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={`text-white bg-primary-100 rounded-md w-60 border-2 border-primary-100  py-2 px-5 transition-all duration-300`}
                      >
                        اضافة قسم
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
          {isUpdateModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-0 mx-auto p-5  border w-1/3 shadow-lg rounded-md bg-white">
                <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
                  <BsArrowRightCircle
                    width={9}
                    className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                    onClick={handleModalClose}
                  />
                  <h3 className="text-xl font-semibold">تحديث الاقسام</h3>
                </div>
                <form onSubmit={updatedepartment.handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block  text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      اسم القسم
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
                        تحديث ...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                      >
                        تحديث
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="bg-white p-2 rounded-lg shadow my-2">
            {loading ? (
              renderSkeleton1()
            ) : (
              <>
                {" "}
                <table className="w-full justify-center rounded-xl divide-y divide-gray-300 text-right mt-5 bg-white-100">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="relative py-3 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        حالة
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
                        القسم{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments?.map((data, index) => (
                      <tr key={index} className="hover:bg-white">
                        <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <span className="flex gap-5">
                            <span
                              className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                              onClick={() => {
                                setDelete(true);
                                setDeleteID(data?.id);
                              }}
                            >
                              <BiMessageAltX />
                            </span>
                            <button
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2 mr-4"
                              type="button"
                              onClick={() => handleEditDepartmentClick(data)}
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
                {/* <ul className="list-none">
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
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2 mr-4"
                          type="button"
                          onClick={() => handleEditDepartmentClick(item)}
                        >
                          <BiEdit />
                        </button>
                      </span>
                      <div
                        className={`px-2 py-1 rounded text-white ${
                          item.status === "Active"
                            ? "bg-green-300"
                            : "bg-red-500"
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
                </ul> */}
              </>
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
                          هل أنت متأكد من حذف القسم هذا؟
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
                        حذف
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
