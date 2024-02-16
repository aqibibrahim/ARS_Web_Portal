import React, { useState, useEffect } from "react";
import { Modal, Select, Skeleton } from "antd";
// import 'antd/dist/antd.css' // Import the Ant Design styles

import axios from "axios";
import { Vars } from "../helpers/helpers";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Toaster, toast } from "sonner";
// import Select from "react-tailwindcss-select";
import { Spin } from "antd";
export default function Mapping() {
  const [departmentMapping, setDepartmentMapping] = useState(false);
  const [incidentTypeMapping, setIncidentTypeMapping] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [incident, setIncident] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedIncidentId, setSelectedIncidentId] = useState("");
  const [activeTab, setActiveTab] = useState("departmentMapping");
  const [loading, setLoading] = useState(true);
  const [myData, setMyData] = useState([]);
  const [myIncidentData, setMyIncidentData] = useState([]);

  const handleCancelView = () => {
    setDepartmentMapping(false);
    setIncidentTypeMapping(false);
    setSelectedDepartment("");
    setSelectedEquipment([]);
    setSelectedIncidentId("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleIncidentChange = (value) => {
    // const selectedId = event.target.value;
    setSelectedIncidentId(value);
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
        toast.success("الربط اضيف بنجاح ", {
          className: "toast-align-right",
        });
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
        toast.success("الربط اضيف بنجاح ", {
          className: "toast-align-right",
        });
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
          setMyData(
            response?.data?.data.map((details, index) => ({
              label: details.name,
              value: details.id,
            }))
          );
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
          setMyIncidentData(
            response?.data?.data.map((details, index) => ({
              label: details.name,
              value: details.id,
            }))
          );
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
  ];
  const renderSkeleton1 = () => {
    return columns.map((column) => (
      <tr className="flex items-end justify-end gap-40 my-3 px-4 pb-4">
        {columns.map((column, index) => {
          // Render skeleton inputs for other columns
          return (
            <td key={column.key}>
              <Skeleton.Input
                active
                size="large"
                className="mt-4 mr-1"
                style={{ width: "100%", borderRadius: "4px" }}
              />
            </td>
          );
        })}
      </tr>
    ));
  };
  return (
    <>
      <Toaster richColors />
      {/* Department Mapping Modal */}
      <Modal
        open={departmentMapping}
        onCancel={() => {
          handleCancelView();
          setSelectedDepartment();
        }}
        footer={null}
        closable={true}
        maskClosable={false}
      >
        <div className="flex  p-2 flex-col">
          <div className="flex  flex-col mt-5 " style={{ fontFamily: "Cairo" }}>
            {/* <select
              value={selectedDepartment} 
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="py-3 w-full border-none bg-grayBg-300 mt-2 rounded-xl text-right pl-4 pr-8"
            >
              <option value="" disabled>
                إختار القسم
              </option>
              {departments.map((details, index) => (
                <option key={index} value={details?.id}>
                  {details?.name}
                </option>
              ))}
            </select> */}
            <label className="block text-sm  mb-2 font-medium  text-gray-900 text-right">
              إختار القسم
            </label>
            <Select
              tabIndex={1}
              showSearch={true}
              style={{ width: "100%", fontFamily: "Cairo" }}
              placeholder={
                <span
                  className="flex justify-end ml-24 "
                  style={{ fontFamily: "Cairo" }}
                >
                  إختار القسم
                </span>
              }
              value={selectedDepartment}
              onChange={(e, option) => handleDepartmentChange(e, option)}
              options={myData}
              dropdownStyle={{
                textAlign: "right",
                fontFamily: "Cairo",
              }}
              className="text-right"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  document.querySelector('[tabIndex="2"]').focus();
                }
              }}
            />
          </div>
          <div style={{ fontFamily: "Cairo" }}>
            <label className="block text-sm  mt-2 font-medium  text-gray-900 text-right">
              إختار نوع الحادث
            </label>
            <MultiSelectDropdown
              options={incident}
              selectedOptions={selectedEquipment}
              setSelectedOptions={setSelectedEquipment}
              //   label={"Equipment"}
              placeholder="إختار نوع الحادث
