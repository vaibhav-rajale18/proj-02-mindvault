import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("mindvault_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let mounted = true;

    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await api.get("/entries");
        if (mounted) setEntries(response.data);
      } catch (loadError) {
        if (
          loadError.response?.status === 401 ||
          loadError.response?.status === 403
        ) {
          localStorage.removeItem("mindvault_token");
          navigate("/login");
        } else {
          setError("Unable to load logs. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEntries();
    return () => {
      mounted = false;
    };
  }, [navigate, token]);

  return {
    entries,
    setEntries,
    loading,
    error,
    setError,
  };
};
