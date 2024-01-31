import React, { useState, useEffect } from "react";
import { Modal, Tabs } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import InputMask from "react-input-mask";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import { Spin } from "antd";
import {
  BsArrowRightCircle,
  BsEye,
  BsSearch,
  BsEyeSlash,
} from "react-icons/bs";
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
  const [activeTab, setActiveTab] = useState("Role");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    designation: "",
    role: "",
  });
  const [editUserData, setEditUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_numbers: [],
    designation: "",
    role_id: 0,
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
        toast.success("Role Updated Successfuly");
      }
    } catch (error) {
      toast.error("Something Went Wrong");
      setPermissionModal(false);
    }
  };
  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;

    setState((prevState) => ({
      ...prevState,
      role: selectedRoleId,
    }));
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
        role_id: state?.role,
      };
      let response;
      if (editFlag) {
        const userId = editUserData.id; // Assuming you have the user ID in editUserData
        response = await axios.patch(
          `${Vars.domain}/users/${editUserID}`,
          data,
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
            ? toast.success("User Updated Successfully")
            : toast.success("User Created Successfully");
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
          role: 0,
        });
      }
    } catch (error) {
      console.error("Error creating/editing user:", error);
      const errorMessage =
        error.response?.data?.data?.email || "An error occurred";
      toast.error(errorMessage);
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
          setAllRoles(response?.data?.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    GetRecords();
  }, [isModalOpen, deleteModal]);

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
    setState({
      id: data?.id,
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      email: data?.email || "",
      password: "", // You may want to initialize this as empty or handle it differently
      designation: data?.designation || "",
      role_id: data?.role_id || 0,
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
    setState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      designation: "",
      role: 0,
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
        toast.success("Role Deleted Successfuly");
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
        toast.success("User Deleted Successfuly");
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
        toast.success("Role Created Successfuly");
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
        toast.success("Role Updated Successfuly");
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
                Roles & Permissions
              </h1>
              <div className="flex justify-end mb-2">
                <Tab
                  selected={activeTab === "User"}
                  title="Users"
                  onClick={() => handleTabChange("User")}
                  className={`${
                    activeTab === "User"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                />{" "}
                <Tab
                  selected={activeTab === "Role"}
                  title="Roles"
                  onClick={() => handleTabChange("Role")}
                  className={`${
                    activeTab === "Role"
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
                        Roles
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
                        + Create New Role
                      </button>
                    </div>
                  </div>
                  <div className="bg-lightGray-100 flex ">
                    {isLoading ? (
                      <p className="text-center justify-center flex m-auto p-56">
                        <Spin size="large" />
                      </p>
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
                              Role Name
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
                                      setDeleteID(data?.id);
                                      setDeleteModal(true);
                                    }}
                                  >
                                    <BiMessageAltX />
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleEditClick(data?.name, data?.id)
                                    }
                                    className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                                  >
                                    <BiEdit />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handlePermissionClick(data?.id)
                                    }
                                    className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                                  >
                                    Assign Permissions
                                  </button>
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {data?.name}
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
                    title="Are you sure to delete this Role?"
                    open={deleteModal}
                    onOk={handleDelete}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      style: { backgroundColor: "red" },
                    }}
                    okText="Delete"
                  ></Modal>
                  <Modal
                    title="Are you sure to delete this User?"
                    open={deleteUserModal}
                    onOk={handleDeleteUser}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      style: { backgroundColor: "red" },
                    }}
                    okText="Delete"
                  ></Modal>
                  {/* Edit Role Modal */}
                  <Modal
                    title="Edit Role"
                    open={editModal}
                    onOk={handleEdit}
                    onCancel={handleCancel}
                    maskClosable={false}
                    closable={false}
                    okButtonProps={{
                      style: { backgroundColor: "green", borderColor: "green" },
                    }}
                    okText="Edit"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        Name
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter Name of the Role"
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
                    title={"Create New Role"}
                    open={isModalOpen}
                    onOk={handleNewRole}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      style: {
                        backgroundColor: "green",
                        borderColor: "green",
                      },
                      disabled: isSubmitRoleDisabled(), // Move the disabled property outside of style
                    }}
                    okText={"Save"}
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        Name
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={roleName}
                          onChange={(e) => setRoleName(e.target.value)}
                          placeholder="Enter Name"
                          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        />
                        <p
                          className={`text-red-500 text-xs italic mt-1 ${
                            roleName ? "hidden" : ""
                          }`}
                        >
                          Please Enter New Role
                        </p>
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
                      style: { backgroundColor: "green", borderColor: "green" },
                    }}
                    okText="Assign"
                    onOk={handleAssignPermissions}
                  >
                    <h2 className="text-center font-semibold text-lg mb-3">
                      Assign Permissions
                    </h2>
                    {/* Rest of your modal content */}
                    <div className="flex flex-col w-full ">
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
                    <h1 className="text-xl font-semibold m-2 mt-3"> Users</h1>
                    <div className="flex justify-end">
                      {" "}
                      <button
                        onClick={() => {
                          NewUser();
                        }}
                        className="text-white  bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-4 transition-all duration-300 hover:bg-white hover:text-primary-100 text-sm "
                      >
                        + Create New User
                      </button>
                    </div>
                  </div>
                  <div className="bg-lightGray-100 w-full ">
                    {isLoading ? (
                      <p className="text-center  text-primary-100 h-screen align-middle justify-center flex  mt-72 m-auto  ">
                        <Spin size="large" />
                      </p>
                    ) : (
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
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                            >
                              First Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                            >
                              Last Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                            >
                              Designation
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                            >
                              Phone Nmbers
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                            >
                              Role
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
                                {data?.phone_numbers.map((phoneNumber, i) => (
                                  <span key={i}>
                                    {phoneNumber?.number}
                                    <br />
                                  </span>
                                ))}
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
                    title={editFlag ? "Edit User" : "Create New User"}
                    open={isUserModalOpen}
                    onOk={createNewUser}
                    onCancel={handleCancel}
                    closable={false}
                    maskClosable={false}
                    okButtonProps={{
                      disabled: isSubmitDisabled(),

                      style: { backgroundColor: "green", borderColor: "green" },
                    }}
                    okText={editFlag ? "Save " : "Create"}
                  >
                    <div className="p-5">
                      <div className="flex flex-row justify-between gap-4 mb-4">
                        <div className="flex flex-col space-y-2 w-full">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              Last Name
                            </label>
                            <div className="relative mt-2">
                              <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                onChange={handleChange}
                                value={state?.last_name}
                                placeholder="Enter Last Name"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              />
                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.last_name ? "hidden" : ""
                                }`}
                              >
                                Please Enter Last Name
                              </p>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              Designation
                            </label>
                            <div className="relative mt-2">
                              <input
                                type="text"
                                name="designation"
                                id="designation"
                                onChange={handleChange}
                                value={state?.designation}
                                placeholder="Enter Designation"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              />
                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.designation ? "hidden" : ""
                                }`}
                              >
                                Please Enter Desigination
                              </p>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              Roles
                            </label>
                            <div className="relative mt-2">
                              <select
                                name="role"
                                id="role"
                                onChange={(e) => handleRoleChange(e)}
                                value={state?.role}
                                className="peer block  w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              >
                                <option value="" disabled>
                                  Select a Role
                                </option>
                                {allRoles.map((role) => (
                                  <option
                                    key={role.id}
                                    value={role.id}
                                    selected={role.id === state?.id}
                                  >
                                    {role.name}
                                  </option>
                                ))}
                              </select>

                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.role ? "hidden" : ""
                                }`}
                              >
                                Please Select Role
                              </p>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="phone_numbers"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              Phone Number
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
                                    mask="00218 99 9999999" // Define your desired mask here
                                    maskChar=""
                                    placeholder="00218 XX XXXXXXX"
                                    onChange={(e) =>
                                      setNewPhoneNumber(e.target.value)
                                    }
                                    value={newPhoneNumber}
                                    type="tel"
                                    name="phone_numbers"
                                    id="phone_numbers"
                                    className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                    {...(phoneNumbers
                                      ? { required: false }
                                      : { required: true })}
                                  />

                                  <p
                                    className={`text-red-500 text-xs italic mt-1 ${
                                      phoneNumbers?.length > 0 ? "hidden" : ""
                                    }`}
                                  >
                                    Please Add phone No. by pressing +
                                  </p>
                                </div>
                                <div>
                                  {newPhoneNumber ? (
                                    <button
                                      type="button"
                                      onClick={handleAddPhoneNumber}
                                      className="flex bg-gray-300 p-1 ml-5 mt-2 text-2xl rounded-md hover:bg-gray-400"
                                    >
                                      +
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>

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
                              First Name
                            </label>
                            <div className="relative mt-2">
                              <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                onChange={handleChange}
                                value={state?.first_name}
                                placeholder="Enter First Name"
                                className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              />
                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.first_name ? "hidden" : ""
                                }`}
                              >
                                Please Add First Name
                              </p>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              Password
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
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                onChange={handlePasswordChange}
                                value={state?.password}
                                placeholder="Password"
                                className="peer block w-full px-3 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                              />

                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-5 -translate-y-1/2 cursor-pointer"
                              >
                                {showPassword ? <BsEyeSlash /> : <BsEye />}
                              </button>

                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.password?.length === 6 ? "hidden" : ""
                                }`}
                              >
                                Please enter a six-digit password
                              </p>
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium leading-6 text-gray-900 text-right"
                            >
                              Email
                            </label>
                            <div className="relative mt-2">
                              <input
                                name="email"
                                onChange={handleChange}
                                placeholder="Enter Email"
                                className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                                required
                                value={state?.email}
                              />
                              <p
                                className={`text-red-500 text-xs italic mt-1 ${
                                  state?.email.includes("@" && ".com")
                                    ? "hidden"
                                    : ""
                                }`}
                              >
                                Please add valid email
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {phoneNumbers?.length > 0 ? (
                        <div
                          className={`grid grid-cols-2 gap-2 ${
                            phoneNumbers?.length > 0 ? "bg-gray-100" : ""
                          } p-4`}
                        >
                          {phoneNumbers.map((phoneNumber, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-lg bg-white p-2 rounded-md"
                            >
                              <div className="flex text-sm">
                                {phoneNumber?.number || phoneNumber}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoneNumber(index)}
                                className="bg-red-300 p-2 text-2xl rounded-md hover:bg-red-400"
                              >
                                -
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Modal>
                  {/* Delete Role Modal */}
                  <Modal
                    title="Are you sure to delete this Role?"
                    open={deleteModal}
                    onOk={handleDelete}
                    onCancel={handleCancel}
                    maskClosable={false}
                    closable={false}
                    okButtonProps={{
                      style: { backgroundColor: "red" },
                    }}
                    okText="Delete"
                  ></Modal>
                  {/* Edit Role Modal */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
