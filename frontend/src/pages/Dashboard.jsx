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
    <div className="dashboard-page">
      <Navbar />
      <div className="container dashboard-shell">
        {error && <p className="error page-error">{error}</p>}
        <div className="dashboard-grid">
          <section className="editor-panel card">
            <div className="hero-copy">
              <p className="eyebrow">Daily reflection</p>
              <h1 className="primary-heading">
                A calm place to write, remember, and grow.
              </h1>
              <p>
                Capture your thoughts with a warm writing experience, then
                return to your personal MindVault anytime.
              </p>
            </div>
            <LogForm onSave={handleSave} />
          </section>

          <section className="entries-panel card">
            <div className="entries-header">
              <p className="eyebrow">Recent reflections</p>
              <h2>My Journal</h2>
              <p className="message subtle">
                Scroll only this panel to browse your latest entries.
              </p>
            </div>
            {loading ? (
              <div className="empty-state">
                <p className="message">Loading your logs...</p>
              </div>
            ) : (
              <div className="entry-scroll">
                <LogList entries={entries} onDelete={handleDelete} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
