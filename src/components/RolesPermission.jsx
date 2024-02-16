import React, { useState, useEffect } from "react";
import { Modal, Tabs } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import InputMask from "react-input-mask";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { Spin, Skeleton } from "antd";
import {
  BsArrowRightCircle,
  BsEye,
  BsSearch,
  BsEyeSlash,
} from "react-icons/bs";
import { Select } from "antd";
import noData from "../assets/noData.png";

const { TabPane } = Tabs;
export default function RolesPermission() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [permissionModal, setPermissionModal] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [roleName, setRoleName] = useState("");
  const [allRoles, setAllRoles] = useState([""]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [deleteID, setDeleteID] = useState("");
  const [editID, setEditID] = useState("");
  const [editUserID, setEditUserID] = useState("");
  const [activeTab, setActiveTab] = useState("User");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    designation: "",
  });
  const [roleID, setRoleID] = useState("");
  const [editRoleID, setEditRoleID] = useState("");

  const [editUserData, setEditUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_numbers: [],
    designation: "",
  });

  const [editName, setEditName] = useState("");
  const handleAddPhoneNumber = () => {
    if (newPhoneNumber.trim() !== "") {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
      setNewPhoneNumber("");
    }
  };

  const handleRemovePhoneNumber = (index) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhoneNumbers);
  };
  const [permissionModalData, setPermissionModalData] = useState([
    // Initial state of your data
    // Example: { id: 1, moduleName: 'Module 1', isView: false, isAdd: false, isEdit: false, isDelete: false },
    // ...
  ]);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const handleCheckboxChange = (privilege_id, type) => {
    // Assuming you have a function to update the permissionModalData state
    setPermissionModalData((prevData) =>
      prevData.map((module) => {
        return module.privilege_id === privilege_id
          ? { ...module, [`${type}`]: !module[`${type}`] }
          : module;
      })
    );
  };
  const handleAssignPermissions = async () => {
    const permissionArray = permissionModalData.map((module) => ({
      privilege_id: module.privilege_id,
      is_view: module.isView ? 1 : 0,
      is_add: module.isAdd ? 1 : 0,
      is_edit: module.isEdit ? 1 : 0,
      is_delete: module.isDelete ? 1 : 0,
    }));

    const uniquePrivilegeIds = [
      ...new Set(permissionArray.map((module) => module.privilege_id)),
    ];

    // Creating the final structure
    const finalData = {
      privilege_id: uniquePrivilegeIds,
      is_view: uniquePrivilegeIds.map(
        (id) =>
          permissionArray.find((module) => module.privilege_id === id)
            ?.is_view || 0
      ),
      is_add: uniquePrivilegeIds.map(
        (id) =>
          permissionArray.find((module) => module.privilege_id === id)
            ?.is_add || 0
      ),
      is_edit: uniquePrivilegeIds.map(
        (id) =>
          permissionArray.find((module) => module.privilege_id === id)
            ?.is_edit || 0
      ),
      is_delete: uniquePrivilegeIds.map(
        (id) =>
          permissionArray.find((module) => module.privilege_id === id)
            ?.is_delete || 0
      ),
    };

    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.patch(
        `${Vars.domain}/role-permission/${editID}`,
        finalData,
        {
          headers,
        }
      );
      if (response.status === 200 || response.status === 201) {
        setPermissionModal(false);
        toast.success("تم تحديث الدور بنجاح", {
          className: "toast-align-right",
        });
      }
    } catch (error) {
      toast.error("هناك خطأ ما", {
        className: "toast-align-right",
      });
      setPermissionModal(false);
    }
  };
  const handleRoleChange = (e) => {
    const selectedRoleId = e;
    // setState((prevState) => ({
    //   ...prevState,
    //   role: selectedRoleId,
    // }));
    setRoleID(selectedRoleId);
  };
  const toastErrorMessages = (errors) => {
    Object.keys(errors).forEach((field) => {
      const messages = errors[field];
      messages.forEach((message) => {
        toast.error(
          `${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`
        );
      });
    });
  };

  const createNewUser = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        first_name: state?.first_name,
        last_name: state?.last_name,
        email: state?.email,
        password: state?.password,
        phone_numbers: phoneNumbers,
        designation: state?.designation,
        role_id: roleID,
      };
      let response;
      if (editFlag) {
        const Editdata = {
          first_name: state?.first_name,
          last_name: state?.last_name,
          email: state?.email,
          password: state?.password,
          phone_numbers: phoneNumbers,
          designation: state?.designation,
          role_id: roleID?.value ? roleID?.value : roleID,
        };
        const userId = editUserData.id; // Assuming you have the user ID in editUserData
        response = await axios.patch(
          `${Vars.domain}/users/${editUserID}`,
          Editdata,
          {
            headers,
          }
        );
      } else {
        // If editFlag is false, make a POST request
        response = await axios.post(`${Vars.domain}/users`, data, {
          headers,
        });
      }

      if (response.status === 200 || response.status === 201) {
        {
          editFlag
            ? toast.success("تم تحديث المستخدم بنجاح", {
                className: "toast-align-right",
              })
            : toast.success("تم تسجيل المستخدم بنجاح", {
                className: "toast-align-right",
              });
        }
        setPhoneNumbers([]);
        setIsModalOpen(false);
        setEditUserModal(false);
        setIsLoading(false);
        handleCancel();
        setState({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          designation: "",
          role: "",
        });
      }
    } catch (error) {
      toastErrorMessages(error.response.data.data);
      // const errorMessage =
      //   error.response?.data?.data?.email || "An error occurred";
      // toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const GetRecords = async () => {
      try {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/roles`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          // setAllRoles(response?.data?.data);
          setAllRoles(
            response.data?.data?.map((variant) => ({
              label: variant.name,
              value: variant.id,
            }))
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    GetRecords();
  }, [isModalOpen, deleteModal, editModal]);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/users`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          setAllUsers(response?.data?.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    GetUsers();
  }, [isModalOpen, deleteUserModal, isUserModalOpen]);

  const NewRole = () => {
    setState({});
    setIsModalOpen(true);
    setRoleName("");
  };
  const NewUser = () => {
    setIsUserModalOpen(true);
    setRoleName("");
  };

  const handleNewRole = () => {
    createNewRole(roleName);
  };
  const handleEditClick = (name, id) => {
    setEditName(name);
    setEditID(id);
    setEditModal(true);
  };
  const handleUserEdit = (data) => {
    setEditUserID(data?.id);
    setIsUserModalOpen(true);
    setEditUserModal(true);
    setEditFlag(true);
    setRoleID({ label: data?.role?.name, value: data?.role?.id });
    setState({
      id: data?.id,
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      email: data?.email || "",
      password: "", // You may want to initialize this as empty or handle it differently
      designation: data?.designation || "",
    });
    setPhoneNumbers(data.phone_numbers.map((phone) => phone.number) || []);
  };

  const handlePermissionClick = (id) => {
    // setRoleID(id)
    getPermissions(id);
    setPermissionModal(true);
  };
  const handleEdit = () => {
    editRole(editName, editID);
  };
  const handleDelete = () => {
    DeleteRole();
  };
  const handleDeleteUser = () => {
    DeleteUser();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDeleteModal(false);
    setEditModal(false);
    setPermissionModal(false);
    setEditName("");
    setIsUserModalOpen(false);
    setPhoneNumbers([]);
    setEditFlag(false);
    setDeleteUserModal(false);
    setRoleID("");
    setState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      designation: "",
    });
  };

  const DeleteRole = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${Vars.domain}/roles/${deleteID}`, {
        headers,
      });
      if (response.status === 200 || response.status === 204) {
        setDeleteModal(false);
        toast.success("تم حذف الدور بنجاح", {
          className: "toast-align-right",
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Something went wrong");
      setDeleteModal(false);
    }
  };
  const DeleteUser = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(`${Vars.domain}/users/${deleteID}`, {
        headers,
      });
      if (response.status === 200 || response.status === 204) {
        setDeleteUserModal(false);
        toast.success("تم حذف المستخدم بنجاح", {
          className: "toast-align-right",
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Something went wrong");
      setDeleteUserModal(false);
    }
  };
  const createNewRole = async (role) => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        name: role,
      };
      const response = await axios.post(`${Vars.domain}/roles`, data, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        toast.success("تم تسجيل الدور بنجاح", {
          className: "toast-align-right",
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };
  const editRole = async (role, id) => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const data = {
        name: role,
      };
      const response = await axios.patch(`${Vars.domain}/roles/${id}`, data, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        setEditModal(false);
        toast.success("تم تحديث الدور بنجاح", {
          className: "toast-align-right",
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Something Went Wrong");
      setEditModal(false);
    }
  };

  const getPermissions = async (id) => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${Vars.domain}/role-permission/${id}`, {
        headers,
      });
      if (response.status === 200 || response.status === 201) {
        setPermissionModals(response.data.data);
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Something Went Wrong");
    }
  };

  const setPermissionModals = (data) => {
    const moduleData = data.privileges.map((privilege) => {
      return {
        privilege_id: privilege.id,
        moduleName: privilege.module.name,
        isView: privilege.is_view,
        isAdd: privilege.is_add,
        isEdit: privilege.is_edit,
        isDelete: privilege.is_delete,
      };
    });

    setPermissionModalData(moduleData);
  };
  const Tab = ({ selected, title, onClick }) => {
    return (
      <button
        className={`px-4 py-2 transition-colors duration-150 ${
          selected
            ? "bg-blue-500 text-white"
            : "bg-white text-black hover:bg-gray-200 "
        } focus:outline-none`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  };
  const isSubmitRoleDisabled = () => {
    return !roleName;
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordChange = (event) => {
    const inputValue = event.target.value;
    const maxLength = 6;

    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
    }

    setState({ ...state, [event.target.name]: event.target.value });
  };
  const isSubmitDisabled = () => {
    return (
      state?.password.length !== 6 ||
      !state?.first_name ||
      !state?.email ||
      !state?.designation ||
      !state?.role ||
      !phoneNumbers?.length > 0
    );
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
    {
      title: "نوع الحادث",
      dataIndex: "incident_type.name",
      key: "incident_type",
      align: "right",
    },
    {
      title: "تفاصيل المتصل",
      dataIndex: "informer.name",
      key: "informer_name",
      align: "right",
    },
  ];
  const renderSkeleton1 = () => {
    return columns.map((column) => (
      <tr className="flex justify-between my-3 px-4 pb-4">
        {columns.map((column, index) => {
          if (index === columns.length - 6) {
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
      {" "}
      {/* Create Role Modal */}
      <Toaster position="bottom-right" richColors />
      <div
        className={`w-full bg-grayBg-100  transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
      >
        {/* <Tabs defaultActiveKey="2" centered> */}
        <div>
          {/* <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right"> */}
          {/* List of roles */}
          <div
            className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-52 h-screen ml-16`}
          >
            {" "}
            <div className="text-right flex-col bg-gray-100 rounded-lg p-2 flex justify-end items-right">
              <h1 className="text-xl font-semibold m-2 mt-3 text-center">
                الأدوار والأذونات
              </h1>
              <div className="flex justify-end mb-2">
                <Tab
                  selected={activeTab === "Role"}
                  title="الأدوار"
                  onClick={() => handleTabChange("Role")}
                  className={`${
                    activeTab === "Role"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                />{" "}
                <Tab
                  selected={activeTab === "User"}
                  title="المستخدمين"
                  onClick={() => handleTabChange("User")}
                  className={`${
                    activeTab === "User"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                />{" "}
              </div>
            </div>
            <div className="m-auto bg-white ">
              {activeTab === "Role" && (
                <>
                  <div className="flex justify-end flex-col">
                    <div className="text-right flex-col  rounded-lg p-2 flex justify-end ">
                      <h1 className="text-xl font-semibold ml-2 mt-3 ">
                        الأدوار
                      </h1>
                    </div>
                    <div className="flex justify-end mr-2">
                      {" "}
                      <button
                        onClick={() => {
                          NewRole();
                        }}
                        className="text-white  bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm "
                      >
                        + إنشاء دور جديد
                      </button>
                    </div>
                  </div>
                  <div className="bg-lightGray-100 flex ">
                    {isLoading ? (
                      renderSkeleton1()
                    ) : (
                      <table className="min-w-full divide-y divide-gray-300 text-right  mr-1">
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
                              اسم الدور
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allRoles?.map((data, index) => (
                            <tr key={index} className="hover:bg-white">
                              <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <span className="flex items-center  gap-4">
                                  <span
                                    className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                                    onClick={() => {
                                      setDeleteID(data?.value);
                                      setDeleteModal(true);
                                    }}
                                  >
                                    <BiMessageAltX />
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditClick(data?.label, data?.value)
                                    }
                                    className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                                  >
                                    <BiEdit />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlePermissionClick(data?.value)
                                    }
                                    className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                                  >
                                    تعيين الأذونات
                                  </button>
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {data?.label}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  {/* </div> */}
                  {/* Delete Role Modal */}
                  <Modal
                    title={
                      <div className="flex p-5 justify-end">
                        هل أنت متأكد من حذف هذا الدور؟
                      </div>
                    }
                    open={deleteModal}
                    onOk={handleDelete}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      style: {
                        backgroundColor: "red",
                        margin: 10,
                        fontFamily: "Cairo",
                      },
                    }}
                    cancelButtonProps={{ style: { fontFamily: "Cairo" } }}
                    okText="حذف"
                    cancelText="أغلق"
                    style={{ padding: 10, fontFamily: "Cairo" }}
                  ></Modal>
                  {/* Edit Role Modal */}
                  <Modal
                    title={
                      <span
                        className="flex justify-end p-4"
                        style={{ fontFamily: "Cairo" }}
                      >
                        تعديل الدور
                      </span>
                    }
                    open={editModal}
                    onOk={handleEdit}
                    onCancel={handleCancel}
                    maskClosable={false}
                    closable={false}
                    okButtonProps={{
                      style: {
                        backgroundColor: "green",
                        borderColor: "green",
                        fontFamily: "Cairo",
                        margin: 5,
                      },
                    }}
                    cancelButtonProps={{
                      style: {
                        fontFamily: "Cairo",
                      },
                    }}
                    okText="تعديل"
                    cancelText="أغلق"
                  >
                    <div className="mr-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                        style={{ fontFamily: "Cairo" }}
                      >
                        اسم
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder=" اسم الدور"
                          style={{ fontFamily: "Cairo" }}
                          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Modal>
                  <Modal
                    title={
                      <div
                        className="flex justify-end p-5 "
                        style={{ fontFamily: "Cairo" }}
                      >
                        تسجيل دور جديد
                      </div>
                    }
                    open={isModalOpen}
                    onOk={handleNewRole}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      style: {
                        backgroundColor: "green",
                        borderColor: "green",
                        fontFamily: "Cairo",
                        margin: 10,
                      },
                    }}
                    cancelButtonProps={{
                      style: {
                        fontFamily: "Cairo",
                      },
                    }}
                    okText={"يحفظ"}
                    cancelText="أغلق"
                  >
                    <div style={{ fontFamily: "Cairo", margin: 10 }}>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        اسم
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)}
                          placeholder="أدخل الاسم"
                          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        />
                      </div>
                    </div>
                  </Modal>{" "}
                  {/* Assign Permission Modal */}
                  <Modal
                    // title="Assign Permissions"
                    open={permissionModal}
                    onCancel={handleCancel}
                    closable={false}
                    okButtonProps={{
                      style: {
                        backgroundColor: "green",
                        borderColor: "green",
                        margin: 10,
                      },
                    }}
                    okText="Assign"
                    onOk={handleAssignPermissions}
                    style={{ padding: 10 }}
                  >
                    <h2 className="text-center font-semibold text-lg mb-3 ">
                      Assign Permissions
                    </h2>
                    {/* Rest of your modal content */}
                    <div className="flex flex-col w-full p-5">
                      {permissionModalData.map((module, index) => (
                        <div
                          key={module.privilege_id}
                          className="flex flex-row   mb-2"
                        >
                          <div className="mr-2 font-semibold">
                            {module.moduleName}:
                          </div>
                          <div className="ml-auto">
                            <label className="mr-2 ">
                              <input
                                className=" mb-2"
                                type="checkbox"
                                checked={module.isView}
                                onChange={() =>
                                  handleCheckboxChange(
                                    module.privilege_id,
                                    "isView"
                                  )
                                }
                              />
                              <span> View</span>
                            </label>
                            <label className="mr-2">
                              <input
                                className=" mb-2"
                                type="checkbox"
                                checked={module.isAdd}
                                onChange={() =>
                                  handleCheckboxChange(
                                    module.privilege_id,
                                    "isAdd"
                                  )
                                }
                              />
                              <span> Add </span>
                            </label>
                            <label className="mr-2">
                              <input
                                className=" mb-2"
                                type="checkbox"
                                checked={module.isEdit}
                                onChange={() =>
                                  handleCheckboxChange(
                                    module.privilege_id,
                                    "isEdit"
                                  )
                                }
                              />
                              <span> Edit </span>
                            </label>
                            <label>
                              <input
                                className=" mb-2"
                                type="checkbox"
                                checked={module.isDelete}
                                onChange={() =>
                                  handleCheckboxChange(
                                    module.privilege_id,
                                    "isDelete"
                                  )
                                }
                              />
                              <span> Delete</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Modal>
                </>
              )}
            </div>
            <div className="m-auto bg-white ">
              {activeTab === "User" && (
                <div className="flex justify-end -mt-2 flex-col">
                  <div className="text-right flex-col  rounded-lg p-2 flex justify-end ">
                    {" "}
                    <h1 className="text-xl font-semibold m-2 mt-3">
                      {" "}
                      المستخدمين
                    </h1>
                    <div className="flex justify-end">
                      {" "}
                      <button
                        onClick={() => {
                          NewUser();
                        }}
                        className="text-white  bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm "
                      >
                        + تسجيل مستخدم جديد
                      </button>
                    </div>
                  </div>
                  <div className="bg-lightGray-100 w-full ">
                    {isLoading
                      ? renderSkeleton1()
                      : allUsers?.length > 0 && (
                          <table className="min-w-full divide-y divide-gray-300 text-right  mr-1 w-full">
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
                                  بريد إلكتروني
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                                >
                                  الاسم الأول
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                                >
                                  اسم العائلة
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                                >
                                  تعيين
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                                >
                                  أرقام الهواتف
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                                >
                                  دور
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {allUsers?.map((data, index) => (
                                <tr key={index} className="hover:bg-white">
                                  <td className=" whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                    <span className="flex gap-4">
                                      <span
                                        className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                                        onClick={() => {
                                          setDeleteID(data?.id);
                                          setDeleteUserModal(true);
                                        }}
                                      >
                                        <BiMessageAltX />
                                      </span>
                                      <button
                                        onClick={() => handleUserEdit(data)}
                                        className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                                      >
                                        <BiEdit />
                                      </button>
                                    </span>
                                  </td>{" "}
                                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                                    {data?.email}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                                    {data?.first_name}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                                    {data?.last_name}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                                    {data?.designation}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                                    {data?.phone_numbers.map(
                                      (phoneNumber, i) => (
                                        <span key={i}>
                                          {phoneNumber?.number}
                                          <br />
                                        </span>
                                      )
                                    )}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-xs">
                                    {data?.role?.name}
                                  </td>{" "}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                  </div>

                  {/* </div> */}

                  <Modal
                    title={
                      <span className="flex justify-end p-2 font-bold">
                        {editFlag ? "تحرير العضو" : "تسجيل مستخدم جديد"}
                      </span>
                    }
                    open={isUserModalOpen}
                    onOk={createNewUser}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    width={600}
                    okButtonProps={{
                      style: {
                        backgroundColor: "green",
                        borderColor: "green",
                        margin: 10,
                        fontFamily: "Cairo",
                      },
                    }}
                    style={{ fontFamily: "Cairo" }}
                    cancelText="أغلق"
                    okText={editFlag ? "يحفظ " : "تسجيل مستخدم جديد"}
                    cancelButtonProps={{
                      style: {
                        fontFamily: "Cairo",
                      },
                    }}
                  >
                    <div className="p-5">
                      <div className="flex flex-row justify-between gap-4 mb-4">
                        <div className="flex flex-col space-y-2 w-full">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              اسم العائلة
                            </label>
                            <div className="relative mt-2">
                              <input
                                tabIndex={2}
                                type="text"
                                name="last_name"
                                id="last_name"
                                onChange={handleChange}
                                value={state?.last_name}
                                placeholder="إدخال اسم آخر"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    document
                                      .querySelector('[tabIndex="3"]')
                                      .focus();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              تعيين
                            </label>
                            <div className="relative mt-2">
                              <input
                                tabIndex={4}
                                type="text"
                                name="designation"
                                id="designation"
                                onChange={handleChange}
                                value={state?.designation}
                                placeholder="أدخل التعيين"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    document
                                      .querySelector('[tabIndex="5"]')
                                      .focus();
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="phone_numbers"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              رقم التليفون
                            </label>

                            <div className="w-full  mb-6 ">
                              {/* <div className="flex w-full justify-center m-auto"> */}

                              <div className="flex w-full ">
                                <div
                                  className={`relative mt-2 ${
                                    newPhoneNumber ? "w-11/12" : "w-full"
                                  }`}
                                >
                                  <InputMask
                                    tabIndex={6}
                                    mask="00218 99 9999999" // Define your desired mask here
                                    maskChar=""
                                    placeholder="00218 XX XXXXXXX"
                                    onChange={(e) =>
                                      setNewPhoneNumber(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        console.log("e.key", e.key);
                                        e.preventDefault();
                                        handleAddPhoneNumber();
                                      }
                                    }}
                                    value={newPhoneNumber}
                                    type="tel"
                                    name="phone_numbers"
                                    id="phone_numbers"
                                    className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                    {...(phoneNumbers
                                      ? { required: false }
                                      : { required: true })}
                                  />
                                </div>
                              </div>
                              {phoneNumbers.length > 0 && (
                                <div className="flex flex-wrap mt-2">
                                  {phoneNumbers.map((phoneNumber, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-200 p-2 rounded-md flex items-center mr-2 mb-2"
                                    >
                                      <span className="mr-1 text-xs">
                                        {phoneNumber}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemovePhoneNumber(index)
                                        }
                                        className="text-red-500 hover:text-red-700 text-xs"
                                      >
                                        X
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 w-full">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              الاسم الأول
                            </label>
                            <div className="relative mt-2">
                              <input
                                tabIndex={1}
                                type="text"
                                name="first_name"
                                id="first_name"
                                onChange={handleChange}
                                value={state?.first_name}
                                placeholder="أدخل الاسم الأول"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    document
                                      .querySelector('[tabIndex="2"]')
                                      .focus();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              كلمة المرور
                            </label>
                            <div className="relative mt-2">
                              {/* <input
                                type="text"
                                name="password"
                                id="password"
                                onChange={handleChange}
                                value={state?.password}
                                placeholder="Enter Password"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              />
                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.password ? "hidden" : ""
                                }`}
                              >
                                Please Add Password
                              </p> */}
                              <input
                                tabIndex={3}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                onChange={handlePasswordChange}
                                value={state?.password}
                                placeholder="أدخل كلمة المرور"
                                className="peer block w-full px-3 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    document
                                      .querySelector('[tabIndex="4"]')
                                      .focus();
                                  }
                                }}
                              />

                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-5 -translate-y-1/2 cursor-pointer"
                              >
                                {showPassword ? <BsEyeSlash /> : <BsEye />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              بريد إلكتروني
                            </label>
                            <div className="relative mt-2">
                              <input
                                tabIndex={5}
                                name="email"
                                onChange={handleChange}
                                placeholder="أدخل البريد الإلكتروني"
                                className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                                value={state?.email}
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") {
                                    e.preventDefault();
                                    document
                                      .querySelector('[tabIndex="6"]')
                                      .focus();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              الأدوار
                            </label>
                            <div className="relative mt-2">
                              <Select
                                name="role"
                                showSearch={true}
                                placeholder="حدد الأدوار"
                                id="role"
                                onChange={(e) => handleRoleChange(e)}
                                value={roleID}
                                options={allRoles}
                                dropdownStyle={{ textAlign: "right" }}
                                className="peer block w-full border-0 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  {/* Delete Role Modal */}
                  <Modal
                    title="هل أنت متأكد من حذف هذا الدور؟"
                    open={deleteModal}
                    onOk={handleDelete}
                    onCancel={handleCancel}
                    maskClosable={false}
                    closable={false}
                    okButtonProps={{
                      style: { backgroundColor: "red", fontFamily: "Cairo" },
                    }}
                    style={{ padding: 10 }}
                    cancelButtonProps={{ style: { fontFamily: "Cairo" } }}
                    okText="يمسح"
                    cancelText="يغلق"
                  ></Modal>
                  {/* Edit Role Modal */}
                  <Modal
                    title={
                      <div
                        className="flex justify-end p-5"
                        style={{ fontFamily: "Cairo" }}
                      >
                        هل أنت متأكد من حذف هذا المستخدم؟
                      </div>
                    }
                    open={deleteUserModal}
                    onOk={handleDeleteUser}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      style: {
                        backgroundColor: "red",
                        margin: 10,
                        fontFamily: "Cairo",
                      },
                    }}
                    cancelButtonProps={{
                      style: {
                        fontFamily: "Cairo",
                      },
                    }}
                    okText="يمسح"
                    cancelText="يغلق"
                  ></Modal>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
