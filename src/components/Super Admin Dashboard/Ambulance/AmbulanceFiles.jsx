import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BsArrowRightCircle, BsEye, BsSearch } from 'react-icons/bs'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'sonner'
import Select from 'react-tailwindcss-select'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import { BiEdit } from 'react-icons/bi'
const AmbulanceFiles = () => {
	var token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [myData, setMyData] = useState([])

	const [loadingMessage, setLoadingMessage] = useState(false)
	const [updateFormOpen, setUpdateFormOpen] = useState(false)
	const [viewOpen, setViewOpen] = useState(false)

	const [isLoading, setIsLoading] = useState(true)
	const [ambulanceData, setAmbulanceData] = useState([])
	const [selectedAmbulance, setSelectedAmbulance] = useState(null)
	const [submitDone, setSubmitDone] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [latitude, setLatitude] = useState(null)
	const [longitude, setLongitude] = useState(null)
	const [isDeleteID, setDeleteID] = useState(null)
	const [isDelete, setDelete] = useState(false)
	const [options, setOptions] = useState([])
	const [locationAddress, setLocationAddress] = useState({})
	const [open, setOpen] = useState(false)
	const [editOptions, setEditOptions] = useState(null)
	const navigate = useNavigate()
	const HandelOpenMap = () => {
		setOpen(true)
		console.log('value:')
	}
	const handleChange = (value) => {
		setOptions(value)
		console.log('value:', value)
	}
	const handleChangeEquiments = (value) => {
		setEditOptions(value)
		console.log('value:', value)
	}
	console.log(options)

	const handleCreateAmbulanceClick = () => {
		setLongitude(null)
		setLatitude(null)
		setOptions(null)
		setLocationAddress({
			latitude: '',
			longitude: '',
			address: '',
		})
		setIsModalOpen(true)
	}

	const handleEditClick = (ambulance) => {
		setLongitude(null)
		setLatitude(null)
		setOptions(null)
		setSelectedAmbulance(ambulance)
		setLocationAddress({
			latitude: ambulance?.parking_latitude,
			longitude: ambulance?.parking_longitude,
			address: '',
		})
		if (ambulance?.equipments.length === 0) {
			setEditOptions(null)
		} else {
			setEditOptions(
				ambulance?.equipments?.map((variant) => ({
					label: variant.name,
					value: variant.id,
				}))
			)
		}
		setUpdateFormOpen(true)
	}
	const handleViewClick = (ambulance) => {
		setViewOpen(true)
		setSelectedAmbulance(ambulance)
	}
	useEffect(() => {
		const fetchAmbulanceData = async () => {
			try {
				await axios
					.get(`${window.$BackEndUrl}/ambulances`, {
						headers: headers,
					})
					.then((response) => {
						setAmbulanceData(response.data?.data)
						setIsLoading(false)
						console.log(response?.data?.data)
					})
			} catch (e) {
				console.log(e)
			}
		}
		fetchAmbulanceData()
	}, [submitDone])

	useEffect(() => {
		const fetchequipmentsData = async () => {
			try {
				await axios
					.get(`${window.$BackEndUrl}/equipments`, {
						headers: headers,
					})
					.then((response) => {
						setMyData(
							response.data?.data?.map((variant) => ({
								label: variant.name,
								value: variant.id,
							}))
						)
						// setIsLoading(false);
						console.log(response?.data?.data)
					})
			} catch (e) {
				console.log(e)
			}
		}
		fetchequipmentsData()
	}, [])

	const CreateAmbulance = useFormik({
		initialValues: {
			plate_no: '',
			make: '',
			model: '',
			gps_no: '',
			persons_supported: '',
			password: '',
			gps_latitude: '',
			gps_longitude: '',
			parking_latitude: '',
			parking_longitude: '',
			equipments: '',
		},
		onSubmit: (values) => {
			const JSON = {
				plate_no: values.plate_no,
				make: values.make,
				model: values.model,
				gps_no: values.gps_no,
				persons_supported: values.persons_supported,
				password: values.password,
				gps_latitude: '77.89797',
				gps_longitude: '-77.84568',
				parking_latitude: locationAddress?.latitude,
				parking_longitude: locationAddress?.longitude,
				equipments: options?.map((item) => item?.value),
			}
			const createAmbulance = async () => {
				setLoadingMessage(true)
				console.log(JSON)

				try {
					await axios.post(`${window.$BackEndUrl}/ambulances`, JSON, config).then((res) => {
						console.log(res)
						toast.success('Ambulance Created Successfuly')
						setSubmitDone(!submitDone)
						setLoadingMessage(false)
						CreateAmbulance.resetForm()
						locationAddress('')
						setEditOptions(null)
					})
				} catch (e) {
					toast.error('failed')
					console.log(e)
					setLoadingMessage(false)
				}
			}

			createAmbulance()
		},

		enableReinitialize: true,
	})
	const EditAmbulance = useFormik({
		initialValues: {
			plate_no: selectedAmbulance?.plate_no,
			make: selectedAmbulance?.make,
			model: selectedAmbulance?.model,
			gps_no: selectedAmbulance?.gps_no,
			persons_supported: selectedAmbulance?.persons_supported,
			password: selectedAmbulance?.password,
			gps_latitude: '',
			gps_longitude: '',
			parking_latitude: locationAddress?.latitude,
			parking_longitude: locationAddress?.longitude,
		},
		onSubmit: (values) => {
			const JSON = {
				plate_no: values.plate_no,
				make: values.make,
				model: values.model,
				gps_no: values.gps_no,
				persons_supported: values?.persons_supported,
				password: values.password,
				gps_latitude: '77.89797',
				gps_longitude: '-77.89798',
				parking_latitude: locationAddress?.latitude,
				parking_longitude: locationAddress?.longitude,
				equipments: editOptions?.map((item) => item?.value),
			}
			const editAmbulance = async () => {
				setLoadingMessage(true)
				console.log(JSON)
				try {
					await axios.patch(`${window.$BackEndUrl}/ambulances/${selectedAmbulance?.id}`, JSON, config).then((res) => {
						console.log(res)
						toast.success('Updated Successfuly')
						setSubmitDone(!submitDone)
						setLoadingMessage(false)
					})
				} catch (e) {
					toast.error('failed')
					setLoadingMessage(false)
					console.log(e)
				}
			}

			editAmbulance()
		},

		enableReinitialize: true,
	})

	const { ControlPosition, Geocoder } = google.maps
	const [position, setPosition] = useState({
		lat: 23.8859,
		lng: 45.0792,
	})

	const [address, setAddress] = useState('No address available')
	const geocoder = new Geocoder()
	const handleMarkerDragEnd = (t, map, coord) => {
		const newPosition = {
			lat: coord.latLng.lat(),
			lng: coord.latLng.lng(),
		}
		geocoder.geocode({ location: newPosition }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					setAddress(results[0].formatted_address)
					setLocationAddress({
						latitude: newPosition.lat,
						longitude: newPosition.lng,
						address: results[0].formatted_address,
					})
				} else {
					setAddress('No address available')
				}
			} else {
				setAddress('Geocoding failed due to: ' + status)
			}
		})

		setPosition(newPosition)
		console.log(newPosition)
	}

	const handleMapClick = (mapProps, map, clickEvent) => {
		const newPosition = {
			lat: clickEvent.latLng.lat(),
			lng: clickEvent.latLng.lng(),
		}

		geocoder.geocode({ location: newPosition }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					setAddress(results[0].formatted_address)
					setLocationAddress({
						latitude: newPosition.lat,
						longitude: newPosition.lng,
						address: results[0].formatted_address,
					})
				} else {
					setAddress('No address available')
				}
			} else {
				setAddress('Geocoding failed due to: ' + status)
			}
		})

		setPosition(newPosition)

		console.log(newPosition)
	}
	const sendDataToParent = (latitude, longitude, formatted_address) => {
		setLocationAddress({
			latitude: latitude,
			longitude: longitude,
			address: formatted_address,
		})
	}
	const handlePlaceChange = () => {
		const map = new window.google.maps.Map(document.getElementById('map'), {
			center: { lat: 50.064192, lng: -130.605469 },
			zoom: 3,
		})

		const card = document.getElementById('pac-card')
		map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(card)

		const center = { lat: 50.064192, lng: -130.605469 }
		const defaultBounds = {
			north: center.lat + 0.1,
			south: center.lat - 0.1,
			east: center.lng + 0.1,
			west: center.lng - 0.1,
		}

		const input = document.getElementById('address')
		const options = {
			bounds: defaultBounds,
			componentRestrictions: { country: 'sa' }, // Set the country to Pakistan
			fields: ['address_components', 'geometry', 'icon', 'name', 'formatted_address'],
			strictBounds: false,
		}

		const autocomplete = new window.google.maps.places.Autocomplete(input, options)
		const southwest = { lat: 23.6345, lng: 60.8724 }
		const northeast = { lat: 37.0841, lng: 77.8375 }
		const newBounds = new window.google.maps.LatLngBounds(southwest, northeast)
		autocomplete.setBounds(newBounds)

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace()
			let address = ''
			let postalCode = ''

			if (place.address_components) {
				address = place.formatted_address

				const postalCodeComponent = place.address_components.find((component) =>
					component.types.includes('postal_code')
				)

				postalCode = postalCodeComponent ? postalCodeComponent.short_name : ''
			}

			console.log('Formatted Address:', address)
			console.log('Postal Code:', postalCode)

			// The rest of your code...
			const latitude = place.geometry.location.lat()
			const longitude = place.geometry.location.lng()
			sendDataToParent(latitude, longitude, address, postalCode)
		})
	}
	const AmbulanceDelete = useFormik({
		initialValues: {},
		onSubmit: async () => {
			try {
				const result = await axios.delete(`${window.$BackEndUrl}/ambulances/${isDeleteID}`, config)
				toast.success('Deleted successfully')
				setSubmitDone(!submitDone)
			} catch (e) {
				console.error(e)
				toast.error('Failed to delete')
			}
		},
		enableReinitialize: true,
	})
	return (
		<div
			className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
		>
			<Toaster position="bottom-right" richColors />
			<div className="bg-lightGray-100 w-full h-auto rounded-lg p-2">
				<div className="p-4 text-right">
					<h1 className="text-2xl font-semibold">Ambulance List</h1>
				</div>
				<div className="flex flex-row items-center p-4 space-x-4">
					<div className="flex flex-row space-x-2"></div>
					<div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 py-1">
						<BsSearch width={9} height={9} />
						<input
							className="bg-transparent focus:border-none border-0 w-full text-right"
							type="text"
							placeholder="Search Ambulances..."
						/>
					</div>
					<button
						className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
						type="button"
						onClick={() => navigate('/equipment')}
					>
						Equipment
					</button>
					<button
						className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
						type="button"
						onClick={handleCreateAmbulanceClick}
					>
						+ Create Ambulance
					</button>
				</div>
				<div className="rtl">
					{isLoading ? (
						<p className="text-center text-xl text-primary-100">Loading...</p>
					) : ambulanceData.length == 0 ? (
						<p className="text-center text-xl text-primary-100">No data available</p>
					) : (
						<table className="min-w-full divide-y divide-gray-300 text-right">
							<thead>
								<tr>
									<th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
										<span className="sr-only">Edit</span>
									</th>
									<th
										scope="col"
										className="py-3 pl-4 pr-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
									>
										Model
									</th>
									<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
										Make
									</th>
									{/* <th
                    scope="col"
                    className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Contact Number
                  </th> */}
									<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
										Plate No
									</th>
									<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
										Status
									</th>
									<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
										ID No
									</th>
								</tr>
							</thead>
							<tbody>
								{ambulanceData?.map((ambulance) => (
									<tr key={ambulance.id} className="hover:bg-gray-100">
										<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
											<span className="flex items-center justify-center gap-5">
												<span
													className="text-red-500 flex justify-center  hover:text-red-600"
													onClick={() => {
														setDelete(true)
														setDeleteID(ambulance?.id)
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="w-6 h-6"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
														/>
													</svg>
												</span>
												<button
													onClick={() => handleEditClick(ambulance)}
													className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
												>
													<BiEdit />
													<span className="sr-only">, {ambulance.name}</span>
												</button>
												<button
													onClick={() => handleViewClick(ambulance)}
													className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
												>
													<BsEye />
													<span className="sr-only">, {ambulance.name}</span>
												</button>
											</span>
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.model}</td>
										<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.make}</td>
										{/* <td className="whitespace-nowrap px-3 py-4 text-md">
                      {ambulance?.contact_nos?.map((phone) => (
                      <div key={phone}>{phone}</div>
                    ))}
                    </td> */}
										<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.plate_no}</td>
										<td className="whitespace-nowrap px-3 py-4 text-md">
											<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
												{ambulance.status}
											</span>
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.id_no}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
			{viewOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
					<div className="relative top-1 -left-[16rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
						<div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
							<BsArrowRightCircle
								width={9}
								className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
								onClick={() => setViewOpen(false)}
							/>
							<h3 className="text-xl font-semibold">
								Ambulance Details <span className="text-lime-600">{selectedAmbulance?.status}</span>
							</h3>
						</div>
						<div>
							<div className="flex flex-row justify-between p-5">
								<p>
									{' '}
									<span className="font-semibold">Make:</span> {selectedAmbulance?.make}
								</p>
								<p>
									<span className="font-semibold">Model:</span> {selectedAmbulance?.model}
								</p>
								<p>
									<span className="font-semibold">Plate#:</span> {selectedAmbulance?.plate_no}
								</p>
							</div>
							<div className="px-5">
								<p className="text-lg text-right font-semibold">Driver Details</p>
								{selectedAmbulance?.driver ? (
									<div>
										<p className="text-base text-right">{selectedAmbulance?.driver?.first_name}</p>
									</div>
								) : (
									<div>
										<p className="text-base text-right">No Driver Assigned Yet</p>
									</div>
								)}
								{/* Add other details as needed */}
							</div>
							<div className="px-5 mt-4">
								<p className="text-lg text-right font-semibold">Equipment Details</p>
								{selectedAmbulance?.equipments?.map((equipment) => (
									<p key={equipment.id} className="text-base text-right">
										{equipment.name}
									</p>
								))}
							</div>
							<div className="h-80">
								<Map
									google={window.google}
									zoom={10}
									style={{ width: '100%', height: '100%' }}
									initialCenter={{
										lat: parseFloat(selectedAmbulance.gps_latitude),
										lng: parseFloat(selectedAmbulance.gps_longitude),
									}}
								>
									<Marker
										position={{
											lat: parseFloat(selectedAmbulance.gps_latitude),
											lng: parseFloat(selectedAmbulance.gps_longitude),
										}}
									/>
								</Map>
							</div>
						</div>
					</div>
				</div>
			)}
			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
					<div className="relative top-1 -left-[16rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
						<div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
							<BsArrowRightCircle
								width={9}
								className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
								onClick={() => setIsModalOpen(false)}
							/>
							<h3 className="text-xl font-semibold">Create New Ambulance</h3>
						</div>
						<form className="p-5" onSubmit={CreateAmbulance.handleSubmit}>
							<div className="flex flex-row justify-between gap-4 mb-4">
								<div className="flex flex-col space-y-2 w-full">
									{/* <div>
                    <label
                      htmlFor="contact_nos"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Contact No
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="contact_nos"
                        name="contact_nos"
                        type="tel"
                        placeholder=" xxx-xxx-xxxx"
                        onChange={CreateAmbulance.handleChange}
                        value={CreateAmbulance.values.contact_nos}
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div> */}
									{/* Equipment field */}
									<div>
										<label className="block text-sm font-medium leading-6 text-gray-900 text-right">Equipment</label>

										<Select
											value={options}
											placeholder="Select"
											onChange={(e) => handleChange(e)}
											options={myData}
											isMultiple={true}
											isClearable={true}
											primaryColor={'blue'}
											isSearchable={true}
											className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
										/>
									</div>
									<div>
										<label
											htmlFor="persons_supported"
											className="block text-sm font-medium leading-6 text-gray-900 text-right"
										>
											Persons Supported
										</label>
										<div className="relative mt-2">
											<input
												type="number"
												name="persons_supported"
												id="persons_supported"
												onChange={CreateAmbulance.handleChange}
												value={CreateAmbulance.values.persons_supported}
												placeholder="Persons Supported"
												className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0  bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label htmlFor="gps_no" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											GPS No
										</label>
										<div className="relative mt-2">
											<input
												type="number"
												name="gps_no"
												id="gps_no"
												onChange={CreateAmbulance.handleChange}
												value={CreateAmbulance.values.gps_no}
												placeholder="GPS No"
												className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>

									<div>
										<label
											htmlFor="addresss"
											className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
										>
											Parking Area
										</label>
										<div className="relative mt-2">
											<input
												onClick={HandelOpenMap}
												// onChange={CreateAmbulance.handleChange}
												value={locationAddress?.address}
												type="text"
												name="addresss"
												id="addresss"
												className="peer block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												placeholder=" Choose On Map"
												required
												readOnly
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
								</div>
								<div className="flex flex-col space-y-2 w-full">
									<div>
										<label htmlFor="plate_no" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Plate No
										</label>
										<div className="relative mt-2">
											<input
												type="text"
												name="plate_no"
												id="plate_no"
												onChange={CreateAmbulance.handleChange}
												value={CreateAmbulance.values.plate_no}
												placeholder="Enter Plate No"
												className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label htmlFor="make" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Make
										</label>
										<div className="relative mt-2">
											<input
												type="text"
												name="make"
												id="make"
												onChange={CreateAmbulance.handleChange}
												value={CreateAmbulance.values.make}
												placeholder="Enter Make"
												className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Model
										</label>
										<div className="relative mt-2">
											<input
												type="text"
												name="model"
												id="model"
												onChange={CreateAmbulance.handleChange}
												value={CreateAmbulance.values.model}
												placeholder="Enter Model"
												className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>

									{/* <div>
										<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Password
										</label>
										<div className="relative mt-2">
											<input
												type="password"
												name="password"
												id="password"
												onChange={CreateAmbulance.handleChange}
												value={CreateAmbulance.values.password}
												placeholder="Password"
												className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div> */}
								</div>
							</div>
							<div className="border-b-2 border-gray-300 mb-6">{/* Separator */}</div>
							<h3 className="text-xl font-semibold text-right">Ambulance Credentials</h3>

							<div className="flex flex-row gap-10 justify-between">
								<div>
									<label htmlFor="plate_no" className="block text-sm font-medium leading-6 text-gray-900 text-right">
										Plate No
									</label>
									<div className="relative mt-2">
										<input
											type="text"
											name="plate_no"
											id="plate_no"
											onChange={CreateAmbulance.handleChange}
											value={CreateAmbulance.values.plate_no}
											placeholder="Enter Plate No"
											className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
											required
										/>
										<div
											className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
											aria-hidden="true"
										/>
									</div>
								</div>
								<div>
									<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 text-right">
										Password
									</label>
									<div className="relative mt-2">
										<input
											type="password"
											name="password"
											id="password"
											onChange={CreateAmbulance.handleChange}
											value={CreateAmbulance.values.password}
											placeholder="Password"
											className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
											required
										/>
										<div
											className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
											aria-hidden="true"
										/>
									</div>
								</div>
							</div>
							<div className="text-left mt-10">
								{loadingMessage ? (
									<button
										type="button"
										className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
									>
										Loading...
									</button>
								) : (
									<button
										type="submit"
										className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
									>
										Save Ambulance
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			)}
			{updateFormOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
					<div className="relative top-1 -left-[16rem] mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
						<div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
							<BsArrowRightCircle
								width={9}
								className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
								onClick={() => setUpdateFormOpen(false)}
							/>
							<h3 className="text-xl font-semibold">Create New Ambulance</h3>
						</div>
						<form className="p-5" onSubmit={EditAmbulance.handleSubmit}>
							<div className="flex flex-row justify-between gap-4 mb-4">
								<div className="flex flex-col space-y-2 w-full">
									{/* <div>
                    <label
                      htmlFor="contact_nos"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Contact No
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="contact_nos"
                        name="contact_nos"
                        type="tel"
                        pattern="\d{3}-\d{3}-\d{4}"
                        placeholder=" xxx-xxx-xxxx"
                        onChange={EditAmbulance.handleChange}
                        value={EditAmbulance.values.contact_nos}
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div> */}

									<div>
										<label className="block text-sm font-medium leading-6 text-gray-900 text-right">Equipment</label>

										<Select
											value={editOptions}
											placeholder="Select"
											onChange={(e) => handleChangeEquiments(e)}
											options={myData}
											isMultiple={true}
											isClearable={true}
											primaryColor={'blue'}
											isSearchable={true}
											className="peer  w-full px-2 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
										/>
									</div>

									<div>
										<label
											htmlFor="persons_supported"
											className="block text-sm font-medium leading-6 text-gray-900 text-right"
										>
											Persons Supported
										</label>
										<div className="relative mt-2">
											<input
												type="number"
												name="persons_supported"
												id="persons_supported"
												onChange={EditAmbulance.handleChange}
												value={EditAmbulance.values.persons_supported}
												placeholder="Persons Supported"
												className="peer block  px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0  bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label htmlFor="gps_no" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											GPS No
										</label>
										<div className="relative mt-2">
											<input
												type="number"
												name="gps_no"
												id="gps_no"
												onChange={EditAmbulance.handleChange}
												value={EditAmbulance.values.gps_no}
												placeholder="GPS No"
												className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="addresss"
											className=" text-sm flex justify-end font-medium leading-6 text-gray-900 text-right"
										>
											Parking Area
										</label>
										<div className="relative mt-2">
											<input
												onClick={HandelOpenMap}
												onChange={EditAmbulance.handleChange}
												value={locationAddress?.address}
												type="text"
												name="addresss"
												id="addresss"
												className="peer block w-full border-0 cursor-pointer bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												placeholder=" Choose On Map"
												required
												readOnly
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
								</div>
								<div className="flex flex-col space-y-2 w-full">
									<div>
										<label htmlFor="plate_no" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Plate No
										</label>
										<div className="relative mt-2">
											<input
												type="text"
												name="plate_no"
												id="plate_no"
												onChange={EditAmbulance.handleChange}
												value={EditAmbulance.values.plate_no}
												placeholder="Enter Plate No"
												className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label htmlFor="make" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Make
										</label>
										<div className="relative mt-2">
											<input
												type="text"
												name="make"
												id="make"
												onChange={EditAmbulance.handleChange}
												value={EditAmbulance.values.make}
												placeholder="Enter Make"
												className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
									<div>
										<label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Model
										</label>
										<div className="relative mt-2">
											<input
												type="text"
												name="model"
												id="model"
												onChange={EditAmbulance.handleChange}
												value={EditAmbulance.values.model}
												placeholder="Enter Model"
												className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>

									<div>
										<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 text-right">
											Password
										</label>
										<div className="relative mt-2">
											<input
												type="password"
												name="password"
												id="password"
												onChange={EditAmbulance.handleChange}
												value={EditAmbulance.values.password}
												placeholder="Password"
												className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
												required
											/>
											<div
												className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
												aria-hidden="true"
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="text-left mt-10">
								{loadingMessage ? (
									<button
										type="button"
										className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
									>
										Loading...
									</button>
								) : (
									<button
										type="submit"
										className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100`}
									>
										Update Ambulance
									</button>
								)}
							</div>
						</form>
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
										<form onSubmit={AmbulanceDelete.handleSubmit} className="mt-3 sm:mt-3">
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
			<Transition.Root show={open} as={Fragment}>
				<Dialog onClose={() => setOpen(false)}>
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

					<div className="fixed inset-0 z-50  overflow-y-auto">
						<div className="flex w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform mx-auto w-[90rem] h-screen overflow-hidden rounded-lg bg-white  shadow-xl transition-all">
									<div className="mt-2">
										<div
											style={{
												width: '100%',
												height: '100vh',
											}}
										>
											{' '}
											<div id="pac-card" className="flex rounded-md gap-10 justify-center my-4">
												<input
													id="address"
													name="address"
													required
													className="peer block w-[30rem] rounded-md px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
													type="text"
													placeholder="Enter a location"
													onChange={handlePlaceChange}
												/>
												<span onClick={() => setOpen(false)}>Close </span>
											</div>
											<div
												id="map"
												// style={{ height: "0px", width: "0px" }}
											></div>
											<Map
												google={google}
												zoom={10}
												onClick={handleMapClick}
												zoomControlOptions={{
													position: ControlPosition.BOTTOM_LEFT,
												}}
												mapTypeControlOptions={{
													position: ControlPosition.TOP_CENTER,
												}}
												initialCenter={position}
											>
												<Marker position={position} draggable={true} onDragend={handleMarkerDragEnd} />
											</Map>
											<div style={{ marginTop: '10px' }}>
												<strong>Address:</strong> {address}
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</div>
	)
}

export default AmbulanceFiles
