import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, PaperClipIcon } from '@heroicons/react/20/solid'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BsArrowRightCircle, BsSearch } from 'react-icons/bs'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'sonner'
import Select from 'react-tailwindcss-select'
import { Vars } from '../../helpers/helpers'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'

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
const HealthcareProfile = ({}) => {
	var token = localStorage.getItem('token')
	var user_id = localStorage.getItem('user_id')
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	}

	const [adminProfile, setAdminProfile] = useState(null)

	const [isLoading, setIsLoading] = useState(true)
	const [incidentData, setIncidentData] = useState([])
	const [submitDone, setSubmitDone] = useState(false)
	useEffect(() => {
		const fetchuserData = async () => {
			try {
				await axios
					.get(`https://ars.disruptwave.com/api/view-healthcare`, {
						headers: headers,
					})
					.then((response) => {
						setAdminProfile(response.data?.data)
						setIsLoading(false)
						console.log('admin', response?.data?.data)
					})
			} catch (e) {
				console.log(e)
			}
		}
		fetchuserData()
	}, [submitDone])

	return (
		<div className={`w-[50rem] mx-auto mx-w-7xl py-5 bg-grayBg-100 transition-all duration-300 z-[10] h-screen `}>
			<Toaster position="bottom-right" richColors />
			<div className="bg-lightGray-100 w-full h-auto rounded-lg p-2">
				<div className=" px-4">
					<div className="px-4 flex justify-end sm:px-0 text-right">
						<div className="mt-5">
							<h3 className="text-2xl font-semibold leading-7 text-gray-900">تفاصيل الرعاية الصحية</h3>
						</div>
					</div>
					<div className="mt-6">
						<dl className="grid grid-cols-1  sm:grid-cols-3 px-1">
							<div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-1 sm:px-0">
								<dt className="text-xl leading-6 font-bold text-gray-900">عنوان</dt>
								<dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-0.5">{adminProfile?.address}</dd>
							</div>
							<div className="border-t border-gray-100 px-3 py-3 text-end sm:col-span-1 sm:px-0">
								<dt className="text-xl leading-6 text-gray-900 font-bold">بريد إلكتروني</dt>
								<dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-.5">{adminProfile?.email}</dd>
							</div>
							<div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-1 sm:px-0 ">
								<dt className="leading-6 text-gray-900 font-bold text-xl">اسم</dt>
								<dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-0.5">{adminProfile?.name}</dd>
							</div>
							{/* <div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-1 sm:px-0">
								<dt className="text-sm font-medium leading-6  text-gray-900">Designation</dt>
								<dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-0.5">{adminProfile?.designation}</dd>
							</div> */}
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HealthcareProfile
