import React from "react";

function StyledInput({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  minLength,
  maxLength,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 text-right"
      >
        {label}
      </label>
      <div className="relative mt-2">
        <input
          type={type}
          name={id}
          id={id}
          className="peer block w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          minLength={minLength || undefined}
          maxLength={maxLength || undefined}
          required
        />
        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default StyledInput;
