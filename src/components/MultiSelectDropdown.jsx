import React, { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { IoIosClose } from "react-icons/io";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  setSelectedOptions,
  label,
  placeholder = "Select Options",
  inputType = "text",
  bgColor,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue) {
      if (!selectedOptions.includes(inputValue)) {
        setSelectedOptions([...selectedOptions, inputValue]);
        setInputValue("");
      }
      event.preventDefault();
    }
  };

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const isOptionSelected = prev.some((item) => item.id === option.id);
      if (isOptionSelected) {
        return prev.filter((item) => item.id !== option.id);
      } else {
        return [...prev, { name: option.name, id: option.id }];
      }
    });
  };

  // Function to remove a selected option
  const removeOption = (optionToRemove) => {
    setSelectedOptions((prev) =>
      prev.filter((option) => option.id !== optionToRemove.id)
    );
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium leading-6 text-gray-900 text-right">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-2 bg-grayBg-300 p-2 rounded-lg">
        {selectedOptions?.map((option, index) => (
          <span
            key={index}
            style={{ backgroundColor: bgColor || "#1681FF" }}
            className="flex items-center gap-1 bg-primary-100 text-white rounded-full px-2 py-1 text-sm"
          >
            {option.name}
            <IoIosClose
              className="h-4 w-4 cursor-pointer"
              onClick={() => removeOption(option)}
            />
          </span>
        ))}
      </div>
      <div className="mt-2">
        <input
          type={inputType}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-md border-none bg-grayBg-300 py-2 pl-10 pr-3 text-right shadow-sm ring-0 ring-inset ring-grayBg-300 focus:outline-none focus:ring-1 focus:ring-primary-100 sm:text-sm"
        />

        <Transition
          show={open}
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options?.map((option) => (
              <div
                key={option?.name}
                className={classNames(
                  "relative cursor-pointer select-none py-2 pl-8 p-4 text-right bg-white hover:bg-gray-200 m-2 rounded-lg"
                )}
                onClick={() => toggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions?.some(
                    (item) => item.id === option.id
                  )}
                  className="absolute inset-y-0 left-0 m-2"
                  readOnly
                />
                <span className="block truncate">{option.name}</span>
                {option?.description && (
                  <p className="text-gray-500 mt-1">{option.description}</p>
                )}
                {option?.subDescription && (
                  <p className="text-gray-500 mt-1 text-sm">
                    {option.subDescription}
                  </p>
                )}
                {option?.distance && option?.time && (
                  <p className="text-gray-500 mt-1 text-[10px]">
                    <span className="text-primary-100">{option.time} mins</span>{" "}
                    •
                    <span className="text-primary-100">
                      {option.distance} Km
                    </span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
