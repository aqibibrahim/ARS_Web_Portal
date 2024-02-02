import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Modal, Pagination } from "antd";

import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import { Vars } from "../helpers/helpers";
import { BsArrowRightCircle, BsEye, BsSearch } from "react-icons/bs";
import { BiEdit, BiMessageAltX } from "react-icons/bi";
import EditHealthCare from "./EditHealthCareForm";
import { Spin } from "antd";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import IncidentVIewModal from "./IncidentVIewModal";
import { useAmbulanceContext } from "./AmbulanceContext";

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
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function IncidentList({}) {
  const { setSelectedIncidentId, selectedIncidentId } = useAmbulanceContext();

  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const checkboxes = [
    {
      id: "activeIncidents",
      name: "Active Incidents",
      description: "Show all active incidents.",
    },
    {
      id: "completedIncidents",
      name: "Completed Incidents",
      description: "Show all completed incidents.",
    },
  ];
  const [activeTab, setActiveTab] = useState("active");
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  const [myData, setMyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);

  const itemsPerPage = 10;
  const [totalIncidents, setTotalIncidents] = useState("");
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [submitDone, setSubmitDone] = useState(false);
  const [ishealthCare, sethealthCare] = useState(false);
  const [assignAmbulans, setAssignAmbulance] = useState(false);
  const [isDeleteID, setDeleteID] = useState(null);
  const [isDelete, setDelete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [showData, setShowData] = useState([]);
  const [showAssignAmbulance, setShowAssignAmbulance] = useState([]);
  const [disabledAmbulanceIDs, setDisabledAmbulanceIDs] = useState([]);
  const [visibleDivIndex, setVisibleDivIndex] = useState(null);
  const [isAssignHealthcareVisible, setIsAssignHealthcareVisible] =
    useState(true);
  const [assignedAmbulance, setAssignedAmbulance] = useState([]);
  const [selectedAmbID, setSelectedAmbID] = useState([]);
  const [ambulanceData, setAmbulanceData] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedHealthCareOpetion, setSelectedHealthCareOpetion] = useState(
    {}
  );
  const [totalActiveIncidents, setTotalActiveIncidents] = useState();
  const [totalCompletedIncidents, setTotalCompletedIncidents] = useState();
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [completedIncidentDetails, setCompletedIncidentDetails] = useState([]);
  const [completedIncidents, setCompletedIncidents] = useState([]);
  const [completedIncidentsView, setCompletedIncidentsView] = useState(false);

  const [deleteFormOpen, setDeleteFormOpen] = useState();
  const [selectedDeleteIncident, setSelectedDeleteIncident] = useState();
  const navigate = useNavigate();

  const handleAssignAmbulanceAndhealthCare = (data) => {
    if (data === "Assign Ambulance") {
      setAssignAmbulance(true);
      console.log(data);
      sethealthCare(false);
    } else {
      sethealthCare(true);
      setAssignAmbulance(false);
    }
  };
  const handleCancel = () => {
    setDeleteFormOpen(false);
    setSelectedDeleteIncident("");
  };
  const handleEditClick = (incident) => {
    // setSelectedIncident(incident);
    // setUpdateFormOpen(true);
    // setAssignAmbulance(true);
    // fetchAmbulanceData(incident);
    // fetchSingleIncident();
    setSelectedIncidentId(true);
    navigate("/", { state: { incidentData: incident?.id } });
    localStorage.setItem("IncidentID", incident?.id);
  };
  const handleDeleteClick = (incident) => {
    setSelectedDeleteIncident(incident?.id);
    setDeleteFormOpen(true);
  };
  const handleDelete = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.delete(
        `${Vars.domain}/incidents/${selectedDeleteIncident}`,
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
        toast.success("Incident Deleted Successfuly");
        setDeleteFormOpen(false);
        setSelectedDeleteIncident("");
      }
    } catch (error) {
      setDeleteFormOpen(false);
    }
  };
  // Get All Incidents
  const fetchincidentData = async (page = 1, status) => {
    try {
      await axios
        .get(`https://ars.disruptwave.com/api/incidents`, {
          headers: headers,
          params: {
            page: currentPage,
            per_page: itemsPerPage,
            status,
          },
        })
        .then((response) => {
          setActiveIncidents(response.data?.data);

          setTotalActiveIncidents(response.data?.data?.total || 0);
          console.log(response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    } finally {
      // Update isLoading state to false
      setIsLoading(false);
    }
  };
  const fetchCompleteincidentData = async (page = 1) => {
    try {
      await axios
        .get(`https://ars.disruptwave.com/api/view-incidents-history`, {
          headers: headers,
          params: {
            page: currentCompletedPage,
            per_page: itemsPerPage,
          },
        })
        .then((response) => {
          setCompletedIncidents(response.data?.data?.data);
          // if (status === "active") {
          //   setActiveIncidents(response.data?.data);
          // } else if (status === "Complete") {
          //   setCompletedIncidents(response.data?.data);
          // }
          setTotalCompletedIncidents(response.data?.data?.total || 0);
          console.log(response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchCompleteincidentData();
    fetchincidentData(
      currentPage,
      activeTab === "active" ? "active" : "Complete"
    );
  }, [deleteModal, currentPage, activeTab, deleteFormOpen]);
  useEffect(() => {
    fetchCompleteincidentData();
  }, [activeTab, currentCompletedPage, deleteFormOpen]);
  // Healtcare Facility Get
  useEffect(() => {
    const fetchHealthCareData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/facilities`, {
            headers: headers,
          })
          .then((response) => {
            setMenuIsOpen(response?.data?.data);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchHealthCareData();
  }, [deleteModal]);
  // Get All Available Ambulances
  const fetchAmbulanceData = async (incident) => {
    const initialSelectedAmbulanceIds =
      incident?.ambulances?.map((ambulance) => ambulance.id) || [];
    setAssignedAmbulance(initialSelectedAmbulanceIds);

    try {
      await axios
        .get(
          `https://ars.disruptwave.com/api/get-available-ambulances?incident_id=${incident?.id}`,
          {
            headers: headers,
          }
        )
        .then((response) => {
          setMyData(
            response.data?.data?.map((variant) => ({
              id: variant?.id,
              label:
                variant.model?.make?.name +
                " " +
                variant.model?.name +
                " " +
                variant?.plate_no,
              value: variant.id,
              persons_supported: variant.persons_supported,
              id_no: variant.id_no,
              distance: variant?.distance_info
                ? variant?.distance_info?.rows[0]?.elements[0]?.distance?.text
                : "Distance Not Available",
              duration:
                variant?.distance_info?.rows[0]?.elements[0]?.duration?.text,
              criteriaMatched: variant?.criteria_matched,
            }))
          );
          // setIsLoading(false);
          console.log(response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    }
  };
  // const removeAmbulance = async () => {
  // 	try {
  // 		var token = localStorage.getItem('token')
  // 		const headers = {
  // 			'Content-Type': 'application/json',
  // 			Authorization: `Bearer ${token}`,
  // 		}
  // 		const response = await axios.delete(`${Vars.domain}/drivers/${deleteID}`, {
  // 			headers,
  // 		})
  // 		console.log(response, 'res')
  // 		if (response.status === 200 || response.status === 201 || response.status === 204) {
  // 			toast.success('Driver Deleted Successfuly')
  // 			setDeleteModal(false)
  // 		}
  // 	} catch (error) {
  // 		toast.error('Something went wrong')
  // 		setDeleteModal(false)
  // 	}
  // }
  const fetchSingleIncident = async () => {
    console.log("Hello", selectedIncident);
    try {
      await axios
        .get(
          `https://ars.disruptwave.com/api/incidents/${selectedIncident.id}`,
          {
            headers: headers,
          }
        )
        .then((response) => {
          setShowAssignAmbulance(response?.data?.data?.ambulances);
          // setAssignedAmbulance(response?.data?.data?.ambulances);
          // setMyData(
          // 	response.data?.data?.map((variant) => ({
          // 		label: variant.model,
          // 		value: variant.id,
          // 		persons_supported: variant.persons_supported,
          // 		make: variant.make,
          // 		plate_no: variant.plate_no,
          // 		id_no: variant.id_no,
          // 	}))
          // )
          // setIsLoading(false);
          console.log(response?.data?.data);
        });
    } catch (e) {
      console.log(e);
    }
  };
  // 	fetchAmbulanceData()
  // }, [])

  // useEffect(() => {
  //   const fetchSingleIncident = async () => {
  //     console.log("Hello", selectedIncident);
  //     try {
  //       await axios
  //         .get(
  //           `https://ars.disruptwave.com/api/incidents/${selectedIncident.id}`,
  //           {
  //             headers: headers,
  //           }
  //         )
  //         .then((response) => {
  //           setShowAssignAmbulance(response?.data?.data?.ambulances);

  //           // setMyData(
  //           // 	response.data?.data?.map((variant) => ({
  //           // 		label: variant.model,
  //           // 		value: variant.id,
  //           // 		persons_supported: variant.persons_supported,
  //           // 		make: variant.make,
  //           // 		plate_no: variant.plate_no,
  //           // 		id_no: variant.id_no,
  //           // 	}))
  //           // )
  //           // setIsLoading(false);
  //           console.log(response?.data?.data);
  //         });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   fetchSingleIncident();
  // }, [deleteModal, assignedAmbulance]);
  const assignAmbulance = useFormik({
    initialValues: {
      ambulances: "",
    },
    onSubmit: (values) => {
      const JSON = {
        ambulances: assignedAmbulance,
      };
      if (assignedAmbulance.length === 0) {
        toast.error("please select ambulance or create new Ambulance");
      } else {
        console.log(JSON);
        const createAssignAmbulance = async () => {
          try {
            await axios
              .patch(
                `${Vars.domain}/incidents/${selectedIncident.id}`,
                JSON,
                config
              )
              .then((res) => {
                if (res.status === 200 || res.status === 201) {
                  console.log(res);
                  // setSubmitDone(!submitDone);
                  // setLoadingMessage(false);
                  toast.success("Ambulance Assign Successfuly");
                  fetchSingleIncident();
                  handleAssignAmbulanceAndhealthCare("Assign HealthCare");
                  setAmbulanceData(res?.data?.data);
                  setAssignAmbulance(false);
                  setAssignedAmbulance([]);
                  setSelectedOption({});
                } else {
                  // Handle non-success status codes
                  console.error("Request failed with status:", res.status);
                  toast.error("Ambulance Assignment Failed");
                }
              });
          } catch (e) {
            // setLoadingMessage(false);
            toast.error("Failed to assign ambulance");
            console.error(e);
          }
        };
        createAssignAmbulance();
      }
    },

    enableReinitialize: true,
  });

  const getIncidentDetail = async (id) => {
    console.log(JSON);
    try {
      var token = localStorage.getItem("token");
      console.log(token);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      await axios
        .get(`${Vars.domain}/incidents/${id}`, { headers })
        .then((res) => {
          console.log(res);

          // handleAssignAmbulanceAndhealthCare(false);
          setShowData(res?.data?.data);
          setViewOpen(true);
          console.log(res?.data?.data, "rerar");
        });
    } catch (e) {
      toast.error("failed");
      console.log(e);
    }
  };
  const assignHealthCare = useFormik({
    initialValues: {
      facility_id: "",
    },
    onSubmit: (values) => {
      const JSON = {
        facility_id: selectedHealthCareOpetion.id,
      };
      const AssignHealthCare = async () => {
        console.log(JSON);
        try {
          await axios
            .patch(
              `${Vars.domain}/incidents/${selectedIncident?.id}`,
              JSON,
              config
            )
            .then((res) => {
              console.log(res);
              toast.success("Updated Successfuly");
              setSubmitDone(!submitDone);
              setUpdateFormOpen(false);
            });
        } catch (e) {
          toast.error("failed");
          console.log(e);
        }
      };

      AssignHealthCare();
    },

    enableReinitialize: true,
  });

  const handleChange = (selectedOptions) => {
    console.log("Selected Options:", selectedOptions);
    // Ensure selectedOptions is not null or undefined
    const updatedIds = selectedOptions?.map((option) => option?.value) || [];
    console.log("Updated Ids:", updatedIds);

    setSelectedOption(selectedOptions);

    setAssignedAmbulance([...assignedAmbulance, ...updatedIds]);
    console.log("Assigned Ambulance:", assignedAmbulance);
  };

  const formatOptionLabel = ({
    label,
    persons_supported,
    id_no,
    value,
    distance,
    duration,
    criteriaMatched,
  }) => (
    <div
      className={`flex flex-col hover:bg-gray-100 cursor-pointer justify-end gap-2 border ${
        criteriaMatched ? "border-green-500 border-2" : "border-gray-400"
      } p-1 rounded-md mb-2 text-gray-800`}
    >
      <p className="text-right">{label}</p>
      <p className="text-right">Persons Supported: {persons_supported}</p>
      <p className="text-right">Id No: {id_no}</p>
      <p className="text-right text-green-500">
        {distance} . {duration}
      </p>
    </div>
  );

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Usage

  return (
    <>
      <div
        className={`w-11/12 bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 h-screen`}
      >
        <Toaster position="bottom-right" richColors />
        <div className="bg-lightGray-100 ml-16 rounded-lg     mt-2">
          <div className="p-4 text-right  bg-gray-100 ">
            <h1 className="text-xl font-semibold">Incidents</h1>
          </div>
          <div className="flex flex-row items-center p-4 space-x-4 bg-gray-100  ">
            <div className="flex flex-row space-x-2"></div>
            <div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 py-1">
              <BsSearch width={9} height={9} />
              <input
                className="bg-transparent focus:border-none border-0 w-full text-right placeholder:text-sm"
                type="text"
                placeholder="Search Incidents..."
              />
            </div>
            <div className="flex flex-row items-center p-4 space-x-4">
              <div className="flex flex-row space-x-2 rtl">
                <Tab
                  selected={activeTab === "completed"}
                  title="Completed Incidents"
                  onClick={() => setActiveTab("completed")}
                  className={`${
                    activeTab === "completed"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                />{" "}
                <Tab
                  selected={activeTab === "active"}
                  title="Active Incidents"
                  onClick={() => setActiveTab("active")}
                  className={`${
                    activeTab === "active"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="rtl">
            {isLoading ? (
              <p className="text-center justify-center flex m-auto p-56">
                <Spin size="large" />
              </p>
            ) : activeTab === "active" ? (
              <>
                <table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1">
                  <thead>
                    <tr>
                      {/* <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
  <span className="sr-only">Edit</span>
</th> */}
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        {/* Actions */}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Contact Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Created By
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Emergency Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Incident Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Informer Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeIncidents?.data?.map((incident) => (
                      <tr key={incident?.id} className="hover:bg-gray-100">
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <span className="flex items-center justify-center gap-5">
                            {/* <button
                              onClick={() => {
                                handleDeleteClick(incident);
                              }}
                              className="text-red-500 hover:text-indigo-900 border-2 rounded-lg border-red-500 py-1 px-2"
                            >
                              <BiMessageAltX />
                            </button>{" "} */}
                            <button
                              onClick={() => {
                                handleEditClick(incident);
                                sethealthCare(false);
                                setSelectedHealthCareOpetion({});
                              }}
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            >
                              <BiEdit />
                            </button>
                            <button
                              onClick={() => {
                                getIncidentDetail(incident?.id);
                                sethealthCare(false);
                                setSelectedHealthCareOpetion({});
                              }}
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            >
                              <BsEye />
                            </button>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            {incident.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {incident?.informer?.phone_numbers?.map((phone) => (
                            <div key={phone.id}>{phone.number}</div>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {" "}
                          {incident?.created_by?.first_name +
                            " " +
                            incident?.created_by?.last_name}{" "}
                          <p>{formatDateTime(incident?.created_at)}</p>
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-4 text-xs ${
                            incident?.emergency_type?.name === "Critical"
                              ? "text-red-500"
                              : incident?.emergency_type?.name === "Moderate"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {incident?.emergency_type?.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {incident?.incident_type?.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {incident?.informer?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-5 ">
                  <Pagination
                    current={currentPage}
                    className="flex text-sm text-semi-bold mb-2"
                    total={totalActiveIncidents}
                    pageSize={itemsPerPage}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} incidents`
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1">
                  <thead>
                    <tr>
                      {/* <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
  <span className="sr-only">Edit</span>
</th> */}
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        {/* Actions */}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Contact Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Updated By
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Emergency Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Incident Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-xs font-medium  tracking-wide text-gray-500"
                      >
                        Informer Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedIncidents?.map((incident) => (
                      <tr key={incident?.id} className="hover:bg-gray-100">
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <span className="flex items-center justify-center gap-5">
                            <button
                              onClick={() => {
                                // getIncidentDetail(incident?.id);
                                setCompletedIncidentsView(true);
                                sethealthCare(false);
                                setSelectedHealthCareOpetion({});
                                setCompletedIncidentDetails(incident);
                              }}
                              className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                            >
                              <BsEye />
                            </button>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            {incident.incident.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {incident?.incident?.informer?.phone_numbers?.map(
                            (phone) => (
                              <div key={phone.id}>{phone.number}</div>
                            )
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {" "}
                          {incident?.incident?.created_by?.first_name +
                            " " +
                            incident?.incident?.created_by?.last_name}
                          <p>
                            {formatDateTime(incident?.incident?.updated_at)}
                          </p>
                        </td>

                        <td
                          className={`whitespace-nowrap px-3 py-4 text-xs ${
                            incident?.incident?.emergency_type?.name ===
                            "Critical"
                              ? "text-red-500"
                              : incident?.incident?.emergency_type?.name ===
                                "Moderate"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {incident?.incident?.emergency_type?.name}{" "}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-xs">
                          {incident?.incident?.incident_type?.name}
                        </td>
                        <td className=" px-3 py-4 text-xs">
                          {incident?.incident?.informer?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-5 ">
                  <Pagination
                    current={currentCompletedPage}
                    className="flex text-sm text-semi-bold mb-2"
                    total={totalCompletedIncidents}
                    pageSize={itemsPerPage}
                    onChange={(page) => setCurrentCompletedPage(page)}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} incidents`
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <IncidentVIewModal
          viewOpen={viewOpen}
          setViewOpen={setViewOpen}
          showData={showData}
        />
        <Modal
          title="Are you sure to delete this Incident?"
          open={deleteFormOpen}
          onOk={handleDelete}
          onCancel={handleCancel}
          closable={false}
          okButtonProps={{
            style: { backgroundColor: "red" },
          }}
          okText="Delete"
        ></Modal>
        {updateFormOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-1  mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
              <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full   p-5 overflow-hidden">
                <BsArrowRightCircle
                  width={9}
                  className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                  onClick={() => {
                    setUpdateFormOpen(false);
                    setAssignAmbulance(false);
                    sethealthCare(false);
                  }}
                />
                <div>
                  <div className="">
                    <nav className="flex space-x-4" aria-label="Tabs">
                      <button
                        onClick={() =>
                          handleAssignAmbulanceAndhealthCare(
                            "Assign HealthCare"
                          )
                        }
                        className={classNames(
                          ishealthCare
                            ? "bg-white  text-gray-800"
                            : "text-gray-500 hover:text-gray-700",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        HealthCare
                      </button>
                      <button
                        onClick={() =>
                          handleAssignAmbulanceAndhealthCare("Assign Ambulance")
                        }
                        className={classNames(
                          assignAmbulans
                            ? "bg-white  text-gray-800"
                            : "text-gray-500 hover:text-gray-700",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        Ambulance
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
              {assignAmbulans && (
                <div className="px-5">
                  <p className="text-lg text-right font-semibold">
                    Ambulance Details
                  </p>
                  {selectedIncident?.ambulances?.map((ambulance, index) => (
                    <div
                      className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
                      key={ambulance.id}
                    >
                      <div className="flex justify-between gap-12  ">
                        <p className="bg-blue-200 p-2 rounded-full">
                          {index + 1}
                        </p>
                        <p>
                          {" "}
                          <span className="font-semibold">Make: </span>{" "}
                          {ambulance.model?.make?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Model:</span>{" "}
                          {ambulance?.model?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Plate#:</span>{" "}
                          {ambulance?.plate_no}
                        </p>
                      </div>
                    </div>
                  ))}
                  <form
                    className="p-5 h-[30rem] flex justify-between flex-col"
                    onSubmit={assignAmbulance.handleSubmit}
                  >
                    <div className="flex flex-row justify-between gap-4 mb-4">
                      <div className="flex flex-col space-y-2 w-full">
                        <div className="mb-5 mt-2">
                          <Select
                            value={selectedOption}
                            placeholder="Select Ambulance"
                            onChange={handleChange}
                            options={myData}
                            formatOptionLabel={formatOptionLabel}
                            isMultiple={true}
                            isClearable={true}
                            primaryColor={"blue"}
                            className="peer  w-full px-1 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-left mt-10">
                      <button
                        type="submit"
                        className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100`}
                      >
                        Assign Ambulance
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {ishealthCare && (
                <EditHealthCare
                  datatt={ambulanceData}
                  openModal={setUpdateFormOpen}
                />
              )}
            </div>
          </div>
        )}
        {completedIncidentsView && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="mx-auto mt-10 p-0 border w-[700px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
              <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
                <BsArrowRightCircle
                  width={9}
                  className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                  onClick={() => setCompletedIncidentsView(false)}
                />
                <h3 className="text-xl font-semibold ">
                  Incident Details
                  {/* <span className="text-red-600 ml-2">
                    {completedIncidentDetails?.incident?.status}
                  </span> */}
                </h3>
              </div>
              <div className="p-5 text-right">
                <p className="text-xl text-right font-bold">Informer Details</p>
                <p>
                  <span className="font-semibold">Name: </span>{" "}
                  {completedIncidentDetails?.incident?.informer?.name}
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">Phone Number: </span>{" "}
                  {
                    completedIncidentDetails?.incident.informer
                      ?.phone_numbers[0]?.number
                  }
                </p>
              </div>
              <div className="p-5 text-right">
                <p className="text-xl text-right font-bold">Incident Details</p>
                <p>
                  <span className="font-semibold">Incident Status: </span>{" "}
                  <span className="text-green-500">
                    {completedIncidentDetails?.incident?.status}
                  </span>
                </p>
                <p>
                  {" "}
                  <span className="font-semibold"> Emergency Type: </span>{" "}
                  <span
                    className={` ${
                      completedIncidentDetails?.incident?.emergency_type
                        ?.name === "Critical"
                        ? "text-red-500"
                        : completedIncidentDetails?.incident?.emergency_type
                            ?.name === "Moderate"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                    // className={`${
                    //   completedIncidentDetails?.incident?.type === "Critical"
                    //     ? "text-red-500"
                    //     : "text-green-500"
                    // }`}
                  >
                    {completedIncidentDetails?.incident?.emergency_type?.name}
                  </span>
                </p>{" "}
                <p>
                  {" "}
                  <span className="font-semibold"> Incident Type: </span>{" "}
                  <span>
                    {completedIncidentDetails?.incident?.incident_type?.name}
                  </span>{" "}
                </p>{" "}
                <p>
                  {" "}
                  <span className="font-semibold"> Description: </span>{" "}
                  <span>{completedIncidentDetails?.incident?.description}</span>{" "}
                </p>
              </div>

              <div className="p-5 text-right">
                <p className="text-xl text-right font-bold">Created Details</p>
                <p>
                  <span className="font-semibold">Created By: </span>{" "}
                  <span className="text-green-500">
                    {completedIncidentDetails?.incident?.created_by
                      ?.first_name +
                      " " +
                      completedIncidentDetails?.incident?.created_by?.last_name}
                  </span>
                </p>
                <p>
                  {" "}
                  <span className="font-semibold"> Email: </span>{" "}
                  {completedIncidentDetails?.incident?.created_by?.email}
                </p>{" "}
                <p>
                  {" "}
                  <span className="font-semibold"> Created Time: </span>{" "}
                  <span>
                    {formatDateTime(
                      completedIncidentDetails?.incident?.created_at
                    )}
                  </span>{" "}
                </p>{" "}
                <p>
                  {" "}
                  <span className="font-semibold"> Completed Time: </span>{" "}
                  <span>
                    {formatDateTime(
                      completedIncidentDetails?.incident?.updated_at
                    )}
                  </span>{" "}
                </p>
              </div>
              <div>
                <div className="px-5">
                  <p className="text-lg text-right font-semibold">
                    Ambulance Details
                  </p>
                  <div
                    className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
                    key={completedIncidentDetails.ambulance.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex gap-20 justify-evenly text-sm ">
                        {/* <p className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </p> */}
                        <p>
                          {" "}
                          <span className="font-semibold">Make: </span>{" "}
                          {
                            completedIncidentDetails.ambulance?.model?.make
                              ?.name
                          }
                        </p>
                        <p>
                          <span className="font-semibold">Model:</span>{" "}
                          {completedIncidentDetails.ambulance?.model?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Plate#:</span>{" "}
                          {completedIncidentDetails.ambulance?.plate_no}
                        </p>
                        {/* <p>
                          <span className="font-semibold">Status:</span>{" "}
                          {completedIncidentDetails.ambulance?.status}
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5">
                  <p className="text-lg text-right font-semibold">
                    Facility Details
                  </p>
                  {/* {completedIncidentDetails?.ambulances?.length > 0 ? (
                    showData?.ambulances?.map((facility, index) => ( */}
                  <div
                    className="flex flex-row justify-between p-4 bg-gray-100 mb-5 mt-2"
                    key={completedIncidentDetails.facility?.id}
                  >
                    <div className="flex justify-between gap-8  ">
                      {/* <p className="bg-blue-200 p-2 rounded-full w-7 h-7 flex items-center justify-center">
                        {index + 1}
                      </p> */}
                      <p>
                        {" "}
                        <span className="font-semibold text-base">
                          Name:{" "}
                        </span>{" "}
                        <span className="text-sm">
                          {" "}
                          {completedIncidentDetails?.facility?.name
                            ? completedIncidentDetails?.facility?.name
                            : "Not Assigned"}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span className="text-sm">
                          {" "}
                          {completedIncidentDetails?.facility?.status
                            ? completedIncidentDetails?.facility?.status
                            : "Not Available"}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Address: </span>{" "}
                        <span className="text-sm">
                          {completedIncidentDetails?.facility?.address
                            ? completedIncidentDetails?.facility?.address
                            : "Not Available"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  <p className="text-lg text-right font-semibold">
                    Driver Details
                  </p>
                  <div
                    className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
                    key={completedIncidentDetails?.driver.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between gap-12 text-sm ">
                        {/* <p className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </p> */}
                        <p>
                          {" "}
                          <span className="font-semibold">Name: </span>{" "}
                          {completedIncidentDetails.driver?.first_name}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {completedIncidentDetails.driver?.email}
                        </p>
                        <p>
                          <span className="font-semibold">Phone Number:</span>{" "}
                          {completedIncidentDetails.driver?.phone_numbers?.map(
                            (phone) => {
                              <p>{phone?.number}</p>;
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                        // onSubmit={AmbulanceDelete.handleSubmit}
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
      </div>
    </>
  );
}
