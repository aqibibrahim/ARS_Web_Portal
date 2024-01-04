import axios from "axios";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const Vars= {
  domain:"https://ars.disruptwave.com/api"
}

const apiClient = axios.create({
  baseURL: "https://ars.disruptwave.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllAmbulances = () => {
  return apiClient.get("ambulances");
};

export const getAllEquipment = () => {
  return apiClient.get("equipments");
};

export const getAllIncidentTypes = () => {
  return apiClient.get("incident-type");
};

export const getAllHealthcare = () => {
  return apiClient.get("facilities");
};

export const getAllDepartments = () => {
  return apiClient.get("departments");
};

export const getAllRegions = () => {
  return apiClient.get("regions");
};

export const createAmbulance = async (
  setLoading,
  plateNo,
  make,
  model,
  gpsNo,
  personsSupported,
  password,
  gpsLatitude,
  gpsLongitude,
  parkingLatitude,
  parkingLongitude,
  setIsModalOpen,
  setError,
  selectedEquipment
) => {
  console.log("In createAmbulance");
  let equipmentId = selectedEquipment.map((item) => item.id);
  setLoading(true);

  try {
    const token = getToken();
    const response = await axios.post(
      "https://ars.disruptwave.com/api/ambulances",
      {
        plate_no: plateNo,
        make: make,
        model: model,
        gps_no: Number(gpsNo),
        persons_supported: Number(personsSupported),
        password: password,
        gps_latitude: Number(gpsLatitude),
        gps_longitude: Number(gpsLongitude),
        parking_latitude: Number(parkingLatitude),
        parking_longitude: Number(parkingLongitude),
        equipments: equipmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLoading(false);
    setIsModalOpen(false);
  } catch (err) {
    setLoading(false);
    setError("Error creating ambulance");
    console.error(err.message || "An error occurred while creating ambulance");
  }
};

export const updateAmbulance = async (
  setLoading,
  ambulanceId,
  make,
  model,
  gpsNo,
  personsSupported,
  password,
  gpsLatitude,
  gpsLongitude,
  parkingLatitude,
  parkingLongitude,
  setIsModalOpen,
  setError,
  selectedEquipment
) => {
  console.log("In update Ambulance");
  let equipmentId = selectedEquipment.map((item) => item.id);
  setLoading(true);

  const updateData = {
    make: make,
    model: model,
    gps_no: gpsNo,
    persons_supported: personsSupported,
    password: password,
    gps_latitude: gpsLatitude,
    gps_longitude: gpsLongitude,
    parking_latitude: parkingLatitude,
    parking_longitude: parkingLongitude,
    equipments: equipmentId,
  };
  console.log("UPDATE DATA: ", updateData);

  try {
    const token = getToken();
    const response = await axios.patch(
      `https://ars.disruptwave.com/api/ambulances/${ambulanceId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLoading(false);
    setIsModalOpen(false);
  } catch (err) {
    setLoading(false);
    setError("Error updating ambulance");
    console.error(err.message || "An error occurred while updating ambulance");
  }
};

export const createHealthcare = async (
  selectedDepartments,
  selectedContactNos,
  email,
  latitude,
  longitude,
  address,
  facilityName,
  userId,
  setLoading,
  setError
) => {
  let departmentIds = selectedDepartments.map((item) => item.id);
  setLoading(true);

  try {
    const token = getToken();
    const response = await axios.post(
      "https://ars.disruptwave.com/api/facilities",
      {
        user_id: userId,
        departments: departmentIds,
        name: facilityName,
        email,
        phone_numbers: selectedContactNos,
        latitude,
        longitude,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);

    setIsModalOpen(false);
  } catch (err) {
    setLoading(false);

    setError("Failed to add healthcare");
    console.error(err.message || "An error occurred while creating healthcare");
  }
};

export const updateHealthcare = async (
  selectedDepartments,
  selectedContactNos,
  email,
  latitude,
  longitude,
  address,
  facilityName,
  userId,
  setLoading,
  setError,
  healthcareId
) => {
  let departmentIds = selectedDepartments.map((item) => item.id);
  setLoading(true);

  const updateData = {
    user_id: userId,
    departments: departmentIds,
    name: facilityName,
    email,
    phone_numbers: selectedContactNos,
    latitude,
    longitude,
    address,
  };

  console.log("UPDATEDATA IN HEALT: ", updateData);
  try {
    const token = getToken();
    const response = await axios.patch(
      `https://ars.disruptwave.com/api/facilities/${healthcareId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    setIsModalOpen(false);
  } catch (err) {
    setLoading(false);
    setError("Error updating healthcare");
    console.error(err.message || "An error occurred while updating healthcare");
  }
};
