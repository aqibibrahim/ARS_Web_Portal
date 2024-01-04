import React from "react";

function TextareaComponent({ id, placeholder, rows = 4, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 text-right"
      >
        {placeholder}
      </label>
      <div className="mt-2">
        <textarea
          rows={rows}
          name={id}
          id={id}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 bg-offWhiteCustom-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6 text-right"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default TextareaComponent;
