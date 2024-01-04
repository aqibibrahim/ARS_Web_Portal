import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DropdownListbox = ({
  options,
  selectedOption,
  setSelectedOption,
  label,
}) => {
  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 text-right">
            {label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-10 pr-3 text-right text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:text-sm sm:leading-6">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400 transform rotate-180"
                  aria-hidden="true"
                />
              </span>
              <span className="block truncate">{selectedOption.title}</span>
            </Listbox.Button>

            <Transition
              show={open}
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-primary-100 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-8 pr-4 text-right"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.title}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-primary-100",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        {option?.description ? (
                          <p
                            className={classNames(
                              active ? "text-indigo-200" : "text-gray-500",
                              "mt-1"
                            )}
                          >
                            {option.description}
                          </p>
                        ) : null}
                        {option?.subDescription ? (
                          <p
                            className={classNames(
                              active ? "text-indigo-200" : "text-gray-500",
                              "mt-1 text-sm"
                            )}
                          >
                            {option.subDescription}
                          </p>
                        ) : null}
                        {option?.distance && option?.time ? (
                          <p
                            className={classNames(
                              active ? "text-white" : "text-gray-500",
                              "mt-1 text-[10px]"
                            )}
                          >
                            <span className="text-primary-100">
                              {option.time} mins
                            </span>{" "}
                            •{" "}
                            <span className="text-primary-100">
                              {option.distance} Km
                            </span>
                          </p>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default DropdownListbox;
