import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LogForm from "../components/LogForm";
import LogList from "../components/LogList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
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

        const trimmed = searchQuery.trim();

        let response;
        if (!trimmed) {
          response = await api.get("/entries");
        } else {
          response = await api.get(
            `/entries/search?q=${encodeURIComponent(trimmed)}`,
          );
        }

        if (mounted) {
          setEntries(response.data);
        }
      } catch (loadError) {
        handleAuthError(loadError);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchEntries, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [navigate, token, searchQuery]);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
      );
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
              <div>
                <p className="eyebrow">My Journals</p>
                <h2>Recent entries</h2>
              </div>
              <div className="search-box">
                <label htmlFor="search">Search Logs</label>
                <input
                  id="search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title or text"
                />
                <div
                  className="date-search"
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <input
                    aria-label="Filter by date"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{ padding: "6px 8px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setSearchQuery(dateFilter)}
                    className="secondary"
                    disabled={!dateFilter}
                  >
                    Search by date
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilter("");
                      setSearchQuery("");
                    }}
                    className="tertiary"
                  >
                    Clear
                  </button>
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
