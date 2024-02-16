import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AmbulanceViewModal from './AmbulanceViewModal'
export default function Notifications({ notificationsData, onCloseDropdown }) {
	const navigate = useNavigate()
	const [selectedNotification, setSelectedNotification] = useState(null)
	const [viewOpen, setViewOpen] = useState(false)
	useEffect(() => {
		if (selectedNotification !== null) {
			setViewOpen(true) // Open the modal once selectedNotification is not null
		}
	}, [selectedNotification])
	const AmbulanceIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
			<path
				fillRule="evenodd"
				d="M18 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-6-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 12H2v2h3v-2zm14 1h-3v2h3v-2zm-4-6V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v4H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4h4a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-4zM8 5h8v2H8V5zm8 10H8v-2h8v2zm0-4H8V9h8v2z"
				clipRule="evenodd"
			/>
		</svg>
	)
	const handleViewClick = (notification) => {
		console.log('Notitifcation data ambulance', notification.payload)
		setSelectedNotification(notification.payload)
		navigate('/ambulances_files')
		// setViewOpen(true) // Open the modal
	}
	console.log('Notification data:', notificationsData)
	console.log('Selected notification:', selectedNotification)

	const closeNotification = () => {
		onCloseDropdown() // Navigate to ambulance page
	}
	return (
		<div>
			{notificationsData ? (
				notificationsData.map((data) => (
					<>
						<div className="bg-white w-full px-2 mb-4">
							<div key={data.payload.id}>
								<p className="text-base font-bold text-right">{data.message}</p>
								{/* <p className="text-md text-right">{data.description}</p> */}
							</div>
							<div className="flex justify-end mt-2">
								{data.type.includes('AMBULANCE_AVAILABLE') ? (
									<>
										<button
											className="flex flex-row text-primary-100 bg-white rounded-md border-2 border-primary-100 my-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
											onClick={() => {
												handleViewClick(data)
												if (selectedNotification) {
													closeNotification()
												}
											}}
										>
											<AmbulanceIcon /> View
										</button>
									</>
								) : (
									<button
										className="text-primary-100 bg-white rounded-md border-2 border-primary-100 my-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
										onClick={() => handleViewClick(data)}
									>
										View
									</button>
								)}
							</div>
						</div>
					</>
				))
			) : (
				<p className="bg-white w-full p-4 mb-4 text-right">No Notifications Yet...</p>
			)}
			<AmbulanceViewModal viewOpen={viewOpen} setViewOpen={setViewOpen} selectedAmbulance={selectedNotification} />
		</div>
	)
}
