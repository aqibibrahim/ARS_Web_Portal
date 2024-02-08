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
  editData,
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
  const [showAssignAmbulance, setShowAssignAmbulance] = useState([]);
  const [assignedAmbulance, setAssignedAmbulance] = useState([]);
  const [initiallyAssignedAmbulance, setInitiallyAssignedAmbulance] = useState(
    []
  );

  const [driver, setDriver] = useState("");
  const { selectedAmbulanceId, setAmbulanceId, resetState } =
    useAmbulanceContext();
  const incidentEditID = localStorage.getItem("IncidentID");
  // setAmbulanceId(null);
  console.log(selectedAmbulanceId, "selected");
  const assignAmbulance = useFormik({
    initialValues: {
      ambulances: "",
    },
    onSubmit: async (values) => {
      // if (!selectedOption || selectedOption.length === 0) {
      //   toast.error("Please select an ambulance before submitting.");
      //   return;
      // }
      const JSON = {
        ambulances:
          assignedAmbulance.length > 0
            ? assignedAmbulance
            : initiallyAssignedAmbulance,
      };

      const id = localStorage.getItem("IncidentID");
      try {
        await axios
          .patch(`${Vars.domain}/incidents/${getid}`, JSON, config)
          .then((res) => {
            console.log(res);
            toast.success("Ambulance Assigned Successfully");
            setTimeout(() => {
              handleAmbulanceNext(getid);
            }, 500);
          });
      } catch (e) {
        toast.error("خطأ في تعيين سيارة إسعاف");
        console.log(e);
      }
    },
    enableReinitialize: true,
  });
  // const assignAmbulance = useFormik({
  //   initialValues: {
  //     ambulances: "",
  //   },
  //   onSubmit: (values) => {
  //     // setLoadingMessage(true);
  //     const JSON = {
  //       // ambulance_id:[selectedOption[0].value],
  //       ambulances: selectedOption?.map((item) => item.value),

  //       // longitude: getlatitude.lat,
  //       // incident_type_id:selectedOption.value,
  //       // description:values.description,
  //       // informer_name:values.informer_name,
  //       // informer_phone_numbers:[values.informer_phone_numbers],
  //       // informer_address:"test ",
  //       // type:selectedOption.label,
  //     };
  //     console.log(JSON);
  //     const createAssignAmbulance = async () => {
  //       try {
  //         await axios
  //           .patch(`${Vars.domain}/incidents/${getid}`, JSON, config)
  //           .then((res) => {
  //             console.log(res);
  //             // setSubmitDone(!submitDone);
  //             // setLoadingMessage(false);
  //             toast.success("Ambulance Assigned Successfuly");
  //             setTimeout(() => {
  //               handleAmbulanceNext(getid);
  //             }, 500);
  //           });
  //       } catch (e) {
  //         // setLoadingMessage(false);
  //         toast.error("failed");
  //         console.log(e);
  //       }
  //     };

  //     createAssignAmbulance();
  //   },

  //   enableReinitialize: true,
  // });

  const [menuIsOpen, setMenuIsOpen] = useState([]);

  const [myData, setMyData] = useState([]);
  useEffect(() => {
    const fetchIncidentsData = async () => {
      const id = localStorage.getItem("IncidentID");
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
                  variant.model?.make?.name +
                  " " +
                  variant.model?.name +
                  " " +
                  variant?.plate_no,
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
    const fetchsingleincidentsData = async () => {
      const id = localStorage.getItem("IncidentID");
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/incidents/${id}`, {
            headers: headers,
          })
          .then((response) => {
            const initialSelectedAmbulanceIds =
              response?.data?.data?.ambulances?.map(
                (ambulance) => ambulance.id
              ) || [];
            setInitiallyAssignedAmbulance(initialSelectedAmbulanceIds);
            setShowAssignAmbulance(response?.data?.data?.ambulances);
            // setSelectedOption(response?.data?.data?.ambulances);
            console.log("fetchsingleData", response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchsingleincidentsData();
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

  // const handleChange = (selectedOptions) => {
  //   setSelectedOption(selectedOptions);

  //   console.log(selectedOptions);
  // };
  // const handleChange = (selectedOptions) => {
  //   console.log("Selected Options:", selectedOptions);
  //   // Ensure selectedOptions is not null or undefined
  //   setSelectedOption(selectedOptions);

  //   const updatedIds = selectedOptions?.map((option) => option?.value) || [];
  //   console.log("Updated Ids:", updatedIds);

  //   setAssignedAmbulance([...assignedAmbulance, ...updatedIds]);
  //   console.log("Assigned Ambulance:", assignedAmbulance);
  // };
  const handleChange = (selectedOptions) => {
    console.log("Selected Options:", selectedOptions);

    // Ensure selectedOptions is not null or undefined
    setSelectedOption(selectedOptions);

    // Extract unique ids from selectedOptions
    const updatedIds = [
      ...new Set(selectedOptions?.map((option) => option?.value) || []),
    ];
    console.log("Updated Ids:", updatedIds);

    // Update assignedAmbulance state
    setAssignedAmbulance((prevAssignedAmbulance) => {
      // Filter out unchecked ids
      const updatedAmbulance = prevAssignedAmbulance.filter((id) =>
        updatedIds.includes(id)
      );

      // Add newly checked ids, ensuring initiallyAssignedAmbulance is always present
      const newAssignedAmbulance = [
        ...new Set([
          ...initiallyAssignedAmbulance,
          ...updatedAmbulance,
          ...updatedIds,
        ]),
      ];

      return newAssignedAmbulance;
    });

    console.log("Assigned Ambulance:", assignedAmbulance);
  };

  // const handleViewOnMap = (selectedAmbulance) => () => {
  //   // Prevent the click event from propagating to the parent elements
  //   // setSelectedAmbulance(selectedAmbulance);
  //   setAmbulanceId(selectedAmbulance);
  // };
  const handleViewOnMap = (value) => (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent elements
    setAmbulanceId(value);
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
    <>
      {" "}
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
        </p>{" "}
        <div className="flex justify-end">
          <p
            className="text-white bg-blue-400 p-1 w-28 flex justify-center justify-items-end hover:bg-white hover:text-blue-400 hover:border-blue-400 hover:border rounded-xl text-right focus:outline-none"
            onClick={handleViewOnMap(value)}
          >
            عرض على الخريطة
          </p>
        </div>
      </div>{" "}
    </>
  );
  return (
    <>
      <Toaster position="bottom-right" richColors />
      {showAssignAmbulance?.length > 0 ? (
        <div className="px-5">
          <p className="text-base text-right font-semibold">
            Selected Ambulance Details
          </p>
          {showAssignAmbulance?.map((ambulance, index) => (
            <div
              className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
              key={ambulance.id}
            >
              <div className="flex justify-between gap-12  ">
                <p className="bg-blue-200 p-2 rounded-full w-8 h-8 justify-center text-center flex flex-grow">
                  {index + 1}
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">Make: </span>{" "}
                  {ambulance.model?.make?.name}
                </p>
                <p>
                  <span className="font-semibold">Model:</span>{" "}
                  {ambulance?.model?.name}
                </p>
                <p>
                  <span className="font-semibold">Plate#:</span>{" "}
                  {ambulance?.plate_no}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      <form onSubmit={assignAmbulance.handleSubmit}>
        <div className="mb-5 mt-2 flex">
          <Select
            value={selectedOption}
            placeholder="اختر سيارة اسعاف"
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
          {initiallyAssignedAmbulance.length > 0 ||
          assignAmbulance.length > 0 ||
          selectedOption ? (
            <button
              className="text-primary-100 flex  bg-white rounded-md border-2 border-primary-100 mr-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
              type="submit"
            >
              التالي
            </button>
          ) : (
            ""
          )}
        </div>
      </form>
    </>
  );
};

export default AmbulanceForm;
