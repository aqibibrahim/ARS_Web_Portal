// AmbulanceContext.js
import { createContext, useContext, useState } from "react";

const AmbulanceContext = createContext();

export const AmbulanceProvider = ({ children }) => {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState();
  const [notificationDropdown, setNotificationDropdown] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [notificationDropdownData, setNotificationDropdownData] = useState([]);
  const setAmbulanceId = (id) => {
    setSelectedAmbulanceId(id);
  };

  const resetState = () => {
    // Reset state to initial values
    setSelectedAmbulanceId(null);
    setSelectedIncidentId(false);
    setSelectedFacilityId(null);
  };
  const resetIncidentState = () => {
    // Reset state to initial values
    setSelectedIncidentId(false);
  };
  const resetNotificationDropdown = () => {
    // Reset state to initial values
    setNotificationDropdownData(null);
    setNotificationDropdown(null);
  };
  return (
    <AmbulanceContext.Provider
      value={{
        viewModalOpen,
        setViewModalOpen,
        notificationDropdownData,
        setNotificationDropdownData,
        selectedAmbulanceId,
        setAmbulanceId,
        resetState,
        setSelectedIncidentId,
        selectedIncidentId,
        resetIncidentState,
        setSelectedFacilityId,
        selectedFacilityId,
        setNotificationDropdown,
        notificationDropdown,
        resetNotificationDropdown,
      }}
    >
      {children}
    </AmbulanceContext.Provider>
  );
};

export const useAmbulanceContext = () => {
  return useContext(AmbulanceContext);
};
