import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { useEntries } from "../hooks/useEntries";

const Calendar = () => {
  const { entries, loading, error } = useEntries();

  const days = useMemo(() => {
    const counts = entries.reduce((acc, entry) => {
      const dt = new Date(entry.createdAt);
      const isoKey = dt.toISOString().split("T")[0];
      const label = dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (!acc[isoKey]) {
        acc[isoKey] = { label, count: 0 };
      }
      acc[isoKey].count += 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(([isoKey, details]) => [details.label, details.count]);
  }, [entries]);

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <Sidebar entries={entries} />
        <div className="container dashboard-shell">
          {error && <p className="error page-error">{error}</p>}
          <div className="page-content">
            <section className="page-panel">
              <p className="eyebrow">Calendar</p>
              <h1>Entry timeline</h1>
              <p className="panel-copy">
                Track your writing rhythm by date. Each day shows how many
                entries you created.
              </p>
            </section>

            <section className="page-panel">
              {loading ? (
                <div className="empty-state">
                  <p className="message">Loading calendar data…</p>
                </div>
              ) : days.length === 0 ? (
                <div className="empty-state">
                  <p className="message">
                    No entries to show on the calendar yet.
                  </p>
                </div>
              ) : (
                days.map(([date, count]) => (
                  <div className="summary-row" key={date}>
                    <strong>{date}</strong>
                    <span>
                      {count} log{count !== 1 ? "s" : ""}
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

export default Calendar;
