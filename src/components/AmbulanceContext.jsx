// AmbulanceContext.js
import { createContext, useContext, useState } from "react";

const AmbulanceContext = createContext();

export const AmbulanceProvider = ({ children }) => {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);

  const setAmbulanceId = (id) => {
    setSelectedAmbulanceId(id);
  };

  const resetState = () => {
    // Reset state to initial values
    setSelectedAmbulanceId(null);
  };

  return (
    <AmbulanceContext.Provider
      value={{ selectedAmbulanceId, setAmbulanceId, resetState }}
    >
      {children}
    </AmbulanceContext.Provider>
  );
};

export const useAmbulanceContext = () => {
  return useContext(AmbulanceContext);
};
