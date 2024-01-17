import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import MenuItem from './MenuItem'
import { CreateIncidentSidebar } from './CreateIncidentSidebar'
import ambulanceIcon from '../assets/ambulance.svg'
import regionIcon from '../assets/region.svg'
import healthcareIcon from '../assets/healthcare.svg'
import incidentIcon from '../assets/incident.svg'
import { BiSolidEditLocation, BiLocationPlus, BiCalculator, BiFirstAid } from 'react-icons/bi'
import { RxHome } from 'react-icons/rx'
import { FaRegCompass } from 'react-icons/fa'
import { MdTune } from 'react-icons/md'
import { BuildingLibraryIcon, BookOpenIcon, ChartPieIcon } from '@heroicons/react/20/solid'
import { UsersIcon } from '@heroicons/react/20/solid'
import { UserCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
const SideBar = ({ parentData }) => {
	const [isCreateIncidentOpen, setCreateIncidentOpen] = useState(false)
	const [lookUpOpen, setLookUpOpen] = useState(true)

	const navigate = useNavigate()
	const location = useLocation()

	const isActive = (path) => location.pathname === path

	const handleCreateIncidentClick = () => {
		setCreateIncidentOpen(true)
		navigate('/')
	}
	const handleDriverClick = () => {
		navigate('/Driver')
	}
	const handleHomeClick = () => {
		navigate('/')
	}

	const handleIncidentClick = () => {
		navigate('/incidents')
	}

	const HandleAmbulanceClick = () => {
		navigate('/ambulances_files')
	}

	const handleHealthCareClick = () => {
		navigate('/healthcares_files')
	}

	const handleHealthCareHomeClick = () => {
		navigate('/HealthcareHome')
	}
	const handleHealthCareDepartmentClick = () => {
		navigate('/DepartmetsHealthCare')
	}
	const handleRolesPermissionClick = () => {
		navigate('/RolesPermission')
	}
	const handleDepartmentClick = () => {
		navigate('/departments_files')
	}
	const handleHealthCareIncidentsClick = () => {
		navigate('/IncidentHealthCare')
	}
	const handleAdmiProfileClick = () => {
		navigate('/Admin-profile')
	}
	const handleIncidentTypeClick = () => {
		navigate('/Incident-type')
	}
	const handleRegionClick = () => {
		navigate('/regions_files')
	}
	const handleMapping = () => {
		navigate('/Mapping')
	}
	const handleLookup = () => {
		navigate('/Lookup')
	}
	return (
		<div className="hidden right-0  lg:fixed lg:z-40 lg:flex lg:flex-col   lg:justify-center lg:m-auto">
			<div className="flex     h-screen   ">
				{isCreateIncidentOpen && (
					<CreateIncidentSidebar onClose={() => setCreateIncidentOpen(false)} data={parentData} />
				)}
				<div
					className={`flex flex-col justify-between  ${
						isCreateIncidentOpen ? 'bg-grayBg-100' : 'bg-transparent'
					}  overflow-hidden transition-all text-center duration-30`}
				>
					<div className=" w-10/12 ml-auto">
						{/* Call Center Operator */}
						{localStorage?.role == 'Call Center Operator' || localStorage?.role == 'Admin' ? (
							<div className="mb-5 rounded-lg overflow-hidden">
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
						{localStorage?.role == 'Admin' && (
							<div className="rounded-lg overflow-hidden">
								<MenuItem icon={incidentIcon} title="Home" onClick={handleHomeClick} isActive={isActive('/')}>
									<RxHome className="w-4 h-4" />
								</MenuItem>
								<MenuItem
									icon={incidentIcon}
									title="Incidents"
									onClick={handleIncidentClick}
									isActive={isActive('/incidents')}
								>
									<BiLocationPlus className="w-4 h-4" />
								</MenuItem>
								<MenuItem
									icon={ambulanceIcon}
									title="Ambulances"
									onClick={HandleAmbulanceClick}
									isActive={isActive('/ambulances_files')}
								>
									<BiCalculator className="w-4 h-4" />
								</MenuItem>
								<MenuItem
									icon={healthcareIcon}
									title="HealthCares"
									onClick={handleHealthCareClick}
									isActive={isActive('/healthcares_files')}
								>
									<BiFirstAid className="w-4 h-4" />
								</MenuItem>
								<MenuItem
									icon={regionIcon}
									title="Regions"
									onClick={handleRegionClick}
									isActive={isActive('/regions_files')}
								>
									<FaRegCompass className="w-4 h-4" />
								</MenuItem>

								<MenuItem
									// icon={rolesPermissionIcon}
									title={`Roles & Permissions`}
									onClick={handleRolesPermissionClick}
									isActive={isActive('/RolesPermission')}
								>
									<rolesPermissionIcon />
									<UsersIcon className="w-4 h-4" />
								</MenuItem>
								<MenuItem
									// icon={rolesPermissionIcon}
									title={`Driver`}
									onClick={handleDriverClick}
									isActive={isActive('/Driver')}
								>
									<UserCircleIcon className="w-4 h-4" />
								</MenuItem>

								<MenuItem
									title={`Mapping`}
									onClick={handleMapping}
									isActive={isActive('/Mapping')}
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
									isActive={isActive('/Lookup')}
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

						{localStorage?.role == 'Healthcare Manager' && (
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
									isActive={isActive('/IncidentHealthCare')}
									style={{ padding: '10px' }}
								>
									<BiLocationPlus className="w-4 h-4" />
								</MenuItem>{' '}
								<MenuItem
									icon={healthcareIcon}
									title="Departments"
									onClick={handleHealthCareDepartmentClick}
									isActive={isActive('/IncidentHealthCare')}
									style={{ padding: '10px' }}
								>
									<BiLocationPlus className="w-4 h-4" />
								</MenuItem>
							</div>
						)}
					</div>
					{localStorage?.role == 'Admin' && (
						<div className="rounded-lg w-10/12 ml-auto overflow-hidden ">
							<MenuItem icon={healthcareIcon} onClick={handleAdmiProfileClick} title="Admin Profile">
								<MdTune className="w-4 h-4" />
							</MenuItem>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default SideBar
