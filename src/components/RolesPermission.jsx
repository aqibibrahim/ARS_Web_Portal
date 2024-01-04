import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import { Toaster, toast } from "sonner";

export default function RolesPermission() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [allRoles, setAllRoles] = useState([""]);
  const [deleteID, setDeleteID] = useState("");
  const [editID, setEditID] = useState("");

  const [editName, setEditName] = useState("");
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
  }),
    [];

  const NewRole = () => {
    setIsModalOpen(true);
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
    setEditName("");
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

  return (
    <>
      <Toaster position="bottom-right" richColors />

      <Modal
        //   title="Create New Role"
        open={isModalOpen}
        onOk={handleNewRole}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "green", borderColor: "green" },
        }}
        okText="Create"
      >
        <div className="flex w-full ">
          <input
            placeholder="Enter Name of the Role"
            className="flex w-10/12 m-auto rounded-xl"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="Are you sure to delete this Role?"
        open={deleteModal}
        onOk={handleDelete}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{
          style: { backgroundColor: "red" },
        }}
        okText="Delete"
      ></Modal>

      <Modal
        title="Edit Role"
        open={editModal}
        onOk={handleEdit}
        onCancel={handleCancel}
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
                <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
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
                        onClick={() => handleEditClick(data?.name, data?.id)}
                        className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                      >
                        Edit
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
    </>
  );
}
