import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Vars, getAllEquipment, getToken } from "../helpers/helpers";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";
import { BiMessageAltX, BiEdit } from "react-icons/bi";

import { Toaster, toast } from "sonner";
import { useFormik } from "formik";
export default function Equipment() {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitDone, setSubmitDone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/equipments`, {
            headers: headers,
          })
          .then((response) => {
            setEquipment(response.data.data);
            setLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        toast.error("An error occurred while fetching equipment");
        console.log(e);
      }
    };
    fetchEquipment();
  }, [submitDone]);

  const CreateEquipment = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        name: values.name,
      };
      const createequipment = async () => {
        console.log(JSON);

        try {
          await axios
            .post(`${Vars.domain}/equipments`, JSON, config)
            .then((res) => {
              console.log(res);
              toast.success("Equipment added successfully!");
              setIsModalOpen(false);
              setLoadingMessage(false);
              setSubmitDone(!submitDone);
            });
        } catch (e) {
          toast.error(`${e?.response?.data?.data?.name[0]}`);
          console.log(e);
        }
      };

      createequipment();
    },

    enableReinitialize: true,
  });
  const updateEquipment = useFormik({
    initialValues: {
      id: editingEquipment?.id,
      status: editingEquipment?.status,
      name: editingEquipment?.name,
    },
    onSubmit: (values) => {
      setLoadingMessage(true);
      const JSON = {
        id: editingEquipment?.id,
        status: editingEquipment?.status,
        name: values.name,
      };
      const UpdateEquipment = async () => {
        console.log(JSON);

        try {
          await axios
            .patch(
              `${Vars.domain}/equipments/${editingEquipment?.id}`,
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
          console.log(e);
        }
      };

      UpdateEquipment();
    },

    enableReinitialize: true,
  });

  const handleAddEquipmentClick = () => {
    setIsModalOpen(true);
  };

  const handleEditEquipmentClick = (item) => {
    setEditingEquipment(item);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setIsModalOpen(false);
    setLoadingMessage(false);
    setEditingEquipment(null);
  };

  const AmbulanceDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const result = await axios.delete(
          `${Vars.domain}/equipments/${isDeleteID}`,
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
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-b-lg overflow-y-scroll no-scrollbar h-screen `}
      >
        <Toaster position="bottom-right" richColors />
        <div className="text-right flex-col bg-white rounded-b-lg p-2 flex justify-end items-right  ml-20  -mt-1">
          <div className="p-4 text-right  bg-gray-100 ">
            <h1 className="text-xl font-semibold m-2">Equipment</h1>
            <div>
              <button
                className="text-white bg-primary-100 rounded-b-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
                type="button"
                onClick={handleAddEquipmentClick}
              >
                + Add Equipment
              </button>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                <div className="relative top-[1rem] -left-[21rem] mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
                  <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
                    <BsArrowRightCircle
                      width={9}
                      className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                      onClick={handleModalClose}
                    />
                    <h3 className="text-xl font-semibold">
                      Create New Equipment
                    </h3>
                  </div>
                  <form onSubmit={CreateEquipment.handleSubmit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block sr-only text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        Equipments Name
                      </label>
                      <div className="relative mt-2">
                        <input
                          id="name"
                          name="name"
                          onChange={CreateEquipment.handleChange}
                          value={CreateEquipment.values.name}
                          placeholder="Equipments Name"
                          className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
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
                        submit
                      </button>
                    )}
                  </form>
                </div>
              </div>
            )}
            {isUpdateModalOpen && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                <div className="relative top-[2rem] -left-[21rem] mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
                  <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
                    <BsArrowRightCircle
                      width={9}
                      className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                      onClick={handleModalClose}
                    />
                    <h3 className="text-xl font-semibold">Edit Equipment</h3>
                  </div>
                  <form onSubmit={updateEquipment.handleSubmit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block sr-only text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        Equipments Name
                      </label>
                      <div className="relative mt-2">
                        <input
                          id="name"
                          name="name"
                          onChange={updateEquipment.handleChange}
                          value={updateEquipment.values.name}
                          placeholder="Equipments Name"
                          className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
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
                        submit
                      </button>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white p-2 rounded-lg shadow my-2">
            {loading ? (
              <p className="text-gray-700 text-center">Loading equipment...</p>
            ) : equipment.length == 0 ? (
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
                      Departments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equipment?.map((item, index) => (
                    <tr key={index} className="hover:bg-white">
                      <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <span className="flex gap-5">
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
                            onClick={() => handleEditEquipmentClick(item)}
                            className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                          >
                            <BiEdit />
                          </button>
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          {item?.status}
                        </span>
                      </td>{" "}
                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        {item?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
}
