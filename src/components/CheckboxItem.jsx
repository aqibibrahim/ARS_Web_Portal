import React from "react";

const CheckboxItem = ({ id, name, description, checked, onChange }) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={id}
          aria-describedby={`${id}-description`}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-primay-100 border-gray-300 rounded focus:ring-primary-100"
        />
      </div>
      <div className="ml-3 text-sm text-right w-full">
        <label htmlFor={id} className="font-medium text-gray-900">
          {name}
        </label>
        {description && (
          <p id={`${id}-description`} className="text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckboxItem;
