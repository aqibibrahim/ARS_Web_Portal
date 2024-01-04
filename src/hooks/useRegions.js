import { useState, useEffect } from "react";
import { getAllRegions } from "../helpers/helpers";

export function useRegions() {
  const [regionData, setRegionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getAllRegions();
        setLoading(false);
        if (response.data.success) {
          setRegionData(response.data.data);
        }
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch regions");
      }
    }

    fetchData();
  }, []);

  return { regionData, loading, error };
}
