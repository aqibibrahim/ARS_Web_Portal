// import React from "react";

// const MenuItem = ({
//   title,
//   bgColor,
//   fontColor,
//   onClick,
//   children,
//   isActive,
// }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`flex ${
//         bgColor === "primary" ? "bg-primary-100" : "bg-secondary-100"
//       } ${
//         fontColor === "white" ? "text-white" : "text-black"
//       } cursor-pointer p-1 w-full transition-all duration-300 flex-col justify-center items-center h-16 ${
//         isActive
//           ? "bg-white text-primary-100"
//           : "hover:bg-white hover:text-primary-100"
//       }`}
//     >
//       <div className={`rounded-xl p-2 m-0 flex-shrink-0`}>{children}</div>
//       <div className={`flex-grow`}>
//         <span className={`text-xs`}>{title}</span>
//       </div>
//     </div>
//   );
// };

// export default MenuItem;
import React, { useState } from 'react'

const MenuItem = ({ title, bgColor, fontColor, onClick, children, isActive, subMenu, type, lookUpOpen }) => {
	const [isSubMenuOpen, setSubMenuOpen] = useState(false)

	const handleSubMenuClick = (e) => {
		// e.stopPropagation();
		setSubMenuOpen(!isSubMenuOpen)
	}

	const handleMenuItemClick = () => {
		if (subMenu) {
			handleSubMenuClick()
		} else if (typeof onClick === 'function') {
			onClick()
		}
	}

	return (
		<div className="relative">
			<div
				onClick={handleMenuItemClick}
				className={`flex ${localStorage?.role == 'Healthcare Manager' && 'p-5'}  ${
					bgColor === 'primary' ? 'bg-primary-100 py-3 ' : 'bg-secondary-100'
				} ${
					fontColor === 'white' ? 'text-white' : 'text-black'
				} cursor-pointer leading-3  transition-all duration-300 flex-col justify-center items-center ${
					isActive ? 'bg-white text-primary-100' : 'hover:bg-white hover:text-primary-100'
				}`}
			>
				<div className={` p-2  w-auto`}>{children}</div>
				<div className={`flex-grow mb-1`}>
					<span className={`text-xs text-center `}>{title}</span>
				</div>
			</div>
		</div>
	)
}

export default MenuItem
