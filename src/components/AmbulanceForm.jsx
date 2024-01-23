import React, { useEffect, useState } from "react";
import DropdownListbox from "./DropdownListbox";
import StyledInput from "./StyledInput";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import Select from "react-tailwindcss-select";
import axios from "axios";
import Maps from "./Maps";
import { Vars } from "../helpers/helpers";
import { useFormik } from "formik";
import { Toaster, toast } from "sonner";
import { useAmbulanceContext } from "./AmbulanceContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AmbulanceForm = ({
  handleAmbulanceNext,
  showIncidentSummary,
  getid,
  // onViewOnMap,
}) => {
  var token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedAmbulances, setSelectedAmbulances] = useState([]);
  const [selectedRegionOption, setSelectedRegionOption] = useState({});
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [driver, setDriver] = useState("");
  const { selectedAmbulanceId, setAmbulanceId, resetState } =
    useAmbulanceContext();
  const assignAmbulance = useFormik({
    initialValues: {
      ambulances: "",
    },
    onSubmit: (values) => {
      // setLoadingMessage(true);
      const JSON = {
        // ambulance_id:[selectedOption[0].value],
        ambulances: selectedOption?.map((item) => item.value),

        // longitude: getlatitude.lat,
        // incident_type_id:selectedOption.value,
        // description:values.description,
        // informer_name:values.informer_name,
        // informer_phone_numbers:[values.informer_phone_numbers],
        // informer_address:"test ",
        // type:selectedOption.label,
      };
      console.log(JSON);
      const createAssignAmbulance = async () => {
        try {
          await axios
            .patch(`${Vars.domain}/incidents/${getid}`, JSON, config)
            .then((res) => {
              console.log(res);
              // setSubmitDone(!submitDone);
              // setLoadingMessage(false);
              toast.success("Ambulance Assign Successfuly");
              setTimeout(() => {
                handleAmbulanceNext(getid);
              }, 500);
            });
        } catch (e) {
          // setLoadingMessage(false);
          toast.error("failed");
          console.log(e);
        }
      };

      createAssignAmbulance();
    },

    enableReinitialize: true,
  });

  const [menuIsOpen, setMenuIsOpen] = useState([]);

  const [myData, setMyData] = useState([]);
  useEffect(() => {
    const fetchIncidentsData = async () => {
      try {
        await axios
          .get(
            `https://ars.disruptwave.com/api/get-available-ambulances?incident_id=${getid}`,
            {
              headers: headers,
            }
          )
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label:
                  variant.make + " " + variant.model + " " + variant?.plate_no,
                value: variant.id,
                persons_supported: variant.persons_supported,
                id_no: variant.id_no,
                distance: variant?.distance_info
                  ? variant?.distance_info?.rows[0]?.elements[0]?.distance?.text
                  : "Distance Not Available",
                duration:
                  variant?.distance_info?.rows[0]?.elements[0]?.duration?.text,
                criteriaMatched: variant?.criteria_matched,
              }))
            );
            // setIsLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchIncidentsData();
  }, []);
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/regions`, {
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

  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);
    console.log(selectedOptions);
  };

  const handleViewOnMap = (selectedAmbulance) => {
    // Prevent the click event from propagating to the parent elements
    setSelectedAmbulance(selectedAmbulance);
    setAmbulanceId(selectedAmbulance);
  };

  const formatOptionLabel = ({
    label,
    persons_supported,
    id_no,
    value,
    distance,
    duration,
    criteriaMatched,
  }) => (
    <div
      className={`flex flex-col hover:bg-gray-100 cursor-pointer justify-end gap-2 border ${
        criteriaMatched ? "border-green-500 border-2" : "border-gray-400"
      } p-1 rounded-md mb-2 text-gray-800`}
    >
      <p className="text-right">{label}</p>
      <p className="text-right">Persons Supported: {persons_supported}</p>
      <p className="text-right">Id No: {id_no}</p>
      <p className="text-right text-green-500">
        {distance} {duration}
      </p>
      <div className="flex justify-end">
        <p
          className="text-white bg-blue-400 p-1 w-28 flex justify-center justify-items-end hover:bg-white hover:text-blue-400 hover:border-blue-400 hover:border rounded-xl text-right focus:outline-none"
          onClick={handleViewOnMap(value)}
        >
          View on Map
        </p>
      </div>
    </div>
  );
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <form onSubmit={assignAmbulance.handleSubmit}>
        <div className="mb-5 mt-2 flex">
          <Select
            value={selectedOption}
            placeholder="Select Ambulance"
            onChange={handleChange}
            options={myData}
            formatOptionLabel={formatOptionLabel}
            isMultiple={true}
            isClearable={true}
            primaryColor={"blue"}
            className="peer  w-full px-1 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
          />
        </div>
        <div className="flex  bottom-10 absolute">
          <button
            className="text-primary-100 flex  bg-white rounded-md border-2 border-primary-100 mr-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default AmbulanceForm;
