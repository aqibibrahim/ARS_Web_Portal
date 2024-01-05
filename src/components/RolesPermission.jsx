import React, { useState, useEffect } from "react";
import { Modal, Tabs } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";
import { BsArrowRightCircle } from "react-icons/bs";

import { BiEdit } from "react-icons/bi";
const { TabPane } = Tabs;
export default function RolesPermission() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);

  const [permissionModal, setPermissionModal] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [roleName, setRoleName] = useState("");
  const [allRoles, setAllRoles] = useState([""]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const [deleteID, setDeleteID] = useState("");
  const [editID, setEditID] = useState("");
  const [editUserID, setEditUserID] = useState("");

  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    designation: "",
    role: 0,
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
        console.log("Module", module);
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
      console.log(response, "res");
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
    debugger;
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
        // If editFlag is true, make a PATCH request
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

      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        {
          editFlag
            ? toast.success("User Updated Successfully")
            : toast.success("User Created Successfully");
        }
        setPhoneNumbers([]);
        setIsModalOpen(false);
        handle(false);
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
      debugger;
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
        console.log(token);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/roles`, {
          headers,
        });

        console.log(response.data.data, "response");
        if (response.status === 200 || response.status === 201) {
          setAllRoles(response?.data?.data);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    GetRecords();
  }, [isModalOpen]);
  useEffect(() => {
    const GetUsers = async () => {
      try {
        var token = localStorage.getItem("token");
        console.log(token);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/users`, {
          headers,
        });

        console.log(response.data.data, "response");
        if (response.status === 200 || response.status === 201) {
          setAllUsers(response?.data?.data);
        }
      } catch (error) {
        console.error("Error creating role:", error);
      }
    };
    GetUsers();
  }, [isModalOpen]);

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
    debugger;
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
    setPhoneNumbers(data?.phone_numbers || []);
    console.log(editUserModal);
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setDeleteModal(false);
    setEditModal(false);
    setPermissionModal(false);
    setEditName("");
    setIsUserModalOpen(false);
    setPhoneNumbers([]);
    setEditFlag(false);
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
      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        setDeleteModal(false);
        toast.success("Role Deleted Successfuly");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Something went wrong");
      setDeleteModal(false);
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
      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        setIsModalOpen(false);
        toast.success("Role Created Successfuly");
      }
      console.log("Role created successfully:", response.data);
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
      console.log(response, "res");
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
      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        // setEditModal(false)
        setPermissionModals(response.data.data);
        toast.success("Fetech Permissions");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Something Went Wrong");
      // setEditModal(false)
    }
  };

  const setPermissionModals = (data) => {
    console.log("Data", data);
    // Extract module names and privileges from the fetched data
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

  return (
    <>
      {/* Create Role Modal */}
      <Toaster position="bottom-right" richColors />

      <div className="w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Roles & Permissions" key="1">
            {/* <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right"> */}
            {/* List of roles */}
            <div
              className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
            >
              {" "}
              <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
                <h1 className="text-2xl font-semibold m-2 mt-3">
                  {" "}
                  Roles & Permissions
                </h1>
                <div>
                  <button
                    onClick={() => {
                      NewRole();
                    }}
                    className="mt-5 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
                  >
                    Create New Role +
                  </button>
                </div>
                <table className="w-full justify-center rounded-xl divide-y divide-gray-300 text-right mt-5 bg-gray-100">
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
                        Role Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRoles?.map((data, index) => (
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
                              onClick={() =>
                                handleEditClick(data?.name, data?.id)
                              }
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            >
                              <BiEdit />
                            </button>
                            <button
                              onClick={() => handlePermissionClick(data?.id)}
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            >
                              Assign Permissions
                            </button>
                          </span>
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
              <div className="flex w-full ">
                <input
                  placeholder="Enter Name of the Role"
                  className="flex w-10/12 m-auto rounded-xl"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
            </Modal>

            {/* Assign Permission Modal */}

            <Modal
              title="Assign Permissions"
              open={permissionModal}
              onCancel={handleCancel}
              closable={false}
              okButtonProps={{
                style: { backgroundColor: "green", borderColor: "green" },
              }}
              okText="Assign"
              onOk={handleAssignPermissions}
            >
              <div className="flex flex-col w-full">
                {permissionModalData.map((module, index) => (
                  <div
                    key={module.privilege_id}
                    className="flex items-center mb-2"
                  >
                    <span className="mr-2 font-semibold">
                      {module.moduleName}:
                    </span>
                    <label className="mr-2">
                      <input
                        type="checkbox"
                        checked={module.isView}
                        onChange={() =>
                          handleCheckboxChange(module.privilege_id, "isView")
                        }
                      />
                      View
                    </label>
                    <label className="mr-2">
                      <input
                        type="checkbox"
                        checked={module.isAdd}
                        onChange={() =>
                          handleCheckboxChange(module.privilege_id, "isAdd")
                        }
                      />
                      Add
                    </label>
                    <label className="mr-2">
                      <input
                        type="checkbox"
                        checked={module.isEdit}
                        onChange={() =>
                          handleCheckboxChange(module.privilege_id, "isEdit")
                        }
                      />
                      Edit
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={module.isDelete}
                        onChange={() =>
                          handleCheckboxChange(module.privilege_id, "isDelete")
                        }
                      />
                      Delete
                    </label>
                  </div>
                ))}
              </div>
            </Modal>
          </TabPane>

          {/* Users Tab */}
          <TabPane tab="Users" key="2">
            {/* <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right"> */}
            {/* List of roles */}
            <div
              className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
            >
              {" "}
              <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
                <h1 className="text-2xl font-semibold m-2 mt-3"> Users</h1>
                <div>
                  <button
                    onClick={() => {
                      NewUser();
                    }}
                    className="mt-5 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
                  >
                    Create New User +
                  </button>
                </div>
                <table className="w-full justify-center rounded-xl divide-y divide-gray-300 text-right mt-5 bg-gray-100">
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
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Designation
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Phone Nmbers
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers?.map((data, index) => (
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
                              onClick={() => handleUserEdit(data)}
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            >
                              <BiEdit />
                            </button>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-md">
                          {data?.first_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-md">
                          {data?.last_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-md">
                          {data?.designation}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-md">
                          {data?.phone_numbers.map((phoneNumber, i) => (
                            <span key={i}>
                              {phoneNumber?.number}
                              <br />
                            </span>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-md">
                          {data?.role?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* </div> */}
            <Modal
              title={editUserModal ? "Edit User" : "Create New User"}
              open={isModalOpen}
              onOk={editModal ? handleEditUser : handleNewRole}
              onCancel={handleCancel}
              closable={false}
              maskClosable={false}
              okButtonProps={{
                style: { backgroundColor: "green", borderColor: "green" },
              }}
              okText={editModal ? "Edit" : "Create"}
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
                  <div
                    className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Modal>{" "}
            <Modal
              title={editFlag ? "Edit User" : "Create New User"}
              open={isUserModalOpen}
              onOk={createNewUser}
              onCancel={handleCancel}
              closable={false}
              maskClosable={false}
              okButtonProps={{
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
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
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
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
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
                          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                        >
                          <option value="" disabled>
                            Select a Role
                          </option>
                          {allRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>

                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
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
                            <input
                              type="number"
                              onChange={(e) =>
                                setNewPhoneNumber(e.target.value)
                              }
                              value={newPhoneNumber}
                              placeholder="Enter Phone Number"
                              className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                              {...(phoneNumbers
                                ? { required: false }
                                : { required: true })}
                            />
                            <div
                              className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                              aria-hidden="true"
                            />
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
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
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
                        <input
                          type="text"
                          name="password"
                          id="password"
                          onChange={handleChange}
                          value={state?.password}
                          placeholder="Enter Password"
                          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
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
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
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
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
