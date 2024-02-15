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
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const handleSubMenuClick = (e) => {
    e.stopPropagation(); // Prevents the parent click event from firing
    setSubMenuOpen(!isSubMenuOpen);
  };

  const handleMenuItemClick = (e) => {
    if (subMenu) {
      handleSubMenuClick(e);
    } else if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleMenuItemClick}
        className={`flex ${
          localStorage?.role == "Healthcare Manager" && "p-5"
        } ${
          bgColor === "primary"
            ? "bg-primary-100 py-1 "
            : "bg-secondary-100 bg-opacity-50"
        } ${
          fontColor === "white" ? "text-white" : "text-black"
        } cursor-pointer leading-3 transition-all duration-300 flex-col justify-center items-center ${
          isActive
            ? "bg-white text-primary-100"
            : "hover:bg-white hover:text-primary-100"
        }`}
      >
        <div className={` p-2  w-auto`}>{children}</div>
        <div className={`flex-grow mb-1`}>
          <span className={`text-xs text-center`}>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
