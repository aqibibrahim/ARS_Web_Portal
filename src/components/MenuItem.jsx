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
import React, { useState } from "react";

const MenuItem = ({
  title,
  bgColor,
  fontColor,
  onClick,
  children,
  isActive,
  subMenu,
  type,
  lookUpOpen,
}) => {
  debugger;
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const handleSubMenuClick = (e) => {
    // e.stopPropagation();
    setSubMenuOpen(!isSubMenuOpen);
  };

  const handleMenuItemClick = () => {
    if (subMenu) {
      handleSubMenuClick();
    } else if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <>
      {" "}
      <div className="relative">
        <div
          onClick={handleMenuItemClick}
          className={`flex ${
            bgColor === "primary" ? "bg-primary-100" : "bg-secondary-100"
          } ${
            fontColor === "white" ? "text-white" : "text-black"
          } cursor-pointer p-1 w-full transition-all duration-300 flex-col justify-center items-center h-16 ${
            isActive
              ? "bg-white text-primary-100"
              : "hover:bg-white hover:text-primary-100"
          }`}
        >
          <div className={`rounded-xl p-2 m-0 flex-shrink-0 w-auto`}>
            {children}
          </div>
          <div className={`flex-grow`}>
            <span className={`text-xs`}>{title}</span>
          </div>
        </div>
      </div>
      <div className="flex w-full relative">
        {lookUpOpen && (
          <div
          // className="mt-1 border border-gray-200 shadow-md z-50 bg-white"
          // onClick={(e) => e.stopPropagation()}
          >
            {/* Render your sub-menu items here */}
            {subMenu.map((menuItem, index) => (
              <div
                key={index}
                onClick={() => {
                  if (typeof menuItem.onClick === "function") {
                    menuItem.onClick();
                  }
                  setSubMenuOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100 bg-red-500"
              >
                {menuItem.icon && (
                  <div className="mr-2 inline-flex">{menuItem.icon}</div>
                )}
                {menuItem.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MenuItem;
