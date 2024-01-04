import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import ModalComponent from "./Common/ModalComponent";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";

export default function IncidentType() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allIncidentTypes, setAllDriverIncidentTypes] = useState([""]);
  const [viewOpen, setViewOpen] = useState(false);
  const [editData, setEditData] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    IncidentTypeName: "",
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const NewIncidentTypeCreation = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const getIncidentTypes = async () => {
      try {
        var token = localStorage.getItem("token");
        console.log(token);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/incident-type`, {
          headers,
        });

        console.log(response.data.data, "response");
        if (response.status === 200 || response.status === 201) {
          setAllDriverIncidentTypes(response?.data?.data);
          console.log(response);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    getIncidentTypes();
  }, [isModalOpen]);
  const handleEdit = (data) => {
    setViewOpen(true);
    setEditData(data);
  };
  const createNewIncidentType = async () => {
    debugger;
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
      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        toast.success("Incident Type Created Successfuly");
        setIsLoading(false);
        setState("");
        setIsModalOpen(false);
      }
    } catch (error) {
      debugger;
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.data?.pin);
    }
    setIsLoading(false);
  };
  return (
    <>
      <Toaster position="bottom-right" richColors />
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1 -left-[16rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => setIsModalOpen(false)}
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
                      <div
                        className="absolute inset-x-0  bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
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
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
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
          <div className="relative top-1 -left-[16rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
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
              <div className="px-5">
                <p className="text-lg text-right font-semibold">
                  Equipment Details
                </p>
                {editData?.equipments?.length > 0 ? (
                  data?.equipments?.map((equipments) => (
                    <>
                      <div key={equipments.id}>
                        <span
                          className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                          key={equipments.id}
                        >
                          {equipments.status}
                        </span>
                        {equipments.name}
                      </div>
                    </>
                  ))
                ) : (
                  <span className="text-gray-400">No Equipments</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
      >
        {" "}
        <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
          <h1 className="text-2xl font-semibold m-2 mt-3"> Incident Type</h1>
          <div>
            <button
              onClick={() => {
                NewIncidentTypeCreation();
              }}
              className="mt-5 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
            >
              Create New Incident Type +
            </button>
          </div>
          <table className="w-full justify-center rounded-xl divide-y divide-gray-300 text-right mt-5 bg-gray-100">
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
                <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Equipments
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
                        className="text-red-500 flex justify-center hover:cursor-pointer"
                        onClick={() => {
                          // setDeleteID(data?.id);
                          // setDeleteModal(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
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
                        // onClick={() => handleEditClick(data?.name, data?.id)}
                        className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                      >
                        <BsEye />
                      </button>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-md">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      {data?.status}
                    </span>
                  </td>{" "}
                  <td className="whitespace-nowrap px-3 py-4 text-md">
                    {data?.equipments?.length > 0 ? (
                      data?.equipments?.map((equipments) => (
                        <>
                          <div key={equipments.id}>
                            <span
                              className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                              key={equipments.id}
                            >
                              {equipments.status}
                            </span>
                            {equipments.name}
                          </div>
                        </>
                      ))
                    ) : (
                      <span className="text-gray-400">No Equipments</span>
                    )}
                  </td>
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
