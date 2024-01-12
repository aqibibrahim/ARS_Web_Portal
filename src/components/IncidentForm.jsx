import React, { useState } from "react";
import DropdownListbox from "./DropdownListbox";
import StyledInput from "./StyledInput";
import TextareaComponent from "./TextareaComponent";

const incidentTypes = [
  {
    title: "Type of Incident",
    current: false,
  },
  {
    title: "Option 2",
    current: false,
  },
  {
    title: "Fire",
    current: false,
  },
];

const IncidentForm = ({ handleIncidentNext }) => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [selectedIncidentType, setSelectedIncidentType] = useState(
    incidentTypes[0]
  );
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      location,
      name,
      contact,
      incidentType: selectedIncidentType.title,
      description,
    };
    console.log(formData);

    handleIncidentNext(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 mt-2">
        <StyledInput
          label="Location"
          id="location"
          type="text"
          placeholder={"Location"}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <StyledInput
          label="Name"
          id="name"
          type="text"
          placeholder={"Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <StyledInput
          label="Contact"
          id="contact"
          type="text"
          placeholder={"Contact"}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <DropdownListbox
          options={incidentTypes}
          selectedOption={selectedIncidentType}
          setSelectedOption={setSelectedIncidentType}
          label="Incident"
        />
      </div>
      <div className="mb-5">
        <TextareaComponent
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
        type="submit"
      >
        Next
      </button>
    </form>
  );
};

export default IncidentForm;
