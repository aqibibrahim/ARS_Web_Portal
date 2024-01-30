import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BuildingOffice2Icon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { Toaster, toast } from 'sonner'
import { useFormik } from 'formik'
import { BsArrowRightCircle } from 'react-icons/bs'
const statuses = {
	Paid: 'text-green-700 bg-green-50 ring-green-600/20',
	Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
	Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function HealthCareDepartments() {
	var token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}
	const [departments, setDepartments] = useState([])
	const [loading, setLoading] = useState(false)
	const [submitDone, setSubmitDone] = useState(false)
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
	const [loadingMessage, setLoadingMessage] = useState(false)
	const [editingDepartment, setEditingDepartment] = useState(null)
	const [menuIsOpen, setMenuIsOpen] = useState({})
	const [facilityID, setFacilityID] = useState('')
	// useEffect(() => {
	// 	const fetchDepartments = async () => {
	// 		try {
	// 			await axios
	// 				.get(`https://ars.disruptwave.com/api/view-department`, {
	// 					headers: headers,
	// 				})
	// 				.then((response) => {
	// 					setDepartments(response.data.data)
	// 					setLoading(false)
	// 					console.log(response?.data?.data)
	// 				})
	// 		} catch (e) {
	// 			toast.error('An error occurred while fetching equipment')
	// 			console.log(e)
	// 		}
	// 	}
	// 	fetchDepartments()
	// }, [submitDone])
	useEffect(() => {
		const fetchHealthCareData = async () => {
			try {
				await axios
					.get(`https://ars.disruptwave.com/api/view-healthcare`, {
						headers: headers,
					})
					.then((response) => {
						console.log(response)
						setDepartments(response?.data?.data?.departments)

						setMenuIsOpen(response?.data?.data)
						setFacilityID(response?.data?.data?.id)
					})
			} catch (e) {
				console.log(e)
			}
		}
		fetchHealthCareData()
	}, [submitDone])
	const updatedepartment = useFormik({
		initialValues: {
			facility_id: facilityID,
			department_id: editingDepartment?.id,
			total_beds: editingDepartment?.pivot.total_beds,
			occupied_beds_men: editingDepartment?.pivot.occupied_beds_men,
			occupied_beds_women: editingDepartment?.pivot.occupied_beds_women,
			unoccupied_beds_men: editingDepartment?.pivot.unoccupied_beds_men,
			unoccupied_beds_women: editingDepartment?.pivot.unoccupied_beds_women,
		},
		onSubmit: (values) => {
			setLoadingMessage(true)
			const JSON = {
				facility_id: facilityID,
				department_id: values.department_id,
				total_beds: values.total_beds,
				occupied_beds_men: values.occupied_beds_men,
				occupied_beds_women: values.occupied_beds_women,
				unoccupied_beds_men: values.unoccupied_beds_men,
				unoccupied_beds_women: values.unoccupied_beds_women,
			}
			const UpdateEquipment = async () => {
				try {
					await axios.patch(`https://ars.disruptwave.com/api/facility-department/update/`, JSON, config).then((res) => {
						setSubmitDone(!submitDone)
						setIsUpdateModalOpen(false)
						setLoadingMessage(false)
						toast.success('Department updated successfully!')
					})
				} catch (e) {
					toast.error('failed')
					setLoadingMessage(false)
					console.log(e)
				}
			}

			UpdateEquipment()
		},

		enableReinitialize: true,
	})
	const handleEditDepartmentClick = (item) => {
		setEditingDepartment(item)
		setIsUpdateModalOpen(true)
	}
	const handleModalClose = () => {
		setIsUpdateModalOpen(false)
	}
	return (
		<div className="w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20">
			<Toaster position="bottom-right" richColors />
			<ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
				{loading ? (
					<p className="text-center text-xl text-primary-100">Loading...</p>
				) : departments.length == 0 ? (
					<p className="text-center text-xl text-primary-100">No data available</p>
				) : (
					departments?.map((item) => (
						<li key={item.id} className="overflow-hidden rounded-xl border border-gray-200">
							<div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
								<Menu as="div" className="relative mr-auto">
									<Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
										<span className="sr-only">Open options</span>
										<EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
									</Menu.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute left-0 z-10 mt-0.5 w-32 origin-top-left rounded-md bg-white py-0 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
											<Menu.Item>
												{({ active }) => (
													<button
														onClick={() => handleEditDepartmentClick(item)}
														className={classNames(
															active ? 'bg-gray-50' : '',
															'block px-3 py-1 w-full text-right text-sm leading-6 text-gray-900'
														)}
													>
														Edit
													</button>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
								<div className="text-sm font-medium leading-6 text-gray-900">{item?.name}</div>
								<BuildingOffice2Icon className="h-12 w-12 flex-none rounded-lg bg-white text-blue-500 object-cover ring-1 ring-gray-900/10" />
							</div>
							<dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
								<div className="flex justify-between gap-x-4 py-3">
									<dd className="">{item.pivot.total_beds}</dd>
									<dt className="text-gray-600">Total Beds</dt>
								</div>
								<div className="flex justify-between gap-x-4 py-3">
									<dd className="flex items-start gap-x-2">
										<div className="flex gap-x-1 divide-x bg-pink-200 px-2 divide-pink-400 text-pink-600 rounded-lg">
											<span>Women</span>
											<span className="pl-1">{item.pivot.occupied_beds_women}</span>
										</div>
										<div className="flex gap-x-1 divide-x bg-blue-200 px-2 divide-blue-400 text-blue-600 rounded-lg">
											<span>Men</span>
											<span className="pl-1">{item.pivot.occupied_beds_men}</span>
										</div>
									</dd>
									<dt className="text-gray-500">Avaiable</dt>
								</div>
								<div className="flex justify-between gap-x-4 py-3">
									<dd className="flex items-start gap-x-2">
										<div className="flex gap-x-1 divide-x bg-pink-200 px-2 divide-pink-400 text-pink-600 rounded-lg">
											<span>Women</span>
											<span className="pl-1">{item.pivot.unoccupied_beds_women}</span>
										</div>
										<div className="flex gap-x-1 divide-x bg-blue-200 px-2 divide-blue-400 text-blue-600 rounded-lg">
											<span>Men</span>
											<span className="pl-1">{item.pivot.unoccupied_beds_men}</span>
										</div>
									</dd>
									<dt className="text-gray-500">Occupied</dt>
								</div>
							</dl>
						</li>
					))
				)}
			</ul>
			{isUpdateModalOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
					<div className="relative top-0 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
						<div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-2 rounded-lg overflow-hidden">
							<BsArrowRightCircle
								width={9}
								className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
								onClick={handleModalClose}
							/>
							<h3 className="text-xl font-semibold">Update Department</h3>
						</div>
						<form onSubmit={updatedepartment.handleSubmit}>
							<div>
								<label htmlFor="total_beds" className="block  text-sm font-medium leading-6 text-gray-900 text-right">
									Total Beds
								</label>
								<div className="relative mt-2">
									<input
										id="total_beds"
										name="total_beds"
										min={0}
										type="number"
										onChange={updatedepartment.handleChange}
										value={updatedepartment.values.total_beds}
										placeholder="Total Beds"
										className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
										required
									/>
									<div
										className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
										aria-hidden="true"
									/>
								</div>
							</div>{' '}
							<div>
								<label
									htmlFor="occupied_beds_men"
									className="block  text-sm font-medium leading-6 text-gray-900 text-right"
								>
									Occupied Beds Men
								</label>
								<div className="relative mt-2">
									<input
										id="occupied_beds_men"
										name="occupied_beds_men"
										type="number"
										min={0}
										onChange={updatedepartment.handleChange}
										value={updatedepartment.values.occupied_beds_men}
										placeholder="Occupied Beds Men"
										className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
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
									htmlFor="occupied_beds_women"
									className="block  text-sm font-medium leading-6 text-gray-900 text-right"
								>
									Occupied Beds Women
								</label>
								<div className="relative mt-2">
									<input
										id="occupied_beds_women"
										name="occupied_beds_women"
										type="number"
										min={0}
										onChange={updatedepartment.handleChange}
										value={updatedepartment.values.occupied_beds_women}
										placeholder="Occupied Beds Women"
										className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
										required
									/>
									<div
										className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
										aria-hidden="true"
									/>
								</div>
							</div>{' '}
							<div>
								<label
									htmlFor="unoccupied_beds_men"
									className="block  text-sm font-medium leading-6 text-gray-900 text-right"
								>
									Unoccupied Beds Men
								</label>
								<div className="relative mt-2">
									<input
										id="unoccupied_beds_men"
										name="unoccupied_beds_men"
										type="number"
										min={0}
										onChange={updatedepartment.handleChange}
										value={updatedepartment.values.unoccupied_beds_men}
										placeholder="Unoccupied Beds Men"
										className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
										required
									/>
									<div
										className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
										aria-hidden="true"
									/>
								</div>
							</div>{' '}
							<div>
								<label
									htmlFor="unoccupied_beds_women"
									className="block  text-sm font-medium leading-6 text-gray-900 text-right"
								>
									Unoccupied Beds women
								</label>
								<div className="relative mt-2">
									<input
										id="unoccupied_beds_women"
										name="unoccupied_beds_women"
										type="number"
										min={0}
										onChange={updatedepartment.handleChange}
										value={updatedepartment.values.unoccupied_beds_women}
										placeholder="Unoccupied Beds women"
										className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
										required
									/>
									<div
										className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
										aria-hidden="true"
									/>
								</div>
							</div>
							{loadingMessage ? (
								<button
									type="button"
									className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
								>
									loading...
								</button>
							) : (
								<button
									type="submit"
									className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100 mt-2"
								>
									Update
								</button>
							)}
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
