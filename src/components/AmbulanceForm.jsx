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
  const { setAmbulanceId } = useAmbulanceContext();

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
          .get(`https://ars.disruptwave.com/api/ambulances`, {
            headers: headers,
          })
          .then((response) => {
            setMyData(
              response.data?.data?.map((variant) => ({
                label: variant.model,
                value: variant.id,
                persons_supported: variant.persons_supported,
                id_no: variant.id_no,
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
    setSelectedAmbulance(selectedAmbulance);
    setAmbulanceId(selectedAmbulance);
  };
  const formatOptionLabel = ({ label, persons_supported, id_no, value }) => (
    <div className="flex flex-col hover:bg-gray-100 cursor-pointer justify-end gap-2 border  border-gray-400 p-1 rounded-md mb-2 text-gray-800">
      <p className="text-right">Model:{label}</p>
      <p className="text-right">Persons Supported:{persons_supported}</p>
      <p className="text-right">Id No:{id_no}</p>
      <p
        className="text-blue-500 text-right hover:underline focus:outline-none"
        onClick={() => handleViewOnMap(value)}
      >
        View on Map
      </p>
    </div>
  );
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <form onSubmit={assignAmbulance.handleSubmit}>
        <div className="mb-5 mt-2">
          <Select
            value={selectedOption}
            placeholder="Select"
            onChange={handleChange}
            options={myData}
            formatOptionLabel={formatOptionLabel}
            isMultiple={true}
            isClearable={true}
            primaryColor={"blue"}
            className="peer  w-full px-1 flex justify-end border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
          />
        </div>
        <div>
          <button
            className="text-primary-100 bg-white rounded-md border-2 border-primary-100 mr-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
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
