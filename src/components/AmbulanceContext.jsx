// AmbulanceContext.js
import { createContext, useContext, useState } from "react";

const AmbulanceContext = createContext();

export const AmbulanceProvider = ({ children }) => {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState();

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
  return (
    <AmbulanceContext.Provider
      value={{
        selectedAmbulanceId,
        setAmbulanceId,
        resetState,
        setSelectedIncidentId,
        selectedIncidentId,
        resetIncidentState,
        setSelectedFacilityId,
        selectedFacilityId,
      }}
    >
      {children}
    </AmbulanceContext.Provider>
  );
};

export const useAmbulanceContext = () => {
  return useContext(AmbulanceContext);
};
