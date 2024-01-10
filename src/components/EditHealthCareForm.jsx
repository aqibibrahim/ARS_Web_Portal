import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import DropdownListbox from "./DropdownListbox";
import { Vars } from "../helpers/helpers";
import { useFormik } from "formik";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { BiEdit } from "react-icons/bi";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const HealthCares = [
  {
    title: "HealthCare1",
    current: false,
  },
  {
    title: "HealthCare2",
    current: false,
  },
  {
    title: "HealthCare3",
    current: false,
  },
];

const EditHealthCare = ({ openModal, datatt }) => {
  debugger;
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [menuIsOpen, setMenuIsOpen] = useState([]);
  const [showAssignAmbulance, setShowAssignAmbulance] = useState([]);
  const [open, setOpen] = useState(false);
  const [btnDisable, setBtnDisbale] = useState(false);
  const [visibleDivIndex, setVisibleDivIndex] = useState(null);
  const [hasHiddenDivShown, setHasHiddenDivShown] = useState(false);

  const [ambulanceID, setAmbulanceID] = useState(0);
  const [dynamicIndex, setDynamicIndex] = useState(false);
  const [disabledAmbulanceIDs, setDisabledAmbulanceIDs] = useState([]);
  const [visibleDivAmbulanceID, setVisibleDivAmbulanceID] = useState(null);
  const [selectedFacilityOption, setSelectedFacilityOption] = useState({});
  const [selectHealthCare, setSelectHealthCare] = useState(HealthCares[0]);
  console.log(ambulanceID, "ambID");
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/facilities`, {
            headers: headers,
          })
          .then((response) => {
            // setMyData(response.data?.data?.map(variant => ({
            //    label:variant.model, value: variant.id ,persons_supported:variant.persons_supported, id_no: variant.id_no
            // })))
            // setIsLoading(false);
            setMenuIsOpen(response?.data?.data);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchRegionData();
  }, []);
  useEffect(() => {
    const fetchsingleincidentsData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/incidents/${datatt?.id}`, {
            headers: headers,
          })
          .then((response) => {
            setShowAssignAmbulance(response?.data?.data?.ambulances);
            console.log("fetchsingleData", response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchsingleincidentsData();
  }, []);

  const assignAmbulance = useFormik({
    initialValues: {
      driver: "",
    },
  });

  const createAssignAmbulance = async () => {
    const JSON = {
      facility_id: selectedFacilityOption.id,

      // longitude: getlatitude.lat,
      // incident_type_id:selectedOption.value,
      // description:values.description,
      // informer_name:values.informer_name,
      // informer_phone_numbers:[values.informer_phone_numbers],
      // informer_address:"test ",
      // type:selectedOption.label,
    };
    console.log(JSON);
    console.log(selectedFacilityOption, "dsdsds");
    try {
      await axios
        .patch(`${Vars.domain}/ambulances/${datatt?.id}`, JSON, config)
        .then((res) => {
          console.log(res);
          toast.success("Updated Successfuly");
          setBtnDisbale(true);
          setOpen(false);
          openModal(false);
        });
    } catch (e) {
      // setLoadingMessage(false);
      toast.error("failed");
      console.log(e);
    }
    console.log(ambulanceID, "aaambID");
  };
  const activeIndex = (index) => {
    debugger;
    setDynamicIndex(index);
  };
  return (
    <>
      <Toaster position="bottom-right" richColors />

      {showAssignAmbulance?.length === 0 ? (
        <div className="flex mt-4 flex-col hover:bg-gray-100 cursor-pointer justify-end gap-1 border  border-gray-400 p-1 rounded-md mb-2 text-gray-800">
          <p className="text-right">loading...</p>
        </div>
      ) : (
        showAssignAmbulance?.map((ambulance, index) => (
          <div
            key={ambulance?.id}
            className="flex mt-4 flex-col hover:bg-gray-100 cursor-pointer justify-end gap-1 border border-gray-400 p-1 rounded-md mb-2 text-gray-800"
          >
            <p className="text-right">Model:{ambulance?.model}</p>
            <p className="text-right">
              Persons Supported:{ambulance?.persons_supported}
            </p>
            <p className="text-right">Id No:{ambulance?.id_no}</p>

            {disabledAmbulanceIDs.includes(ambulance?.id) && (
              <div key={ambulance?.id}>
                <div className="border-t-4 flex justify-around ">
                  <p className="flex text-xl font-bold ">
                    Assigned Health Care
                  </p>
                  <button
                    className="flex text-right text-blue-500 mt-2"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <BiEdit />
                  </button>
                </div>
                <p>
                  <span>Name: </span> {selectedFacilityOption?.name}
                </p>
                <p>
                  <span>Address: </span> {selectedFacilityOption?.address}
                </p>
                <p>
                  <span>Email: </span> {selectedFacilityOption?.email}
                </p>
                <p>
                  <span>Phone Number: </span>
                  {selectedFacilityOption?.phone_numbers?.map((phone) => (
                    <span key={phone?.id}>{phone?.number}</span>
                  ))}
                </p>
                <p>
                  <span>Focal Person: </span>
                  {selectedFacilityOption?.focal_persons?.map((person) => (
                    <span key={person?.id}>
                      {person?.first_name}
                      {person?.last_name}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {!disabledAmbulanceIDs.includes(ambulance?.id) && (
              <button
                onClick={() => {
                  setOpen(true);
                  setAmbulanceID(ambulance?.id);

                  // Toggle the visibility of the div
                  setVisibleDivIndex((prevIndex) =>
                    prevIndex === index ? null : index
                  );

                  // Set the flag to true once the hidden div is shown
                  setHasHiddenDivShown(true);

                  // Disable the button and set the ambulance ID to the disabledAmbulanceIDs state
                  setDisabledAmbulanceIDs((prevIDs) => [
                    ...prevIDs,
                    ambulance?.id,
                  ]);
                }}
                className={`flex items-center m-1 px-1.5 py-1.5 w-36 rounded-md text-sm justify-center 
            ${
              visibleDivIndex === index
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-white border-2 border-primary-100 hover:border-primary-100 transition-all duration-300 hover:bg-primary-100 hover:text-white"
            }
          `}
              >
                Assign HealthCare
              </button>
            )}
          </div>
        ))
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50  overflow-y-auto">
            <div className="flex w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative px-6 py-2 top-9 right-20 transform mx-auto w-[32rem] h-40  overflow-hidden rounded-lg bg-white  shadow-xl transition-all">
                  <div>
                    <div className="mb-5 mt-4">
                      <Listbox
                        value={selectedFacilityOption}
                        onChange={(selectedValue) => {
                          setSelectedFacilityOption(selectedValue);
                        }}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 text-right">
                              Select Facility
                            </Listbox.Label>
                            <div className="relative mt-2">
                              <Listbox.Button className="relative w-full h-8 cursor-default rounded-md bg-white py-1.5 pl-10 pr-3 text-right text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:text-sm sm:leading-6">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400 transform rotate-180"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="block truncate">
                                  {selectedFacilityOption.name}
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {menuIsOpen?.map((option) => (
                                    <Listbox.Option
                                      key={option.name}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-primary-100 text-white"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-8 pr-4 text-right"
                                        )
                                      }
                                      value={option}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {option.name}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-primary-100",
                                                "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
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
                    </div>
                    <div className="flex items-start justify-start">
                      {/* <button
          className="text-primary-100 bg-white rounded-md border-2 border-primary-100 mr-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
          onClick={onClick}
        >
          Next
        </button> */}
                      <button
                        className="text-white bg-primary-100 rounded-md border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
                        type="submit"
                        onClick={createAssignAmbulance}
                      >
                        Assign HealthCares
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default EditHealthCare;
