import React, { useState } from "react";
import SideBar from "./components/SIdebar";
import Maps from "./components/Maps";
import TopBar from "./components/Topbar";
import { Route, Routes } from "react-router-dom";
import IncidentList from "./components/IncidentList";
import AmbulanceList from "./components/ambulances/AmbulanceList";
import HealthcareList from "./components/healthcare/HealthcareList";
import Regions from "./components/regions/Regions";
import Equipment from "./components/Equipment";
import RolesPermission from "./components/RolesPermission";
import Departments from "./components/Departments";
import AdminProfile from "./components/Admin Profile/AdminProfile";
import ChangePassword from "./components/Admin Profile/ChangePassword";
import DepartmentsFiles from "./components/Super Admin Dashboard/Departments/DepartmentsFiles";
import AmbulanceFiles from "./components/Super Admin Dashboard/Ambulance/AmbulanceFiles";
import HealthCareFiles from "./components/Super Admin Dashboard/HealthCare/HealthCareFiles";
import RegionFiles from "./components/Super Admin Dashboard/Region/RegionFiles";
import DriverMain from "./components/DriverMain";

import HealthCareDepartments from "./components/HealthCareDashboard/Departments";
import Home from "./components/HealthCareDashboard/Home";
import IncidentHealthCare from "./components/HealthCareDashboard/IncidentHealthCare";
const Dashboard = () => {
  const [childData, setChildData] = useState(null);
  const handleChildData = (data) => {
    setChildData(data);
    console.log(data);
  };
  return (
    <div className="mx-auto">
      <SideBar parentData={childData} />
      <div className="bg-grayBg-100 ">
        <Routes>
          <Route path="/" element={<Maps onData={handleChildData} />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/ambulances" element={<AmbulanceList />} />
          <Route path="/healthcares" element={<HealthcareList />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments_files" element={<DepartmentsFiles />} />
          <Route path="/healthcares_files" element={<HealthCareFiles />} />
          <Route path="/regions_files" element={<RegionFiles />} />
          <Route path="/ambulances_files" element={<AmbulanceFiles />} />
          <Route path="/HomeHealthCare" element={<Maps />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/RolesPermission" element={<RolesPermission />} />
          <Route path="/Driver" element={<DriverMain />} />
          <Route path="/change-admin-password" element={<ChangePassword />} />
          <Route
            path="/DepartmetsHealthCare"
            element={<HealthCareDepartments />}
          />
          <Route path="/IncidentHealthCare" element={<IncidentHealthCare />} />
          <Route path="/IncidentHealthCareHome" element={<Home />} />
        </Routes>
      </div>
      <TopBar />
    </div>
  );
};

export default Dashboard;
