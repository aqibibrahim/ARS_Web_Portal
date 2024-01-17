import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import Maps from './components/Maps'
import SideBar from './components/SIdebar'
import TopBar from './components/Topbar'
import IncidentList from './components/IncidentList'
import AmbulanceList from './components/ambulances/AmbulanceList'
import HealthcareList from './components/healthcare/HealthcareList'
import Regions from './components/regions/Regions'
import Login from './components/Login'
import Equipment from './components/Equipment'
import Departments from './components/Departments'
import Home from './components/HealthCareDashboard/HealthcareHome'
import HealthCareDepartments from './components/HealthCareDashboard/Departments'
import Dashboard from './Dashboard'
import { AmbulanceProvider } from './components/AmbulanceContext'
function App() {
	return (
		<BrowserRouter>
			<AmbulanceProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/*" element={<Dashboard />} />
				</Routes>
			</AmbulanceProvider>
		</BrowserRouter>
	)
}

export default App
