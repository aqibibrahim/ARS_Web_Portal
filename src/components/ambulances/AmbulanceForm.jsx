import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import StyledInput from "../StyledInput";
import { BsArrowRightCircle } from "react-icons/bs";
import { Vars, getAllEquipment } from "../../helpers/helpers";
import { Toaster, toast } from "sonner";
import axios from "axios";
import MultiSelectDropdown from "../MultiSelectDropdown";

const AmbulanceForm = ({ setFunc, setAdd }) => {
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const fetchEquipment = async () => {
    try {
      const response = await getAllEquipment();
      if (response.data.success) {
        setEquipment(response.data.data);
      } else {
        console.error("Failed to fetch equipment data");
      }
    } catch (err) {
      console.log(err);
      console.error(
        err.message || "An error occurred while fetching equipment"
      );
    }
  };
  useEffect(() => {
    fetchEquipment();
  }, []);

  const addAmbulance = useFormik({
    initialValues: {
      gps_latitude: "",
      gps_longitude: "",
      parking_latitude: "",
      parking_longitude: "",
      plate_no: "",
      make: "",
      model: "",
      gps_no: "",
      persons_supported: "",
      password: "",
    },
    onSubmit: (values) => {
      var postJSON = {
        equipments: equipment,
        gps_latitude: values?.gps_latitude,
        gps_longitude: values?.gps_longitude,
        parking_latitude: values?.parking_latitude,
        parking_longitude: values?.parking_longitude,
        plate_no: values?.plate_no,
        make: values?.make,
        model: values?.model,
        gps_no: values?.gps_no,
        persons_supported: values?.persons_supported,
        password: values?.password,
      };
      console.log(postJSON);
      axios
        .post(`${Vars.domain}/ambulances`, postJSON, {
          headers: { Authorization: `Bearer ${localStorage?.token}` },
        })
        .then((res) => {
          toast.success("Ambulance Created Successfuly");
          setAdd(true);
        })
        .catch((e) => {
          toast.error("Error Creating Ambulance");
          console.log(e);
        });
    },
  });
  return (
    <div>
      <Toaster richColors />
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-1 -left-96 mx-auto p-0 border w-[600px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
          <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
            <BsArrowRightCircle
              width={9}
              className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
              onClick={() => setFunc(false)}
            />
            <h3 className="text-xl font-semibold">Create New Ambulance</h3>
          </div>
          <form onSubmit={addAmbulance.handleSubmit} className="p-5">
            <div className="flex flex-row justify-between gap-4 mb-4">
              <div className="flex flex-col space-y-2 w-full">
                <MultiSelectDropdown
                  options={equipment}
                  selectedOptions={selectedEquipment}
                  setSelectedOptions={setSelectedEquipment}
                  label={"Equipment"}
                  placeholder="Select Equipment"
                  bgColor={"#91EAAA"}
                />

                <StyledInput
                  label={"GPS Latitude"}
                  id={"gps_latitude"}
                  type={"number"}
                  placeholder={"gps_latitude"}
                  value={addAmbulance.values.gps_latitude}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"GPS Longitude"}
                  id={"gps_longitude"}
                  type={"number"}
                  placeholder={"gps_longitude"}
                  value={addAmbulance.values.gps_longitude}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"Parking Latitude"}
                  id={"parking_latitude"}
                  type={"number"}
                  placeholder={"parking_latitude"}
                  value={addAmbulance.values.parking_latitude}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"Parking Longitude"}
                  id={"parking_longitude"}
                  type={"number"}
                  placeholder={"parking_longitude"}
                  value={addAmbulance.values.parking_longitude}
                  onChange={addAmbulance.handleChange}
                />
              </div>
              <div className="flex flex-col space-y-2 w-full">
                <StyledInput
                  label={"Plate No"}
                  id={"plate_no"}
                  type={"text"}
                  placeholder={"Enter Plate No"}
                  value={addAmbulance.values.plate_no}
                  onChange={addAmbulance.handleChange}
                />

                <StyledInput
                  label={"Make"}
                  id={"make"}
                  type={"text"}
                  placeholder={"Enter Make"}
                  value={addAmbulance.values.make}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"Model"}
                  id={"model"}
                  type={"text"}
                  placeholder={"Enter Model"}
                  value={addAmbulance.values.model}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"GPS No"}
                  id={"gps_no"}
                  type={"text"}
                  placeholder={"GPS No"}
                  value={addAmbulance.values.gps_no}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"Persons Supported"}
                  id={"persons_supported"}
                  type={"number"}
                  placeholder={"Persons Supported"}
                  value={addAmbulance.values.persons_supported}
                  onChange={addAmbulance.handleChange}
                />
                <StyledInput
                  label={"Password"}
                  id={"password"}
                  type={"password"}
                  placeholder={"Password"}
                  value={addAmbulance.values.password}
                  onChange={addAmbulance.handleChange}
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Ambulance Credentials</h3>
            </div>
            <div className="text-left mt-10">
              <button
                type="submit"
                className="text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100"
              >
                Save Ambulance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceForm;
