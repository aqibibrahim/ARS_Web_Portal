import React, { useState, useEffect, Fragment, useContext } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { BsBell, BsPersonBadge } from 'react-icons/bs'
import user from '../assets/user.png'
import Settings from './Settings'
import Notifications from './Notifications'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid'
import { useAmbulanceContext } from './AmbulanceContext'

const userNavigation = [{ name: 'Sign out', href: '#' }]

const notificationsData = [
	{
		id: 1,
		title: 'Nissan HJC-4653',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque alias necessitatibus, excepturi consectetur inventore dolores? Distinctio dignissimos ad, dolores, ipsam quod asperiores est, assumenda inventore culpa quidem rem quia. Hic.',
	},
	{
		id: 2,
		title: 'Nissan HJC-4653',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque alias necessitatibus, excepturi consectetur inventore dolores? Distinctio dignissimos ad, dolores, ipsam quod asperiores est, assumenda inventore culpa quidem rem quia. Hic.',
	},
]

const UserImg = () => {
	return (
		<div className="relative flex items-center justify-center rounded-full p-2 transition-all duration-300 cursor-pointer z-10">
			<img className={`w-8 h-8 rounded-full`} src={user} alt="user" />
		</div>
	)
}

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function TopBarItem({ icon: Icon, onClick, isActive, children, notificationCount }) {
	return (
		<div
			onClick={onClick}
			className="relative flex items-center justify-center rounded-full p-2 transition-all duration-300 z-10"
		>
			<Icon
				className={`w-9 h-9 text-primary-100 bg-white rounded-full ${
					isActive ? 'bg-primary-300' : 'hover:bg-primary-300'
				} p-2 transition-all duration-300`}
			/>
			{notificationCount > 0 && (
				<span className="absolute -top-1 -right-1 flex items-center justify-center bg-primary-100 text-white text-xs rounded-full h-6 w-6">
					{notificationCount}
				</span>
			)}
			{children}
		</div>
	)
}

function Dropdown({ onClose, title, children }) {
	const handleClick = (event) => {
		event.stopPropagation()
	}
	return (
		<div
			onClick={handleClick}
			className="absolute -top-1 left-14 mt-2 py-2 bg-white/30 backdrop-blur-md shadow-lg rounded-lg text-sm w-80 max-h-screen overflow-y-scroll no-scrollbar"
		>
			<div className="flex items-center justify-between mb-4 px-4">
				<button onClick={onClose} className="top-1 right-2 text-xl">
					&times;
				</button>
				<h1 className="text-xl font-bold">{title}</h1>
			</div>
			{children}
		</div>
	)
}

function TopBar({}) {
	const { resetState } = useAmbulanceContext()
	const navigate = useNavigate()
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [notificationCount, setNotificationCount] = useState(0)
	const [notificationsData, setNotificationsData] = useState([])
	useEffect(() => {
		// Establish websocket connection
		const clientId = parseInt(localStorage.getItem('user_id'))
		let clientToken = localStorage.getItem('token')
		let clientRole = localStorage.getItem('role')

		console.log('User id', clientId, 'User Token', typeof clientToken, 'User Role', typeof clientRole)
		// Establish websocket connection with headers

		const endpoint = `wss://ars-websockets.disruptwave.com/ws/subscribe?client_id=${clientId}&client_type=${clientRole}&client_token=${clientToken}`
		const socket = new WebSocket(endpoint)
		socket.onopen = () => {
			console.log('WebSocket connection established.')
		}

		socket.onerror = (error) => {
			console.error('WebSocket error:', error.type)
		}
		// Listen for messages from the server
		socket.addEventListener('message', (event) => {
			// Log the received data for debugging
			console.log('Received data:', event.data)
			if (event.data !== 'ping') {
				try {
					const jsonString = event.data
					const jsonObject = JSON.parse(jsonString)
					const jsonStringfy = JSON.stringify(jsonObject)
					const jsonObject1 = JSON.parse(jsonStringfy)
					const Payload = JSON.parse(jsonObject1)

					// Access the type and message fields
					const type = Payload.type
					const message = Payload.message

					if (type === 'AMBULANCE_ACTIVE') {
						setNotificationsData((prevNotifications) => [...prevNotifications, Payload])
						setNotificationCount((prevCount) => prevCount + 1)
					} else if (type === 'AMBULANCE_AVAILABLE') {
						setNotificationsData((prevNotifications) => [...prevNotifications, Payload])
						setNotificationCount((prevCount) => prevCount + 1)
					}
				} catch (error) {
					console.error('Error parsing JSON data:', error)
				}
			}
			// Update notification data
		})
		// Clean up websocket connection on unmount
		return () => {
			socket.close()
		}
	}, [])
	const toggleDropdown = (dropdown) => {
		if (dropdown === 'notifications' && notificationCount > 0) {
			setNotificationCount(0)
		}
		setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
	}
	const clearNotifications = () => {
		setNotificationsData([])
		setNotificationCount(0)
	}
	return (
		<div className="hidden  ml-2 lg:fixed lg:inset-y-0 z-50  lg:flex lg:flex-col">
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex grow flex-row gap-y-5 border-r border-gray-200 bg-transparent pb-4">
				<div className="px-1 mt-2">
					<TopBarItem
						icon={BsBell}
						onClick={() => toggleDropdown('notifications')}
						isActive={activeDropdown === 'notifications'}
						notificationCount={notificationCount}
					>
						{activeDropdown === 'notifications' && (
							<Dropdown onClose={() => setActiveDropdown(null)} title="Notifications">
								<button onClick={clearNotifications}>Clear Notifications</button>
								<Notifications notificationsData={notificationsData} onCloseDropdown={() => setActiveDropdown(null)} />
							</Dropdown>
						)}
					</TopBarItem>
					{/* <TopBarItem
            icon={IoSettingsOutline}
            onClick={() => toggleDropdown("settings")}
            isActive={activeDropdown === "settings"}
          >
            {activeDropdown === "settings" && (
              <Dropdown
                onClose={() => setActiveDropdown(null)}
                title="Settings"
              >
                <Settings />
              </Dropdown>
            )}
          </TopBarItem> */}
					<button
						onClick={() => {
							localStorage.clear()
							resetState()
							navigate('/login')
						}}
						className="relative flex items-center justify-center rounded-full p-2 transition-all duration-300 z-10"
					>
						<ArrowLeftOnRectangleIcon className="p-2 transition-all duration-300 w-9 h-9 text-primary-100 bg-white rounded-full" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default TopBar
