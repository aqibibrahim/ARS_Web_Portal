import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import HealthcareLogin from './components/HealthcareLogin'
import Dashboard from './Dashboard'
import { AmbulanceProvider } from './components/AmbulanceContext'

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		// Initialize the state with the value from localStorage
		return !!localStorage.getItem('token')
	})
	const isAuthenticatedRef = useRef(isAuthenticated)

	useEffect(() => {
		console.log('App token', localStorage.getItem('token'))
		if (localStorage.getItem('token')) {
			setIsAuthenticated(true)
		}
		console.log('isAuth', isAuthenticated)
	}, [isAuthenticated])

	const updateAuthenticationStatus = (status) => {
		setIsAuthenticated(status)
	}
	//   useEffect(() => {
	//     isAuthenticatedRef.current = isAuthenticated;
	//   }, [isAuthenticated]);

	const AuthRoute = ({ children }) => {
		if (!isAuthenticated) {
			return <Navigate to="/login" />
		}
		return children
	}

	return (
		<Router>
			<AmbulanceProvider>
				<Routes>
					<Route path="/login" element={<Login updateAuthenticationStatus={updateAuthenticationStatus} />} />
					<Route path="/HealthcareLogin" element={<HealthcareLogin updateAuthenticationStatus={updateAuthenticationStatus} />} />
					
					<Route
						path="/*"
						element={
							<AuthRoute>
								<Dashboard />
							</AuthRoute>
						}
					/>
				</Routes>
			</AmbulanceProvider>
		</Router>
	)
}

export default App
