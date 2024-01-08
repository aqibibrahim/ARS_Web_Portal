import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import ModalComponent from "./Common/ModalComponent";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";

export default function DriverMain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModal, setisViewModal] = useState(false);
  const [viewData, setViewData] = useState("");
  const [deleteID, setDeleteID] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const [allDrivers, setAllDrivers] = useState([""]);
  const [editBit, setEditBit] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    pin: "",
  });
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    email: "",
    pin: "",
    phoneNumbers: [],
  });
  const handleCancel = () => {
    setDeleteModal(false);
    setDeleteID("");
  };
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate name
    if (!state.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate email
    if (!state.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    // Validate PIN
    if (!state.pin.trim()) {
      errors.pin = "PIN is required";
      isValid = false;
    } else if (state.pin.length !== 6 || !/^\d+$/.test(state.pin)) {
      errors.pin = "PIN must be a 6-digit number";
      isValid = false;
    }

    // Validate phone numbers
    if (phoneNumbers.length === 0) {
      errors.phoneNumbers = "At least one phone number is required";
      isValid = false;
    }

    setValidationErrors(errors);

    return isValid;
  };

  const updateDriver = async () => {
    try {
      if (validateForm()) {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const data = {
          first_name: state.name,
          email: state.email,
          pin: state.pin,
          phone_numbers: phoneNumbers,
        };

        const response = await axios.post(`${Vars.domain}/drivers`, data, {
          headers,
        });

        console.log(response, "res");
        if (response.status === 200 || response.status === 201) {
          toast.success("Driver Created Successfully");
          setState({
            name: "",
            email: "",
            pin: "",
          });
          setPhoneNumbers([]);
          setNewPhoneNumber("");
          handle(false);
        }
        console.log("Role created successfully:", response.data);
      }
    } catch (error) {
      debugger;
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.data?.pin);
    }
  };

  const NewDriverCreation = () => {
    debugger;
    setIsModalOpen(true);
    setEditBit(false);
  };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setViewOpen(false);
  // };
  useEffect(() => {
    const GetRecords = async () => {
      try {
        var token = localStorage.getItem("token");
        console.log(token);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/drivers`, {
          headers,
        });

        console.log(response.data.data, "response");
        if (response.status === 200 || response.status === 201) {
          setAllDrivers(response?.data?.data);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    GetRecords();
  }, [deleteModal]);
  const handleDelete = () => {
    DeleteDriver();
  };
  const handleEditClick = (data) => {
    debugger;
    setIsModalOpen(true);
    setEditBit(true);
    setEditData({
      id: data.id,
      name: data.first_name,
      email: data.email,
      pin: data.pin,
      phoneNumbers: data.phone_numbers.map((phone) => phone.number),
    });
  };
  const handleCancelView = () => {
    setisViewModal(false);
  };

  const DeleteDriver = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(
        `${Vars.domain}/drivers/${deleteID}`,
        {
          headers,
        }
      );
      console.log(response, "res");
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        toast.success("Driver Deleted Successfuly");
        setDeleteModal(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setDeleteModal(false);
    }
  };
  return (
    <>
      {/* <Toaster position="bottom-right" richColors /> */}
      <ModalComponent
        visible={isModalOpen}
        handle={setIsModalOpen}
        editData={editData}
        updateDriver={updateDriver}
        editBit={editBit}
      />
      <div
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
      >
        {" "}
        <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
          <h1 className="text-2xl font-semibold m-2 mt-3"> Driver</h1>
          <div>
            <button
              onClick={() => {
                NewDriverCreation();
              }}
              className="mt-5 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
            >
              Create New Driver +
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
                  Phone Numbers
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                >
                  Email
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
                  Driver Name
                </th>
              </tr>
            </thead>
            <tbody>
              {allDrivers?.map((data, index) => (
                <tr key={index} className="hover:bg-white">
                  <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <span className="flex gap-5">
                      <span
                        className="text-red-500 flex justify-center hover:cursor-pointer"
                        onClick={() => {
                          setDeleteID(data?.id);
                          setDeleteModal(true);
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
                        onClick={() => handleEditClick(data)}
                        className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                      >
                        <BiEdit />
                      </button>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-md">
                    {data?.phone_numbers?.map((phone) => (
                      <div key={phone.id}>{phone.number}</div>
                    ))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-md">
                    {data?.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-md">
                    {data?.first_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title="Are you sure to delete this Driver?"
        open={deleteModal}
        onOk={handleDelete}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "red" },
        }}
        okText="Delete"
      ></Modal>
    </>
  );
}
