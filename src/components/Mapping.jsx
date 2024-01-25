import React, { useState, useEffect } from "react";
import { Modal, Select as AntSelect } from "antd";
// import 'antd/dist/antd.css' // Import the Ant Design styles

import axios from "axios";
import { Vars } from "../helpers/helpers";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import { Spin } from "antd";
export default function Mapping() {
  const [departmentMapping, setDepartmentMapping] = useState(false);
  const [incidentTypeMapping, setIncidentTypeMapping] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [incident, setIncident] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedIncidentId, setSelectedIncidentId] = useState("");
  const [activeTab, setActiveTab] = useState("departmentMapping");
  const [loading, setLoading] = useState(true);
  const handleCancelView = () => {
    setDepartmentMapping(false);
    setIncidentTypeMapping(false);
    setSelectedDepartment("");
    setSelectedEquipment([]);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleIncidentChange = (event) => {
    const selectedId = event.target.value;
    setSelectedIncidentId(selectedId);
  };
  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  const handleMappingSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        department_id: selectedDepartment,
        incident_types: selectedEquipment?.map((item) => item.id),
        // incident_types: [1],
      };

      // Send your API request with the body
      const response = await axios.post(
        `${Vars.domain}/departments/mapping`,
        body,
        {
          headers,
        }
      );
      if (response.status === 200) {
        toast.success("Mapping added Successfuly");
        setDepartmentMapping(false);
        setSelectedDepartment("");
        setSelectedEquipment("");
      }
      handleCancelView();
    } catch (error) {
      console.error("Error submitting mapping:", error);
    }
  };
  const handleIncidentMappingSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        incident_type_id: selectedIncidentId,
        equipments: selectedEquipment?.map((item) => item.id),
        // incident_types: [1],
      };
      // Send your API request with the body
      const response = await axios.post(
        `${Vars.domain}/incident-type/mapping`,
        body,
        {
          headers,
        }
      );
      if (response.status === 200) {
        toast.success("Mapping added Successfuly");
        setIncidentTypeMapping(false);
        setSelectedDepartment("");
        setSelectedEquipment("");
        setSelectedIncidentId("");
      }
      handleCancelView();
    } catch (error) {
      console.error("Error submitting mapping:", error);
    }
  };
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/departments`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          setDepartments(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    getDepartments();
  }, [departmentMapping]);
  useEffect(() => {
    const getEquipments = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/equipments`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          setEquipments(response?.data?.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    getEquipments();
  }, []);
  useEffect(() => {
    const getIncident = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${Vars.domain}/incident-type`, {
          headers,
        });

        if (response.status === 200 || response.status === 201) {
          setIncident(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    getIncident();
  }, [incidentTypeMapping]);

  const Tab = ({ selected, title, onClick }) => {
    return (
      <button
        className={`px-4 py-2 transition-colors duration-150 ${
          selected
            ? "bg-blue-500 text-white "
            : "bg-white text-black hover:bg-gray-200 "
        } focus:outline-none`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  };

  return (
    <>
      <Toaster richColors />
      {/* Department Mapping Modal */}
      <Modal
        open={departmentMapping}
        onCancel={handleCancelView}
        footer={null}
        closable={true}
        maskClosable={false}
      >
        <div className="flex flex-col">
          <div className="flex p-5 ">
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="py-3 w-full border-none bg-grayBg-300 mt-2 rounded-xl"
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments.map((details, index) => (
                <option key={index} value={details?.id}>
                  {details?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <MultiSelectDropdown
              options={incident}
              selectedOptions={selectedEquipment}
              setSelectedOptions={setSelectedEquipment}
              //   label={"Equipment"}
              placeholder="Select Incident Type"
              bgColor={"#91EAAA"}
            />
          </div>
          <div className="flex m-auto mt-5 bg-blue-400 p-5 rounded-xl text-lg text-white">
            <button onClick={handleMappingSubmit}>Submit Mapping</button>
          </div>
        </div>
      </Modal>
      {/* Incident mapping modal */}
      <Modal
        // title="Are you sure to delete this Role?"
        open={incidentTypeMapping}
        // onOk={deleteIncidentType}
        onCancel={handleCancelView}
        footer={null}
        closable={true}
        maskClosable={false} // Set this to false to prevent closing on outside click
      >
        {" "}
        <div className="flex flex-col">
          <div className="flex p-5 ">
            <select
              className="py-3 w-full border-none bg-grayBg-300 mt-2 rounded-xl"
              onChange={handleIncidentChange}
              value={selectedIncidentId}
            >
              <option value="" disabled selected>
                Select Incident Type
              </option>
              {incident?.map((details, index) => (
                <option key={details?.id} value={details?.id}>
                  {details?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <MultiSelectDropdown
              options={equipments}
              selectedOptions={selectedEquipment}
              setSelectedOptions={setSelectedEquipment}
              label={"Equipment"}
              placeholder="Select Equipment"
              bgColor={"#91EAAA"}
            />
          </div>

          <div className="flex m-auto mt-5 bg-blue-400 p-5 rounded-xl text-lg text-white">
            <button onClick={handleIncidentMappingSubmit}>
              Submit Mapping
            </button>
          </div>
        </div>
      </Modal>

      <div
        className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
      >
        <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
          <div className="p-4 text-center   ">
            <h1 className="text-2xl font-semibold m-2 mt-3"> Mapping</h1>
          </div>
          <div className="flex justify-end ">
            <Tab
              selected={activeTab === "incidentTypeMapping"}
              title="Incident Type Mapping"
              onClick={() => handleTabChange("incidentTypeMapping")}
              className={`${
                activeTab === "incidentTypeMapping"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            />{" "}
            <Tab
              selected={activeTab === "departmentMapping"}
              title="Department Mapping"
              onClick={() => handleTabChange("departmentMapping")}
              className={`${
                activeTab === "departmentMapping"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            />
          </div>
          <div className="m-auto bg-white mt-5 rounded-xl">
            {/* <div className="flex justify-center">
              <div
                onClick={() => handleTabChange("departmentMapping")}
                className={`cursor-pointer py-2 px-5 ${
                  activeTab === "departmentMapping"
                    ? "bg-primary-100 text-white"
                    : "text-primary-100"
                } border-2 border-primary-100 rounded-tl-md`}
              >
                Department Mapping
              </div>
              <div
                onClick={() => handleTabChange("incidentTypeMapping")}
                className={`cursor-pointer py-2 px-5 ${
                  activeTab === "incidentTypeMapping"
                    ? "bg-primary-100 text-white"
                    : "text-primary-100"
                } border-2 border-primary-100 rounded-tr-md`}
              >
                Incident Type Mapping
              </div>
            </div> */}
            <div className="">
              {activeTab === "departmentMapping" && (
                <>
                  <>
                    {" "}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDepartmentMapping(true)}
                        className="mt-5 mr-3 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 ml-auto"
                      >
                        + Add Department Mapping
                      </button>
                    </div>
                  </>
                  <div className="bg-white p-2 rounded-lg shadow my-2">
                    {loading ? (
                      <p className="text-gray-700 text-center">
                        <Spin size="large" />{" "}
                      </p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-300 m-6">
                            <th className="text-gray-800 text-right mb-4">
                              Incident Types
                            </th>
                            <th className="text-gray-800 text-right mb-4">
                              Department
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {departments.map((item) => (
                            <tr key={item.id} className="p-3">
                              <td className="last:border-0 p-2 text-gray-800 text-right mb-4">
                                {item.incident_types.map(
                                  (incidentType, index) => (
                                    <span key={incidentType.id}>
                                      {incidentType.name}
                                      {index < item.incident_types.length - 1 &&
                                        ", "}
                                    </span>
                                  )
                                )}
                              </td>
                              <td className="last:border-0 p-2 text-gray-800 text-right font-semibold mb-4">
                                <span>{item.name}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
              {activeTab === "incidentTypeMapping" && (
                <>
                  <>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setIncidentTypeMapping(true)}
                        className="mt-5 ml-3 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
                      >
                        + Add Incident Type Mapping
                      </button>
                    </div>
                  </>
                  <div className="bg-white p-2 rounded-lg shadow my-2">
                    {loading ? (
                      <p className="text-gray-700 text-center">
                        Loading departments...
                      </p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-gray-800 text-right">
                              Equipments
                            </th>
                            <th className="text-gray-800 text-right">
                              Incident Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {incident.map((item) => (
                            <tr key={item.id}>
                              <td className="last:border-0 p-2 text-gray-800 text-right">
                                {item?.equipments?.map((equipment, index) => (
                                  <span key={equipment.id}>
                                    {equipment.name}
                                    {index < item?.equipments?.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                              </td>
                              <td className="last:border-0 p-2 text-gray-800 text-right font-semibold">
                                <span>{item.name}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>{" "}
        </div>
      </div>
    </>
  );
}
