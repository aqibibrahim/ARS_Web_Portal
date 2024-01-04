import { useState, useEffect } from "react";
import { getAllAmbulances } from "../helpers/helpers";

export function useAmbulances() {
  const [ambulanceData, setAmbulanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getAllAmbulances();
        setLoading(false);
        if (response.data.success) {
          setAmbulanceData(response.data.data);
        }
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch ambulances");
      }
    }

    fetchData();
  }, []);

  return { ambulanceData, loading, error };
}
