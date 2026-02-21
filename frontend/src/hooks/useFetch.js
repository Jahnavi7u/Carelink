import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Get token if needed
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(endpoint, {
          headers,
          ...options, // Allow additional fetch options
        });

        // Extract docName correctly from response.data
        const fetchedData = response.data;
        const docName = fetchedData.docName || "Unknown"; // Avoid undefined errors

        setData({ ...fetchedData, docName });
      } catch (err) {
        setError(err.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]); // Runs when `endpoint` changes

  return { data, loading, error };
};

export default useFetch;