"
              bgColor={"#91EAAA"}
            />
          </div>
          <div
            style={{ fontFamily: "Cairo" }}
            className="flex m-auto mt-5 bg-blue-400 p-5 rounded-xl text-lg text-white"
          >
            <button onClick={handleMappingSubmit}>إضافة الربط</button>
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
        <div className="flex flex-col p-2 ">
          <div className="flex mt-5 flex-col " style={{ fontFamily: "Cairo" }}>
            <label className="block text-sm mb-2 font-medium  text-gray-900 text-right">
              نوع الحادث
            </label>
            <Select
              tabIndex={1}
              showSearch={true}
              style={{ width: "100%", fontFamily: "Cairo" }}
              placeholder={
                <span
                  className="flex justify-end ml-24 "
                  style={{ fontFamily: "Cairo" }}
                >
                  إختار نوع الحادث
                </span>
              }
              value={selectedIncidentId}
              onChange={(e, option) => handleIncidentChange(e, option)}
              options={myIncidentData}
              dropdownStyle={{
                textAlign: "right",
                fontFamily: "Cairo",
              }}
              className="text-right"
            />
            {/* <select
              className="py-3 w-full border-none bg-grayBg-300 mt-2 rounded-xl text-right pl-4 pr-8"
              onChange={handleIncidentChange}
              value={selectedIncidentId}
            >
              <option value="" disabled selected>
                إختار نوع الحادث
              </option>
              {incident?.map((details, index) => (
                <option key={details?.id} value={details?.id}>
                  {details?.name}
                </option>
              ))}
            </select> */}
          </div>
          <div style={{ fontFamily: "Cairo" }}>
            <label className="block text-sm  mt-2 font-medium  text-gray-900 text-right">
              المعدات
            </label>
            <MultiSelectDropdown
              options={equipments}
              selectedOptions={selectedEquipment}
              setSelectedOptions={setSelectedEquipment}
              placeholder="إختار المعدات"
              bgColor={"#91EAAA"}
            />
          </div>

          <div
            style={{ fontFamily: "Cairo" }}
            className="flex m-auto mt-5 bg-blue-400 p-5 rounded-xl text-lg text-white"
          >
            <button
              onClick={handleIncidentMappingSubmit}
              style={{ fontFamily: "Cairo" }}
            >
              <span style={{ fontFamily: "Cairo" }}> إضافة الربط </span>
            </button>
          </div>
        </div>
      </Modal>

      <div
        className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
      >
        <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
          <div className="p-4 text-center   ">
            <h1 className="text-2xl font-semibold m-2 mt-3"> الربط</h1>
          </div>
          <div className="flex justify-end ">
            <Tab
              selected={activeTab === "incidentTypeMapping"}
              title="ربط الحوادث بمعدات الإسعاف  "
              onClick={() => handleTabChange("incidentTypeMapping")}
              className={`${
                activeTab === "incidentTypeMapping"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            />{" "}
            <Tab
              selected={activeTab === "departmentMapping"}
              title="ربط الأقسام بالحوادث "
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
                        + إضافة ربط الأقسام بالحوادث
                      </button>
                    </div>
                  </>
                  <div className="bg-white p-2 rounded-lg shadow my-2">
                    {loading ? (
                      renderSkeleton1()
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-300 m-6">
                            <th className="text-gray-800 text-right mb-4">
                              انواع الحوادث{" "}
                            </th>
                            <th className="text-gray-800 text-right mb-4">
                              الاقسام
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
                        + إضافة ربط لنوع الحادث
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
                              المعدات{" "}
                            </th>
                            <th className="text-gray-800 text-right">
                              نوع الحادث{" "}
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
