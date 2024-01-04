import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Vars,
  getAllDepartments,
  getAllIncidentTypes,
  getToken,
} from "../helpers/helpers";
import StyledInput from "./StyledInput";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";
import MultiSelectDropdown from "./MultiSelectDropdown";

import Select from "react-tailwindcss-select";
import { Toaster, toast } from "sonner";
import { useFormik } from "formik";
export default function Departments() {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
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
          .get(`https://ars.disruptwave.com/api/departments`, {
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
          .get(`https://ars.disruptwave.com/api/incident-type`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(response.data?.data?.map(variant => ({
              label:variant.name, value: variant.id 
           })));
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
      incident_types:"" ,
      total_beds: "",
      occupied_beds_men: "",
      occupied_beds_women: "",
      unoccupied_beds_men: "",
      unoccupied_beds_women:""
     },
    onSubmit: (values) => {
      setLoadingMessage(true)
      const JSON = {
      name: values.name,
      incident_types:options?.map((item) => item.value),
      total_beds: values.total_beds,
      occupied_beds_men: values.occupied_beds_men,
      occupied_beds_women: values.occupied_beds_women,
      unoccupied_beds_men: values.unoccupied_beds_men,
      unoccupied_beds_women:values.unoccupied_beds_women,
      };
      const createequipment = async () => {
        console.log(JSON);
     
        try {
          await axios
            .post(`${Vars.domain}/departments`, JSON, config)
            .then((res) => {
              console.log(res);
              toast.success("Equipment added successfully!");
              setIsModalOpen(false);
              setLoadingMessage(false)
              setSubmitDone(!submitDone);
            });
        } catch (e) {
          setLoadingMessage(false)
          toast.error(`${e?.response?.data?.data?.name[0]}`);
          console.log(e);
        }
      };

      createequipment();
    },

    enableReinitialize: true,
  });

  const updatedepartment = useFormik({
    initialValues: {
      name: editingDepartment?.name,
      total_beds: editingDepartment?.total_beds,
      occupied_beds_men: editingDepartment?.occupied_beds_men,
      occupied_beds_women: editingDepartment?.occupied_beds_women,
      unoccupied_beds_men: editingDepartment?.unoccupied_beds_men,
      unoccupied_beds_women:editingDepartment?.unoccupied_beds_women
     },
    onSubmit: (values) => {
      setLoadingMessage(true)
      const JSON = {
      name: values.name,
      total_beds: values.total_beds,
      occupied_beds_men: values.occupied_beds_men,
      occupied_beds_women: values.occupied_beds_women,
      unoccupied_beds_men: values.unoccupied_beds_men,
      unoccupied_beds_women:values.unoccupied_beds_women,
       
      };
      const UpdateEquipment = async () => {
        console.log(JSON);
     
        try {
          await axios
            .patch(`${Vars.domain}/departments/${editingDepartment?.id}`, JSON, config)
            .then((res) => {
              toast.success("Equipment added successfully!");
              setIsUpdateModalOpen(false);
              setLoadingMessage(false)
              setSubmitDone(!submitDone);
            });
        } catch (e) {
          toast.error("failed");
          setLoadingMessage(false)
          console.log(e);
        }
      };

      UpdateEquipment();
    },

    enableReinitialize: true,
  });

  const handleAddDepartment = () => {
    
    setIsModalOpen(true);
  };

  const handleEditDepartmentClick = (item) => {
    console.log("ITEM: ", item);
    setEditingDepartment(item);
    setIsUpdateModalOpen(true)
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
          `${Vars.domain}/departments/${isDeleteID}`,
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
  return (<>
    <div
      className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
    > <Toaster position="bottom-right" richColors />
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
              <div className="relative top-0 mx-auto p-5 -left-[15rem] border w-[650px] shadow-lg rounded-md bg-white">
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
                <form  onSubmit={CreateDepartments.handleSubmit}>
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
                  </div> <div>
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
                  </div> <div>
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

                    <Select
                      value={options}
                      placeholder="Select"
                      onChange={(e) => handleChange(e)}
                      options={myData}
                      isMultiple={true}
                      isClearable={true}
                      primaryColor={"blue"}
                      className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                    />
                  </div>
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

                   {loadingMessage ?<button
                    type="button"
                    className="text-white bg-primary-100 w-60 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                  >
                    loading...
                  </button>:<button
                    type="submit"
                    className="text-white bg-primary-100 rounded-md w-60 border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                  >
                    Add Department
                  </button>}
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
                  <h3 className="text-xl font-semibold">
                    Update Department
                  </h3>
                </div>
                <form  onSubmit={updatedepartment.handleSubmit}>
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
                        onChange={updatedepartment.handleChange}
                        value={updatedepartment.values.total_beds}
                        placeholder="Total Beds"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div> <div>
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
                        onChange={updatedepartment.handleChange}
                        value={updatedepartment.values.occupied_beds_men}
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
                        onChange={updatedepartment.handleChange}
                        value={updatedepartment.values.occupied_beds_women}
                        placeholder="Occupied Beds Women"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div> <div>
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
                        onChange={updatedepartment.handleChange}
                        value={updatedepartment.values.unoccupied_beds_men}
                        placeholder="Unoccupied Beds Men"
                        className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div> <div>
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
                       
                        onChange={updatedepartment.handleChange}
                        value={updatedepartment.values.unoccupied_beds_women}
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

                   {loadingMessage ?<button
                    type="button"
                    className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                  >
                    loading...
                  </button>:<button
                    type="submit"
                    className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
                  >
                    Update
                  </button>}

                </form>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-2 rounded-lg shadow my-2">
          {loading ? (
            <p className="text-gray-700 text-center">Loading departments...</p>
          ) :  (
            <ul className="list-none">
              {departments.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-gray-300 last:border-0 p-2 flex justify-between items-center"
                ><span className="flex items-center justify-center gap-5">
                <span
                  className="text-red-500 flex justify-center cursor-pointer hover:text-red-600"
                  onClick={() => {
                    setDelete(true);
                    setDeleteID(item?.id);
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
                    className="text-white bg-blue-500 rounded-md border-blue-500 hover:border-blue-500 py-1 px-4 transition-all duration-300 hover:bg-white hover:text-blue-500 mr-2"
                    type="button"
                    onClick={() => handleEditDepartmentClick(item)}
                  >
                    Edit
                  </button></span>
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
}
