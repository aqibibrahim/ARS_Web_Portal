import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Modal, Pagination } from 'antd'

import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'sonner'
import Select from 'react-tailwindcss-select'
import { Vars } from '../helpers/helpers'
import { BsArrowRightCircle, BsEye, BsSearch } from 'react-icons/bs'
import { BiEdit, BiMessageAltX } from 'react-icons/bi'
import EditHealthCare from './EditHealthCareForm'

const Tab = ({ selected, title, onClick }) => {
	return (
		<button
			className={`px-4 py-2 transition-colors duration-150 ${
				selected ? 'bg-white' : 'bg-transparent text-gray-700'
			} focus:outline-none`}
			onClick={onClick}
		>
			{title}
		</button>
	)
}
function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}
export default function IncidentList({}) {
	var token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}

	const checkboxes = [
		{
			id: 'activeIncidents',
			name: 'Active Incidents',
			description: 'Show all active incidents.',
		},
		{
			id: 'closedIncidents',
			name: 'Closed Incidents',
			description: 'Show all closed incidents.',
		},
	]
	const [activeTab, setActiveTab] = useState('active')
	const [checkedItems, setCheckedItems] = useState({})

	const handleCheckboxChange = (event) => {
		setCheckedItems({
			...checkedItems,
			[event.target.name]: event.target.checked,
		})
	}
	const [myData, setMyData] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10
	const [totalIncidents, setTotalIncidents] = useState('')
	const [updateFormOpen, setUpdateFormOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [incidentData, setIncidentData] = useState([])
	const [selectedIncident, setSelectedIncident] = useState(null)
	const [submitDone, setSubmitDone] = useState(false)
	const [ishealthCare, sethealthCare] = useState(false)
	const [assignAmbulans, setAssignAmbulance] = useState(false)
	const [isDeleteID, setDeleteID] = useState(null)
	const [isDelete, setDelete] = useState(false)
	const navigate = useNavigate()
	const [selectedOption, setSelectedOption] = useState(null)
	const [menuIsOpen, setMenuIsOpen] = useState([])
	const [viewOpen, setViewOpen] = useState(false)
	const [showData, setShowData] = useState([])
	const [showAssignAmbulance, setShowAssignAmbulance] = useState([])
	const [disabledAmbulanceIDs, setDisabledAmbulanceIDs] = useState([])
	const [visibleDivIndex, setVisibleDivIndex] = useState(null)
	const [isAssignHealthcareVisible, setIsAssignHealthcareVisible] = useState(true)
	const [assignedAmbulance, setAssignedAmbulance] = useState([])
	const [selectedAmbID, setSelectedAmbID] = useState([])
	const [ambulanceData, setAmbulanceData] = useState({})
	const [deleteModal, setDeleteModal] = useState(false)
	const [selectedHealthCareOpetion, setSelectedHealthCareOpetion] = useState({})
	const handleAssignAmbulanceAndhealthCare = (data) => {
		if (data === 'Assign Ambulance') {
			setAssignAmbulance(true)
			console.log(data)
			sethealthCare(false)
		} else {
			sethealthCare(true)
			setAssignAmbulance(false)
		}
	}
	const handleCancel = () => {
		setDeleteModal(false)
		setDeleteID('')
	}
	const handleEditClick = (incident) => {
		setSelectedIncident(incident)
		setUpdateFormOpen(true)
		setAssignAmbulance(true)
		fetchAmbulanceData(incident)
		fetchSingleIncident()
	}
	// Get All Incidents
	const fetchincidentData = async (page = 1) => {
		try {
			await axios
				.get(`https://ars.disruptwave.com/api/incidents`, {
					headers: headers,
					params: {
						page,
						per_page: itemsPerPage,
					},
				})
				.then((response) => {
					setIncidentData(response.data?.data)
					setTotalIncidents(response.data?.data?.total || 0)
					setIsLoading(false)
					console.log(response?.data?.data)
				})
		} catch (e) {
			console.log(e)
		}
	}
	useEffect(() => {
		fetchincidentData(currentPage)
	}, [deleteModal, currentPage])
	// Healtcare Facility Get
	useEffect(() => {
		const fetchHealthCareData = async () => {
			try {
				await axios
					.get(`https://ars.disruptwave.com/api/facilities`, {
						headers: headers,
					})
					.then((response) => {
						setMenuIsOpen(response?.data?.data)
						console.log(response?.data?.data)
					})
			} catch (e) {
				console.log(e)
			}
		}
		fetchHealthCareData()
	}, [deleteModal])
	// Get All Available Ambulances
	const fetchAmbulanceData = async (incident) => {
		const initialSelectedAmbulanceIds = incident?.ambulances?.map((ambulance) => ambulance.id) || []

		setAssignedAmbulance(initialSelectedAmbulanceIds)
		console.log('Hello', incident)
		try {
			await axios
				.get(`https://ars.disruptwave.com/api/get-available-ambulances?incident_id=${incident?.id}`, {
					headers: headers,
				})
				.then((response) => {
					setMyData(
						response.data?.data?.map((variant) => ({
							label: variant.model,
							value: variant.id,
							persons_supported: variant.persons_supported,
							make: variant.make,
							plate_no: variant.plate_no,
							id_no: variant.id_no,
						}))
					)
					// setIsLoading(false);
					console.log(response?.data?.data)
				})
		} catch (e) {
			console.log(e)
		}
	}
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
		console.log('Hello', selectedIncident)
		try {
			await axios
				.get(`https://ars.disruptwave.com/api/incidents/${selectedIncident.id}`, {
					headers: headers,
				})
				.then((response) => {
					setShowAssignAmbulance(response?.data?.data?.ambulances)
					setAssignedAmbulance(response?.data?.data?.ambulances)
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
					console.log(response?.data?.data)
				})
		} catch (e) {
			console.log(e)
		}
	}
	// 	fetchAmbulanceData()
	// }, [])

	useEffect(() => {
		const fetchSingleIncident = async () => {
			console.log('Hello', selectedIncident)
			try {
				await axios
					.get(`https://ars.disruptwave.com/api/incidents/${selectedIncident.id}`, {
						headers: headers,
					})
					.then((response) => {
						setShowAssignAmbulance(response?.data?.data?.ambulances)

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
						console.log(response?.data?.data)
					})
			} catch (e) {
				console.log(e)
			}
		}
		fetchSingleIncident()
	}, [deleteModal, assignedAmbulance])
	const assignAmbulance = useFormik({
		initialValues: {
			ambulances: '',
		},
		onSubmit: (values) => {
			const JSON = {
				ambulances: assignedAmbulance,
			}
			if (assignedAmbulance.length === 0) {
				toast.error('please select ambulance or create new Ambulance')
			} else {
				console.log(JSON)
				const createAssignAmbulance = async () => {
					try {
						await axios.patch(`${Vars.domain}/incidents/${selectedIncident.id}`, JSON, config).then((res) => {
							console.log(res)
							// setSubmitDone(!submitDone);
							// setLoadingMessage(false);
							toast.success('Ambulance Assign Successfuly')
							fetchSingleIncident()
							handleAssignAmbulanceAndhealthCare('Assign HealthCare')
							setAmbulanceData(res?.data?.data)
						})
					} catch (e) {
						// setLoadingMessage(false);
						toast.error('failed')
						console.log(e)
					}
				}
				createAssignAmbulance()
			}
		},

		enableReinitialize: true,
	})
	// const handleViewClick = (incident) => {
	//   // setLongitude(null)
	//   // setLatitude(null)
	//   // setOptions(null)
	//   // setSelectedAmbulance(ambulance)
	//   // setLocationAddress({
	//   // 	latitude: ambulance?.parking_latitude,
	//   // 	longitude: ambulance?.parking_longitude,
	//   // 	address: '',
	//   // })
	//   // if (ambulance?.equipments.length === 0) {
	//   // 	setEditOptions(null)
	//   // } else {
	//   // 	setEditOptions(
	//   // 		ambulance?.equipments?.map((variant) => ({
	//   // 			label: variant.name,
	//   // 			value: variant.id,
	//   // 		}))
	//   // 	)
	//   // }
	//   setViewOpen(true);
	//   setSelectedIncident(incident);
	//   console.log(incident, "incident");
	// };
	// const assignAmbulance = useFormik({
	// 	initialValues: {
	// 		ambulance_id: '',
	// 	},
	// 	onSubmit: (values) => {
	// 		const JSON = {
	// 			ambulance_id: selectedOption[0].value,
	// 		}
	// 		const AssignAmbulance = async () => {
	// 			console.log(JSON)
	// 			try {
	// 				await axios.patch(`${Vars.domain}/incidents/${selectedIncident?.id}`, JSON, config).then((res) => {
	// 					console.log(res)
	// 					toast.success('Updated Successfuly')
	// 					setSubmitDone(!submitDone)
	// 					setSelectedOption(null)
	// 					handleAssignAmbulanceAndhealthCare(false)
	// 				})
	// 			} catch (e) {
	// 				toast.error('failed')
	// 				console.log(e)
	// 			}
	// 		}
	// 		AssignAmbulance()
	// 	},

	// 	enableReinitialize: true,
	// })
	const getIncidentDetail = async (id) => {
		console.log(JSON)
		try {
			var token = localStorage.getItem('token')
			console.log(token)
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			}

			await axios.get(`${Vars.domain}/incidents/${id}`, { headers }).then((res) => {
				console.log(res)
				toast.success('Fetched Successfuly')
				// setSubmitDone(!submitDone);
				// setSelectedOption(null);
				// handleAssignAmbulanceAndhealthCare(false);
				setShowData(res?.data?.data)
				setViewOpen(true)
				console.log(res?.data?.data, 'rerar')
			})
		} catch (e) {
			toast.error('failed')
			console.log(e)
		}
	}
	const assignHealthCare = useFormik({
		initialValues: {
			facility_id: '',
		},
		onSubmit: (values) => {
			const JSON = {
				facility_id: selectedHealthCareOpetion.id,
			}
			const AssignHealthCare = async () => {
				console.log(JSON)
				try {
					await axios.patch(`${Vars.domain}/incidents/${selectedIncident?.id}`, JSON, config).then((res) => {
						console.log(res)
						toast.success('Updated Successfuly')
						setSubmitDone(!submitDone)
						setUpdateFormOpen(false)
					})
				} catch (e) {
					toast.error('failed')
					console.log(e)
				}
			}

			AssignHealthCare()
		},

		enableReinitialize: true,
	})

	// useEffect(() => {
	//   const updatedAmbulances = (assignedAmbulance || []).filter(
	//     (id) => id !== isDeleteID
	//   );
	//   setAssignedAmbulance(updatedAmbulances);
	// }, [deleteModal]);
	const AmbulanceDelete = async () => {
		// Ensure assignedAmbulances is initialized as an array
		const updatedAmbulances = (assignedAmbulance || []).filter((id) => id !== isDeleteID)
		setAssignedAmbulance(updatedAmbulances)
		const JSON = {
			ambulances: updatedAmbulances, // Use updatedAmbulances here instead of assignedAmbulance
		}

		try {
			const res = await axios.patch(`${Vars.domain}/incidents/${selectedIncident.id}`, JSON, config)

			if (res.status === 200) {
				// Successful deletion
				setDeleteModal(false)
				toast.success('Ambulance deleted successfully')
				fetchSingleIncident()
				setAmbulanceData(res?.data?.data)
			} else {
				// Handle other HTTP status codes if needed
				toast.error(`Failed to delete ambulance. Status: ${res.status}`)
			}
		} catch (e) {
			toast.error('Failed to delete ambulance')
			console.log(e)
		}
	}

	//   try {
	//     const result = await axios.delete(
	//       `${Vars.domain}/incidents/${isDeleteID}`,
	//       config
	//     );
	//     toast.success("Deleted successfully");
	//     setSubmitDone(!submitDone);
	//     setDeleteModal(false);
	//     setIsDeleteID(null);
	//   } catch (e) {
	//     console.error(e);
	//     toast.error("Failed to delete");
	//   }
	// };
	// const handleChange = (selectedOptions) => {
	//   setSelectedOption(selectedOptions);
	//   console.log(selectedOptions);
	// };

	const handleChange = (selectedOptions) => {
		const updatedIds = selectedOptions.map((option) => option.id)
		setAssignedAmbulance(...initialSelectedAmbulanceIds, ...updatedIds)
		console.log(updatedIds)
	}
	const formatOptionLabel = ({ label, persons_supported, id_no }) => (
		<div className="flex flex-col hover:bg-gray-100 cursor-pointer justify-end gap-2 border  border-gray-400 p-1 rounded-md mb-2 text-gray-800">
			<p className="text-right">Model:{label}</p>
			<p className="text-right">Persons Supported:{persons_supported}</p>
			<p className="text-right">Id No:{id_no}</p>
		</div>
	)
	return (
		<>
			<div
				className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
			>
				<Toaster position="bottom-right" richColors />
				<div className="bg-lightGray-100 w-full h-auto rounded-lg p-2">
					<div className="p-4 text-right">
						<h1 className="text-2xl font-semibold">Incidents List</h1>
					</div>
					<div className="flex flex-row items-center p-4 space-x-4">
						<div className="flex flex-row space-x-2"></div>
						<div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 py-1">
							<BsSearch width={9} height={9} />
							<input
								className="bg-transparent focus:border-none border-0 w-full text-right"
								type="text"
								placeholder="Search Incidents..."
							/>
						</div>
						<div className="flex flex-row items-center p-4 space-x-4">
							<div className="flex flex-row space-x-2">
								<Tab
									selected={activeTab === 'active'}
									title="Active Incidents"
									onClick={() => setActiveTab('active')}
								/>
								<Tab
									selected={activeTab === 'closed'}
									title="Closed Incidents"
									onClick={() => setActiveTab('closed')}
								/>
							</div>
						</div>
					</div>
					<div className="rtl">
						{isLoading ? (
							<p className="text-center text-xl text-primary-100">Loading...</p>
						) : incidentData.length == 0 ? (
							<p className="text-center text-xl text-primary-100">No data available</p>
						) : (
							<>
								{' '}
								<table className="min-w-full divide-y divide-gray-300 text-right">
									<thead>
										<tr>
											{/* <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
										<span className="sr-only">Edit</span>
									</th> */}
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Actions
											</th>
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Status
											</th>
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Contact Number
											</th>
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Created By
											</th>
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Emergency Type
											</th>
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Incident Type
											</th>
											<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
												Informer Name
											</th>
										</tr>
									</thead>
									<tbody>
										{incidentData?.data?.map((incident) => (
											<tr key={incident?.id} className="hover:bg-gray-100">
												<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
													<span className="flex items-center justify-center gap-5">
														<button
															onClick={() => {
																handleEditClick(incident)
																sethealthCare(false)
																setSelectedHealthCareOpetion({})
															}}
															className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
														>
															<BiEdit />
														</button>
														<button
															onClick={() => {
																getIncidentDetail(incident?.id)
																sethealthCare(false)
																setSelectedHealthCareOpetion({})
															}}
															className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
														>
															<BsEye />
														</button>
													</span>
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-md">
													<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
														{incident.status}
													</span>
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-md">
													{incident?.informer?.phone_numbers?.map((phone) => (
														<div key={phone.id}>{phone.number}</div>
													))}
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-md">
													{' '}
													{incident?.created_by?.first_name + ' ' + incident?.created_by?.last_name}
												</td>

												<td
													className={`whitespace-nowrap px-3 py-4 text-md ${
														incident.type === 'Critical' ? 'text-red-500' : 'text-green-500'
													}`}
												>
													{incident?.type}
												</td>
												<td className="whitespace-nowrap px-3 py-4 text-md">{incident?.incident_type?.name}</td>
												<td className="whitespace-nowrap px-3 py-4 text-md">{incident?.informer?.name}</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className="flex justify-end mt-5 mb-2">
									<Pagination
										current={currentPage}
										className="flex text-lg text-semi-bold"
										total={totalIncidents}
										pageSize={itemsPerPage}
										onChange={(page) => setCurrentPage(page)}
										showSizeChanger={false}
										showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} incidents`}
									/>
								</div>
							</>
						)}
					</div>
				</div>
				{viewOpen && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
						<div className="mx-auto mt-10 p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
							<div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
								<BsArrowRightCircle
									width={9}
									className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
									onClick={() => setViewOpen(false)}
								/>
								<h3 className="text-xl font-semibold text-red-500">
									{selectedIncident?.incident_type?.name}
									<span className="text-lime-600 ml-2">{selectedIncident?.type}</span>
								</h3>
							</div>
							<div className="p-5 text-right">
								<p className="text-xl text-right font-bold">Informer Details</p>
								<p>
									{' '}
									<span className="font-semibold">Name: </span> {showData?.informer?.name}
								</p>
								<p>
									{' '}
									<span className="font-semibold">Phone Number: </span> {showData?.informer?.phone_numbers[0]?.number}
								</p>
							</div>
							<div>
								{/* <div className=" text-right p-5">
                <p>
                  {" "}
                  <span className="font-semibold text-right">
                    Phone No:{" "}
                  </span>{" "}
                  {selectedIncident?.informer?.phone_numbers[0]?.number}
                </p> */}
								{/* <p>
                  <span className="font-semibold">Model:</span>{" "}
                  {selectedAmbulance?.model}
                </p>
                <p>
                  <span className="font-semibold">Plate#:</span>{" "}
                  {selectedAmbulance?.plate_no}
                </p> */}
								{/* </div> */}
								<div className="px-5">
									<p className="text-lg text-right font-semibold">Ambulance Details</p>
									{showData?.ambulances?.length > 0 ? (
										showData?.ambulances?.map((ambulance, index) => (
											<div className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2" key={ambulance.id}>
												<div className="flex flex-col">
													<div className="flex justify-between gap-12  ">
														<p className="bg-blue-200 p-2 rounded-full">{index + 1}</p>
														<p>
															{' '}
															<span className="font-semibold">Make: </span> {ambulance?.make}
														</p>
														<p>
															<span className="font-semibold">Model:</span> {ambulance?.model}
														</p>
														<p>
															<span className="font-semibold">Plate#:</span> {ambulance?.plate_no}
														</p>
													</div>
													<p className="text-md m-5 text-right font-semibold">Equipments Details</p>
													{ambulance.equipments.map((equipmentDetails, index) => (
														<div
															className="flex flex-row justify-between p-5 px-10  w-full  bg-gray-200 mb-5 mt-2"
															key={equipmentDetails?.id}
														>
															<div className="flex justify-between gap-16 w-full   ">
																<p className="bg-blue-200 p-2 rounded-full">{index + 1}</p>
																<p>
																	{' '}
																	<span className="font-semibold">Name: </span>
																	{equipmentDetails?.name}
																</p>
																<p>
																	<span className="font-semibold">Status:</span> {equipmentDetails?.status}
																</p>
															</div>
														</div>
													))}
												</div>
											</div>
										))
									) : (
										<p className="text-right">No Data Found</p>
									)}
								</div>

								<div className="px-5">
									<p className="text-lg text-right font-semibold">Facility Details</p>
									{showData?.ambulances?.length > 0 ? (
										showData?.ambulances?.map((facility, index) => (
											<div className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2" key={facility?.id}>
												<div className="flex justify-between gap-10  ">
													<p className="bg-blue-200 p-2 rounded-full">{index + 1}</p>
													<p>
														{' '}
														<span className="font-semibold">Name: </span> {facility?.facility?.name}
													</p>
													<p>
														<span className="font-semibold">Status:</span> {facility?.facility?.status}
													</p>
													<p>
														<span className="font-semibold">Address: </span> {facility?.facility?.address}
													</p>
												</div>
											</div>
										))
									) : (
										<p className="text-right">No Data Found</p>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
				{updateFormOpen && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
						<div className="relative top-1 -left-[17rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
							<div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full   p-5 overflow-hidden">
								<BsArrowRightCircle
									width={9}
									className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
									onClick={() => {
										setUpdateFormOpen(false)
										setAssignAmbulance(false)
										sethealthCare(false)
									}}
								/>
								<div>
									<div className="">
										<nav className="flex space-x-4" aria-label="Tabs">
											<button
												onClick={() => handleAssignAmbulanceAndhealthCare('Assign HealthCare')}
												className={classNames(
													ishealthCare ? 'bg-white  text-gray-800' : 'text-gray-500 hover:text-gray-700',
													'rounded-md px-3 py-2 text-sm font-medium'
												)}
											>
												HealthCare
											</button>
											<button
												onClick={() => handleAssignAmbulanceAndhealthCare('Assign Ambulance')}
												className={classNames(
													assignAmbulans ? 'bg-white  text-gray-800' : 'text-gray-500 hover:text-gray-700',
													'rounded-md px-3 py-2 text-sm font-medium'
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
									<p className="text-lg text-right font-semibold">Ambulance Details</p>
									{selectedIncident?.ambulances?.map((ambulance, index) => (
										<div className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2" key={ambulance.id}>
											<div className="flex justify-between gap-12  ">
												<p className="bg-blue-200 p-2 rounded-full">{index + 1}</p>
												<p>
													{' '}
													<span className="font-semibold">Make: </span> {ambulance.make}
												</p>
												<p>
													<span className="font-semibold">Model:</span> {ambulance?.model}
												</p>
												<p>
													<span className="font-semibold">Plate#:</span> {ambulance?.plate_no}
												</p>
												{/* <button
                          className=" text-red-600 hover:text-indigo-900 border-2 border-red-600 rounded-lg py-1 px-2"
                          onClick={() => {
                            setDeleteID(ambulance?.id);
                            setDeleteModal(true);
                          }}
                        >
                          <BiMessageAltX />
                        </button> */}
											</div>
										</div>
									))}
									<form className="p-5 h-[30rem] flex justify-between flex-col" onSubmit={assignAmbulance.handleSubmit}>
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
														primaryColor={'blue'}
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
							{ishealthCare && <EditHealthCare datatt={ambulanceData} openModal={setUpdateFormOpen} />}
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
												<BsArrowRightCircle className="h-6 w-6" aria-hidden="true" />
											</button>
										</div>
										<div className="flex justify-center items-center">
											<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
												<Dialog.Title as="h3" className="text-base sr-only font-semibold leading-6 text-gray-900">
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
			<Modal
				title="Are you sure to delete this Driver?"
				open={deleteModal}
				onOk={AmbulanceDelete}
				onCancel={handleCancel}
				closable={false}
				okButtonProps={{
					style: { backgroundColor: 'red' },
				}}
				okText="Delete"
			></Modal>
		</>
	)
}
