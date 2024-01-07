import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../helpers/helpers";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Toaster, toast } from "sonner";

export default function Mapping() {
  const [departmentMapping, setDepartmentMapping] = useState(false);
  const [incidentTypeMapping, setIncidentTypeMapping] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [incident, setIncident] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedIncidentId, setSelectedIncidentId] = useState("");

  const handleCancelView = () => {
    setDepartmentMapping(false);
    setIncidentTypeMapping(false);
    setDepartmentMapping(false);
    setSelectedDepartment("");
    setSelectedEquipment([]);
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
      debugger;
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
  }, []);
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
  }, []);

  return (
    <>
      <Toaster richColors />
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
              placeholder="Select Equipment"
              bgColor={"#91EAAA"}
            />
          </div>
          <div className="flex m-auto mt-5 bg-blue-400 p-5 rounded-xl text-lg text-white">
            <button onClick={handleMappingSubmit}>Submit Mapping</button>
          </div>
        </div>
      </Modal>
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
        className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
      >
        {" "}
        <div className="text-right flex-col bg-white rounded-lg p-2 flex justify-end items-right">
          <h1 className="text-2xl font-semibold m-2 mt-3"> Mapping</h1>
        </div>
        <div className="m-auto bg-white mt-5 rounded-xl flex justify-center p-56">
          <button
            onClick={() => {
              setDepartmentMapping(true);
            }}
            className="mt-5 mr-3 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
          >
            Department Mapping
          </button>{" "}
          <button
            onClick={() => {
              setIncidentTypeMapping(true);
            }}
            className="mt-5  ml-3 text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
          >
            Incident Type Mapping
          </button>
        </div>
      </div>
    </>
  );
}
