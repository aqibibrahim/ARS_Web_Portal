import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MenuItem from "./MenuItem";
import { CreateIncidentSidebar } from "./CreateIncidentSidebar";
import ambulanceIcon from "../assets/ambulance.svg";
import regionIcon from "../assets/region.svg";
import healthcareIcon from "../assets/healthcare.svg";
import incidentIcon from "../assets/incident.svg";
import {
  BiSolidEditLocation,
  BiLocationPlus,
  BiCalculator,
  BiFirstAid,
} from "react-icons/bi";
import { RxHome } from "react-icons/rx";
import { FaRegCompass } from "react-icons/fa";
import { MdTune } from "react-icons/md";
import {
  BuildingLibraryIcon,
  BookOpenIcon,
  ChartPieIcon,
} from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/20/solid";
import {
  UserCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
const SideBar = ({ parentData }) => {
  const [isCreateIncidentOpen, setCreateIncidentOpen] = useState(false);
  const [lookUpOpen, setLookUpOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleCreateIncidentClick = () => {
    setCreateIncidentOpen(true);
    navigate("/");
  };
  const handleDriverClick = () => {
    setCreateIncidentOpen(false);
    navigate("/Driver");
  };
  const handleHomeClick = () => {
    setCreateIncidentOpen(false);

    navigate("/");
  };

  const handleIncidentClick = () => {
    setCreateIncidentOpen(false);
    navigate("/incidents");
  };

  const HandleAmbulanceClick = () => {
    setCreateIncidentOpen(false);
    navigate("/ambulances_files");
  };

  const handleHealthCareClick = () => {
    navigate("/healthcares_files");
    setCreateIncidentOpen(false);
  };

  const handleHealthCareHomeClick = () => {
    navigate("/HealthcareHome");
    setCreateIncidentOpen(false);
  };
  const handleHealthCareDepartmentClick = () => {
    navigate("/DepartmetsHealthCare");
    setCreateIncidentOpen(false);
  };
  const handleRolesPermissionClick = () => {
    navigate("/RolesPermission");
    setCreateIncidentOpen(false);
  };
  const handleDepartmentClick = () => {
    navigate("/departments_files");
    setCreateIncidentOpen(false);
  };
  const handleHealthCareIncidentsClick = () => {
    navigate("/IncidentHealthCare");
    setCreateIncidentOpen(false);
  };
  const handleAdmiProfileClick = () => {
    navigate("/Admin-profile");
    setCreateIncidentOpen(false);
  };
  const handleIncidentTypeClick = () => {
    navigate("/Incident-type");
    setCreateIncidentOpen(false);
  };
  const handleRegionClick = () => {
    navigate("/regions_files");
    setCreateIncidentOpen(false);
  };
  const handleMapping = () => {
    navigate("/Mapping");
    setCreateIncidentOpen(false);
  };
  const handleLookup = () => {
    navigate("/Lookup");
    setCreateIncidentOpen(false);
  };
  return (
    <div className=" right-0 z-50 lg:fixed lg:z-40 lg:flex lg:flex-col -mx-3  lg:justify-center ">
      <div className="     ">
        {isCreateIncidentOpen && (
          <div className="flex">
            {" "}
            <CreateIncidentSidebar
              onClose={() => setCreateIncidentOpen(false)}
              data={parentData}
            />
          </div>
        )}
        <div
          className={`flex flex-col   ${
            isCreateIncidentOpen ? "bg-grayBg-100 " : "bg-transparent"
          }  overflow-hidden  text-center duration-30`}
        >
          <div className=" w-8/12 mt-2 ml-2 -px-4">
            {/* Call Center Operator */}
            {localStorage?.role == "Call Center Operator" ||
            localStorage?.role == "Admin" ? (
              <div className="mb-5  rounded-lg overflow-hidden">
                <MenuItem
                  title="Create Incident"
                  bgColor="primary"
                  fontColor="white"
                  onClick={handleCreateIncidentClick}
                >
                  <BiSolidEditLocation className="w-4 h-4" />
                </MenuItem>
              </div>
            ) : null}
            {localStorage?.role == "Admin" && (
              <div className="rounded-lg overflow-hidden">
                <MenuItem
                  icon={incidentIcon}
                  title="Home"
                  onClick={handleHomeClick}
                  isActive={isActive("/")}
                >
                  <RxHome className="w-4 h-4" />
                </MenuItem>
                <MenuItem
                  icon={incidentIcon}
                  title="Incidents"
                  onClick={handleIncidentClick}
                  isActive={isActive("/incidents")}
                >
                  <BiLocationPlus className="w-4 h-4" />
                </MenuItem>
                <MenuItem
                  icon={ambulanceIcon}
                  title="Ambulances"
                  onClick={HandleAmbulanceClick}
                  isActive={isActive("/ambulances_files")}
                >
                  <BiCalculator className="w-4 h-4" />
                </MenuItem>
                <MenuItem
                  icon={healthcareIcon}
                  title="HealthCares"
                  onClick={handleHealthCareClick}
                  isActive={isActive("/healthcares_files")}
                >
                  <BiFirstAid className="w-4 h-4" />
                </MenuItem>
                <MenuItem
                  icon={regionIcon}
                  title="Regions"
                  onClick={handleRegionClick}
                  isActive={isActive("/regions_files")}
                >
                  <FaRegCompass className="w-4 h-4" />
                </MenuItem>

                <MenuItem
                  // icon={rolesPermissionIcon}
                  title={`Roles & Permissions`}
                  onClick={handleRolesPermissionClick}
                  isActive={isActive("/RolesPermission")}
                >
                  {/* <rolesPermissionIcon /> */}
                  <UsersIcon className="w-4 h-4" />
                </MenuItem>
                <MenuItem
                  // icon={rolesPermissionIcon}
                  title={`Driver`}
                  onClick={handleDriverClick}
                  isActive={isActive("/Driver")}
                >
                  <UserCircleIcon className="w-4 h-4" />
                </MenuItem>

                <MenuItem
                  title={`Mapping`}
                  onClick={handleMapping}
                  isActive={isActive("/Mapping")}
                  lookUpOpen={lookUpOpen}

                  // {
                  //   title: "Sub Item 2",
                  //   onClick: () => console.log("Sub Item 2 clicked"),
                  // },
                  // Add more sub-menu items as needed
                >
                  <BookOpenIcon className="w-4 h-4" />
                </MenuItem>
                <MenuItem
                  title={`Lookup`}
                  onClick={handleLookup}
                  isActive={isActive("/Lookup")}
                  lookUpOpen={lookUpOpen}

                  // {
                  //   title: "Sub Item 2",
                  //   onClick: () => console.log("Sub Item 2 clicked"),
                  // },
                  // Add more sub-menu items as needed
                >
                  <ChartPieIcon className="w-4 h-4" />
                </MenuItem>
              </div>
            )}

            {localStorage?.role == "Healthcare Manager" && (
              <div className="rounded-lg overflow-hidden">
                {/* <MenuItem
									icon={incidentIcon}
									title="Home"
									onClick={handleHealthCareHomeClick}
									isActive={isActive('/HealthcareHome')}
								>
									<RxHome className="w-4 h-4" />
								</MenuItem> */}
                <MenuItem
                  icon={healthcareIcon}
                  title="Incidents"
                  onClick={handleHealthCareIncidentsClick}
                  isActive={isActive("/IncidentHealthCare")}
                  style={{ padding: "10px" }}
                >
                  <BiLocationPlus className="w-4 h-4" />
                </MenuItem>{" "}
                <MenuItem
                  icon={healthcareIcon}
                  title="Departments"
                  onClick={handleHealthCareDepartmentClick}
                  isActive={isActive("/IncidentHealthCare")}
                  style={{ padding: "10px" }}
                >
                  <BiLocationPlus className="w-4 h-4" />
                </MenuItem>
              </div>
            )}
          </div>
          {localStorage?.role == "Admin" && (
            // <div className="rounded-lg">
            <div className=" w-8/12 mt-20 ml-1 rounded-lg overflow-hidden">
              <MenuItem
                icon={healthcareIcon}
                onClick={handleAdmiProfileClick}
                title="Admin Profile"
              >
                <MdTune className="w-4 h-4" />
              </MenuItem>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
