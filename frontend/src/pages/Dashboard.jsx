import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LogForm from "../components/LogForm";
import LogList from "../components/LogList";
import Streak from "../components/Streak";
import StatsPanel from "../components/StatsPanel";
import { formatCreatedAt, formatDateOnly } from "../utils/date";

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("mindvault_token");

  const handleAuthError = (loadError) => {
    if (
      loadError.response?.status === 401 ||
      loadError.response?.status === 403
    ) {
      localStorage.removeItem("mindvault_token");
      navigate("/login");
      return;
    }

    setError("Unable to load logs. Please try again.");
  };

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
        handleAuthError(loadError);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEntries();
    return () => {
      mounted = false;
    };
  }, [navigate, token]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;

    return entries.filter((entry) => {
      const title = (entry.title || "").toLowerCase();
      const content = (entry.content || "").toLowerCase();
      const mood = (entry.mood || "").toLowerCase();
      const tags = (entry.tags || []).join(" ").toLowerCase();

      const dt = new Date(entry.createdAt);

      const formattedFull = dt
        .toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .toLowerCase();

      const formattedShort = formatCreatedAt(entry.createdAt).toLowerCase();
      const dateOnly = formatDateOnly(entry.createdAt).toLowerCase();
      const isoDate = dt.toISOString().split("T")[0].toLowerCase();
      const monthLong = dt
        .toLocaleString(undefined, { month: "long" })
        .toLowerCase();
      const monthShort = dt
        .toLocaleString(undefined, { month: "short" })
        .toLowerCase();
      const dayMonth = dt
        .toLocaleString(undefined, { month: "short", day: "numeric" })
        .toLowerCase();
      const dayMonthYear = dt
        .toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toLowerCase();
      const timeOnly = dt
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        .toLowerCase();

      const searchableText = `${title}\n${content}\n${mood}\n${tags}\n${formattedFull}\n${formattedShort}\n${dateOnly}\n${isoDate}\n${monthLong}\n${monthShort}\n${dayMonth}\n${dayMonthYear}\n${timeOnly}`;

      return searchableText.includes(q);
    });
  }, [entries, searchQuery]);

  const handleSave = async (entryData) => {
    try {
      const response = await api.post("/entries", entryData);
      setEntries((prevEntries) => [response.data, ...prevEntries]);
      setError("");
    } catch (createError) {
      if (
        createError.response?.status === 401 ||
        createError.response?.status === 403
      ) {
        localStorage.removeItem("mindvault_token");
        navigate("/login");
      } else {
        setError("Unable to save log. Please try again.");
      }
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
      if (
        deleteError.response?.status === 401 ||
        deleteError.response?.status === 403
      ) {
        localStorage.removeItem("mindvault_token");
        navigate("/login");
      } else {
        setError("Unable to delete log. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="container dashboard-shell">
        {error && <p className="error page-error">{error}</p>}
        <div className="dashboard-grid">
          <section className="editor-panel">
            <div className="editor-header">
              <div>
                <p className="eyebrow">Reflect and plan</p>
                <h1 className="primary-heading">
                  Build clarity with disciplined daily logs.
                </h1>
                <Streak entries={entries} />
                <p className="panel-copy">
                  Capture your study insights, maintain focus, and review your
                  progress without distraction.
                </p>
              </div>
            </div>
            <LogForm onSave={handleSave} />
          </section>

          <section className="entries-panel card">
            <div className="entries-panel-top">
              <div className="entries-panel-meta">
                <p className="eyebrow">My Journals</p>
                <h2>Recent entries</h2>
              </div>

              <div className="entries-panel-controls">
                <StatsPanel entries={entries} />
                <div className="search-box">
                  <label htmlFor="search">Search Logs</label>
                  <input
                    id="search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by title, content, or date"
                    aria-label="Search journals by title, content, or date"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <p className="message">Loading your logs…</p>
              </div>
            ) : (
              <div className="entry-scroll">
                <LogList entries={filteredEntries} onDelete={handleDelete} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
