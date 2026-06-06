import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { useEntries } from "../hooks/useEntries";
import { normalizeTags } from "../utils/journal";

const Tags = () => {
  const { entries, loading, error } = useEntries();

  const tags = useMemo(() => {
    const count = {};

    entries.forEach((entry) => {
      normalizeTags(entry.tags).forEach((tag) => {
        count[tag] = (count[tag] || 0) + 1;
      });
    });

    return Object.entries(count).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <Sidebar entries={entries} />
        <div className="container dashboard-shell">
          {error && <p className="error page-error">{error}</p>}
          <div className="page-content">
            <section className="page-panel">
              <p className="eyebrow">Tags</p>
              <h1>Tag insights</h1>
              <p className="panel-copy">
                Review the tags you use most, and quickly find logs organized by
                topic.
              </p>
            </section>

            <section className="page-panel">
              {loading ? (
                <div className="empty-state">
                  <p className="message">Loading tag data…</p>
                </div>
              ) : tags.length === 0 ? (
                <div className="empty-state">
                  <p className="message">No tags have been added yet.</p>
                </div>
              ) : (
                tags.map(([tag, count]) => (
                  <div className="summary-row" key={tag}>
                    <strong>{tag}</strong>
                    <span>
                      {count} entry{count !== 1 ? "ies" : ""}
                    </span>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tags;
