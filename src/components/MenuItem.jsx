import React from "react";

const MenuItem = ({
  title,
  bgColor,
  fontColor,
  onClick,
  children,
  isActive,
}) => {
  return (
    <div
      onClick={onClick}
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
      <div className={`rounded-xl p-2 m-0 flex-shrink-0`}>{children}</div>
      <div className={`flex-grow`}>
        <span className={`text-xs`}>{title}</span>
      </div>
    </div>
  );
};

export default MenuItem;
