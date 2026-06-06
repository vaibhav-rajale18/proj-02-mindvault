import { useMemo, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import LogList from "../components/LogList";
import StatsPanel from "../components/StatsPanel";
import { useEntries } from "../hooks/useEntries";

const Journals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { entries, loading, error, setEntries, setError } = useEntries();

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) => {
      const title = (entry.title || "").toLowerCase();
      const content = (entry.content || "").toLowerCase();
      const tags = (entry.tags || []).join(" ").toLowerCase();
      return (
        title.includes(query) || content.includes(query) || tags.includes(query)
      );
    });
  }, [entries, searchQuery]);

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
        window.location.href = "/login";
      } else {
        setError("Unable to delete log. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <Sidebar entries={entries} />
        <div className="container dashboard-shell">
          {error && <p className="error page-error">{error}</p>}
          <div className="page-content">
            <section className="page-panel">
              <p className="eyebrow">My Journals</p>
              <h1>All entries</h1>
              <p className="panel-copy">
                Browse every journal entry, search by title or tag, and delete
                logs when needed.
              </p>
              <div className="search-box">
                <label htmlFor="journal-search">Search entries</label>
                <input
                  id="journal-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title, content, or tag"
                />
              </div>
            </section>

            <section className="page-panel">
              <StatsPanel entries={entries} />
            </section>

            <section className="page-panel">
              {loading ? (
                <div className="empty-state">
                  <p className="message">Loading your journals…</p>
                </div>
              ) : (
                <LogList entries={filteredEntries} onDelete={handleDelete} />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journals;
