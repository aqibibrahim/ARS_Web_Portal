import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import ModalComponent from "./Common/ModalComponent";
import { BsEye } from "react-icons/bs";
import {
  BiCalendarMinus,
  BiEdit,
  BiMessageAltError,
  BiMessageAltX,
} from "react-icons/bi";
import { BsArrowRightCircle, BsSearch, BsShieldCheck } from "react-icons/bs";
import { Pagination, Skeleton } from "antd";
import { Spin } from "antd";
import noData from "../assets/noData.png";
export default function DriverMain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModal, setisViewModal] = useState(false);
  const [viewData, setViewData] = useState("");
  const [deleteID, setDeleteID] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [updatePINId, setUpdatePINId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allDrivers, setAllDrivers] = useState([""]);
  const [editBit, setEditBit] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    pin: "",
  });
  const [updatePinState, setupdatePinState] = useState({
    newPin: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    newPin: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const itemsPerPage = 10;
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
    setPinModal(false);
    resetPinState();
  };
  const resetPinState = () => {
    setupdatePinState({
      newPin: "",
    });
    // Reset any validation errors
    setValidationErrors({
      newPin: "",
    });
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
  const validatePinForm = () => {
    const errors = {};
    let isValid = true;

    // Validate old PIN

    // Validate new PIN
    if (!updatePinState.newPin.trim()) {
      errors.newPin = "New PIN is required";
      isValid = false;
    } else if (updatePinState.newPin.length !== 6) {
      errors.newPin = "New PIN must be a 6-digit number";
      isValid = false;
    }

    // Additional validation for other PIN rules if needed
    setValidationErrors(errors);

    return { errors, isValid };
  };

  const handlePinChange = (event) => {
    const inputValue = event.target.value;
    const maxLength = 6;

    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
    }
    setupdatePinState({
      ...updatePinState,
      [event.target.name]: event.target.value,
    });
  };
  const updateDriver = async () => {
    try {
      //   if (validateForm()) {
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
        toast.success("تم تسجيل السائق بنجاح", {
          className: "toast-align-right",
        });
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
      //   }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.data?.pin);
    }
  };

  const NewDriverCreation = () => {
    setIsModalOpen(true);
    setEditBit(false);
  };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setViewOpen(false);
  // };
  const GetRecords = async (page = 1, keyword) => {
    try {
      var token = localStorage.getItem("token");
      console.log(token);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${Vars.domain}/drivers`, {
        headers,
        params: {
          page,
          per_page: itemsPerPage,
          search: keyword,
        },
      });

      console.log(response.data.data, "response");
      if (response.status === 200 || response.status === 201) {
        setAllDrivers(response?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };
  useEffect(() => {
    GetRecords(currentPage, searchKeyword);
  }, [deleteModal, isModalOpen, currentPage, searchKeyword]);
  const handleDelete = () => {
    DeleteDriver();
  };
  const handleNewPin = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        new_pin: updatePinState.newPin,
      };

      const response = await axios.patch(
        `${Vars.domain}/drivers/update-pin/${updatePINId}`,
        data,
        {
          headers,
        }
      );

      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        toast.success("تم تحديث دبوس برنامج التشغيل بنجاح", {
          className: "toast-align-right",
        });
        resetPinState();
        setPinModal(false);
        setUpdatePINId("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleEditClick = (data) => {
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
  const handleUpdatePin = (data) => {
    setPinModal(true);
    setUpdatePINId(data?.id);
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
        toast.success("تم حذف برنامج التشغيل بنجاح", {
          className: "toast-align-right",
        });
        setDeleteModal(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setDeleteModal(false);
    }
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
    {
      title: "نوع الطوارئ",
      dataIndex: "emergency_type.name",
      key: "emergency_type",
      align: "right",
    },
  ];
  const renderSkeleton1 = () => {
    return columns.map((column) => (
      <tr className="flex justify-between my-3 px-4 pb-4">
        {columns.map((column, index) => {
          if (index === columns.length - 4) {
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
      <ModalComponent
        visible={isModalOpen}
        handle={setIsModalOpen}
        editData={editData}
        updateDriver={updateDriver}
        editBit={editBit}
      />
      <div
        className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
      >
        {" "}
        <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
          <div className="p-4 text-right  bg-gray-100 ">
            <h1 className="text-xl font-semibold">السائق</h1>
          </div>
          <div className="flex flex-row items-center p-4 space-x-4 bg-gray-100 justify-end  ">
            <div className="flex flex-row space-x-2 "></div>
            <div className="flex flex-1 ml-4 items-center bg-gray-300 rounded-lg px-3 ">
              <BsSearch width={9} height={9} />
              <input
                className="bg-transparent border-0 focus:border-none w-full text-right placeholder:text-sm"
                type="text"
                placeholder="البحث عن السائق"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            <button
              className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm"
              type="button"
              onClick={() => {
                NewDriverCreation();
              }}
            >
              + السائق تسجيل
            </button>
          </div>
          {isLoading ? (
            renderSkeleton1()
          ) : (
            <>
              {allDrivers?.data?.length > 0 ? (
                <>
                  <table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1">
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
                          className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                        >
                          رقم الهاتف
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                        >
                          بريد إلكتروني
                        </th>
                        {/* <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                >
                  PIN
                </th> */}
                        {/* <th
                  scope="col"
                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                >
                  Driver Last Name
                </th> */}
                        <th
                          scope="col"
                          className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                        >
                          اسم السائق
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allDrivers?.data?.map((data, index) => (
                        <tr key={index} className="hover:bg-white">
                          <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <span className="flex gap-5">
                              <button
                                className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                                onClick={() => {
                                  setDeleteID(data?.id);
                                  setDeleteModal(true);
                                }}
                              >
                                <BiMessageAltX />
                              </button>
                              <button
                                onClick={() => handleEditClick(data)}
                                className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                              >
                                <BiEdit />
                              </button>{" "}
                              <button
                                onClick={() => handleUpdatePin(data)}
                                className="text-green-400 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                              >
                                <BsShieldCheck />
                              </button>
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {data?.phone_numbers?.map((phone) => (
                              <div key={phone.id}>{phone.number}</div>
                            ))}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {data?.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs">
                            {data?.first_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-5 ">
                    <Pagination
                      className="flex text-sm text-semi-bold mb-2"
                      style={{ fontFamily: "Cairo" }}
                      current={currentPage}
                      total={allDrivers?.total || 0}
                      pageSize={itemsPerPage}
                      onChange={(page) => setCurrentPage(page)}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} السائق`
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <img src={noData} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        title={
          <div
            style={{ fontFamily: "Cairo", padding: 10 }}
            className="flex justify-end"
          >
            هل أنت متأكد من حذف برنامج التشغيل هذا؟
          </div>
        }
        open={deleteModal}
        onOk={handleDelete}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "red", fontFamily: "Cairo", margin: 10 },
        }}
        cancelButtonProps={{
          style: { fontFamily: "Cairo" },
        }}
        okText="حذف"
        cancelText="أغلق"
      ></Modal>
      <Modal
        title={
          <span
            className="flex justify-end p-5"
            style={{ fontFamily: "Cairo" }}
          >
            تحديث دبوس
          </span>
        }
        open={pinModal}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "green", fontFamily: "Cairo", margin: 10 },
          // Remove type="submit" from the OK button
        }}
        cancelButtonProps={{
          style: { fontFamily: "Cairo" },
        }}
        cancelText="أغلق"
        okText="تحديث "
        onOk={() => {
          // Validate form fields manually
          if (
            !updatePinState.newPin ||
            !/^\d{6}$/.test(updatePinState.newPin)
          ) {
            toast.error("Please enter a six-digit PIN.");
            return;
          }

          // If all validations pass, proceed with form submission
          handleNewPin();
        }}
      >
        <div className="flex flex-col space-y-2 w-full">
          <div style={{ fontFamily: "Cairo", padding: 10 }}>
            <label
              htmlFor="newPin"
              className="block text-sm font-medium leading-6  text-gray-900 text-right"
            >
              دبوس جديد
            </label>
            <div className="relative mt-2">
              <input
                onChange={handlePinChange}
                value={updatePinState.newPin}
                name="newPin"
                type="number"
                placeholder="Enter New PIN"
                className={`peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right ${
                  validationErrors.newPin ? "border-red-500" : ""
                }`}
                required
              />
              {validationErrors.newPin && (
                <span className="text-red-500 text-xs mt-1">
                  {validationErrors.newPin}
                </span>
              )}
              <div
                className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
