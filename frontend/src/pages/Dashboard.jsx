import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LogForm from "../components/LogForm";
import LogList from "../components/LogList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("mindvault_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadEntries = async () => {
      try {
        const response = await api.get("/entries");
        setEntries(response.data);
      } catch (loadError) {
        setError("Unable to load logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [navigate, token]);

  const handleSave = async (entryData) => {
    try {
      const response = await api.post("/entries", entryData);
      setEntries((prevEntries) => [response.data, ...prevEntries]);
      setError("");
    } catch (createError) {
      setError("Unable to save log. Please try again.");
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await api.delete(`/entries/${entryId}`);
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry._id !== entryId),
      );
      setError("");
    } catch (deleteError) {
      setError("Unable to delete log. Please try again.");
    }
  };

  return (
    <div className="container">
      <Navbar />
      {error && <p className="error">{error}</p>}
      <LogForm onSave={handleSave} />
      {loading ? (
        <div className="card">
          <p className="message">Loading your logs...</p>
        </div>
      ) : (
        <LogList entries={entries} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Dashboard;
