import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MenuItem from "./MenuItem";
import { CreateIncidentSidebar } from "./CreateIncidentSidebar";
import ambulanceIcon from "../assets/ambulance.svg";
import regionIcon from "../assets/region.svg";
import healthcareIcon from "../assets/healthcare.svg";
import AdminSettingsIcon from "../assets/settings-Admin.svg";
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
import { BuildingLibraryIcon, BookOpenIcon } from "@heroicons/react/20/solid";
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
    navigate("/Driver");
  };
  const handleHomeClick = () => {
    navigate("/");
  };

  const handleIncidentClick = () => {
    navigate("/incidents");
  };

  const HandleAmbulanceClick = () => {
    navigate("/ambulances_files");
  };

  const handleHealthCareClick = () => {
    navigate("/healthcares_files");
  };

  const handleHealthCareHomeClick = () => {
    navigate("/IncidentHealthCareHome");
  };
  const handleHealthCareDepartmentClick = () => {
    navigate("/DepartmetsHealthCare");
  };
  const handleRolesPermissionClick = () => {
    navigate("/RolesPermission");
  };
  const handleDepartmentClick = () => {
    navigate("/departments_files");
  };
  const handleHealthCareIncidentsClick = () => {
    navigate("/IncidentHealthCare");
  };
  const handleAdmiProfileClick = () => {
    navigate("/Admin-profile");
  };
  const handleIncidentTypeClick = () => {
    navigate("/Incident-type");
  };
  const handleRegionClick = () => {
    navigate("/regions_files");
  };
  const handleMapping = () => {
    navigate("/Mapping");
  };

  return (
    <div className="hidden right-0 lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col ">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-row gap-y-3 overflow-y-auto h-screen border-r border-gray-200 bg-transparent ">
        {isCreateIncidentOpen && (
          <CreateIncidentSidebar
            onClose={() => setCreateIncidentOpen(false)}
            data={parentData}
          />
        )}
        <div
          className={`flex flex-col justify-between  ${
            isCreateIncidentOpen ? "bg-grayBg-100" : "bg-transparent"
          }  overflow-hidden p-1 transition-all duration-30`}
        >
          <div>
            {/* Call Center Operator */}
            {localStorage?.role == "Call Center Operator" ||
            localStorage?.role == "Admin" ? (
              <div className="mb-5 rounded-lg overflow-hidden">
                <MenuItem
                  title="Create Incident"
                  bgColor="primary"
                  fontColor="white"
                  onClick={handleCreateIncidentClick}
                >
                  <BiSolidEditLocation className="w-5 h-5" />
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
                  <RxHome className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={incidentIcon}
                  title="Incidents"
                  onClick={handleIncidentClick}
                  isActive={isActive("/incidents")}
                >
                  <BiLocationPlus className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={ambulanceIcon}
                  title="Ambulances"
                  onClick={HandleAmbulanceClick}
                  isActive={isActive("/ambulances_files")}
                >
                  <BiCalculator className="w-6 h-6" />
                </MenuItem>
                <MenuItem
                  icon={healthcareIcon}
                  title="HealthCares"
                  onClick={handleHealthCareClick}
                  isActive={isActive("/healthcares_files")}
                >
                  <BiFirstAid className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={regionIcon}
                  title="Regions"
                  onClick={handleRegionClick}
                  isActive={isActive("/regions_files")}
                >
                  <FaRegCompass className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={healthcareIcon}
                  title="Departments"
                  onClick={handleDepartmentClick}
                  isActive={isActive("/departments_files")}
                >
                  <BuildingLibraryIcon className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  // icon={rolesPermissionIcon}
                  title={`Roles & Permissions`}
                  onClick={handleRolesPermissionClick}
                  isActive={isActive("/RolesPermission")}
                >
                  <rolesPermissionIcon />
                  <UsersIcon className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  // icon={rolesPermissionIcon}
                  title={`Driver`}
                  onClick={handleDriverClick}
                  isActive={isActive("/Driver")}
                >
                  <UserCircleIcon className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  // icon={rolesPermissionIcon}
                  title={`Incidents`}
                  onClick={handleIncidentTypeClick}
                  isActive={isActive("/Incidents")}
                >
                  <ExclamationCircleIcon className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  title={`Mapping`}
                  onClick={handleMapping}
                  isActive={isActive("/Lookup")}
                  lookUpOpen={lookUpOpen}

                  // {
                  //   title: "Sub Item 2",
                  //   onClick: () => console.log("Sub Item 2 clicked"),
                  // },
                  // Add more sub-menu items as needed
                >
                  <BookOpenIcon className="w-5 h-5" />
                </MenuItem>
                {/* <MenuItem
        title="Sample Item"
        bgColor="primary"
        fontColor="white"
        onClick={handleItemClick}
      >
        <span role="img" aria-label="Emoji">
          😀
        </span>
      </MenuItem> */}
              </div>
            )}
            {/* {localStorage?.role == "Admin" && (
              <div className="rounded-lg overflow-hidden">
                <MenuItem
                  icon={incidentIcon}
                  title="Home"
                  onClick={handleHomeClick}
                  isActive={isActive("/")}
                >
                  <RxHome className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={incidentIcon}
                  title="Incidents"
                  onClick={handleIncidentClick}
                  isActive={isActive("/incidents")}
                >
                  <BiLocationPlus className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={ambulanceIcon}
                  title="Ambulances"
                  onClick={HandleAmbulanceClick}
                  isActive={isActive("/ambulances_files")}
                >
                  <BiCalculator className="w-6 h-6" />
                </MenuItem>
                <MenuItem
                  icon={healthcareIcon}
                  title="HealthCares"
                  onClick={handleHealthCareClick}
                  isActive={isActive("/healthcares_files")}
                >
                  <BiFirstAid className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={regionIcon}
                  title="Regions"
                  onClick={handleRegionClick}
                  isActive={isActive("/regions_files")}
                >
                  <FaRegCompass className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  icon={healthcareIcon}
                  title="Departments"
                  onClick={handleDepartmentClick}
                  isActive={isActive("/departments_files")}
                >
                  <BuildingLibraryIcon className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  title={`Roles & Permissions`}
                  onClick={handleRolesPermissionClick}
                  isActive={isActive("/RolesPermission")}
                >
                  <UsersIcon className="w-5 h-5" />
                </MenuItem>
                <MenuItem
                  title={`Driver`}
                  onClick={handleDriverClick}
                  isActive={isActive("/Driver")}
                >
                  <UserCircleIcon className="w-5 h-5" />
                </MenuItem>
              </div>
            )} */}
            {localStorage?.role == "Healthcare Manager" && (
              <div className="rounded-lg overflow-hidden">
                {/* <MenuItem
                  icon={incidentIcon}
                  title="Home"
                  onClick={handleHealthCareHomeClick}
                  isActive={isActive("/IncidentHealthCareHome")}
                >
                  <RxHome className="w-5 h-5" />
                </MenuItem> */}
                {/* <MenuItem
                  icon={ambulanceIcon}
                  title="Ambulances"
                  onClick={HandleAmbulanceClick}
                  isActive={isActive("/ambulances_files")}
                >
                  <BiCalculator className="w-6 h-6" />
                </MenuItem> */}
                <MenuItem
                  icon={healthcareIcon}
                  title="Incidents"
                  onClick={handleHealthCareIncidentsClick}
                  isActive={isActive("/IncidentHealthCare")}
                >
                  <BiLocationPlus className="w-5 h-5" />
                </MenuItem>{" "}
                <MenuItem
                  icon={healthcareIcon}
                  title="Departments"
                  onClick={handleHealthCareDepartmentClick}
                  isActive={isActive("/IncidentHealthCare")}
                >
                  <BiLocationPlus className="w-5 h-5" />
                </MenuItem>
                {/* <MenuItem
                  icon={healthcareIcon}
                  title="Departments"
                  onClick={handleHealthCareDepartmentClick}
                  isActive={isActive("/DepartmetsHealthCare")}
                >
                  <BuildingLibraryIcon className="w-5 h-5" />
                </MenuItem> */}
              </div>
            )}
          </div>
          {localStorage?.role == "Admin" && (
            <div className="rounded-lg overflow-hidden ">
              <MenuItem
                icon={AdminSettingsIcon}
                onClick={handleAdmiProfileClick}
                title="Admin Profile"
              >
                <MdTune className="w-5 h-5" />
              </MenuItem>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
