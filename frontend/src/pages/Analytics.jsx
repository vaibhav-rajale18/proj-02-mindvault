import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { useEntries } from "../hooks/useEntries";
import { moodMap } from "../utils/journal";

const Analytics = () => {
  const { entries, loading, error } = useEntries();

  const stats = useMemo(() => {
    const totalWords = entries.reduce((sum, entry) => {
      return (
        sum +
        String(entry.content || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      );
    }, 0);

    const moodCount = entries.reduce((acc, entry) => {
      const mood = entry.mood || "thoughtful";
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];

    const monthCount = entries.reduce((acc, entry) => {
      const dt = new Date(entry.createdAt);
      const month = dt.toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const topMonth = Object.entries(monthCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalJournals: entries.length,
      totalWords,
      topMood: topMood ? moodMap[topMood[0]]?.label || topMood[0] : "—",
      topMonth: topMonth ? topMonth[0] : "—",
      moodCount,
      monthCount,
    };
  }, [entries]);

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <Sidebar entries={entries} />
        <div className="container dashboard-shell">
          {error && <p className="error page-error">{error}</p>}
          <div className="page-content">
            <section className="page-panel">
              <p className="eyebrow">Analytics</p>
              <h1>Journal insights</h1>
              <p className="panel-copy">
                See your writing progress, top mood, and your most active months
                at a glance.
              </p>
            </section>

            <section className="page-grid">
              <div className="overview-card">
                <h3>Total Journals</h3>
                <p>{stats.totalJournals}</p>
              </div>
              <div className="overview-card">
                <h3>Total Words</h3>
                <p>{stats.totalWords}</p>
              </div>
              <div className="overview-card">
                <h3>Most Used Mood</h3>
                <p>{stats.topMood}</p>
              </div>
              <div className="overview-card">
                <h3>Top Month</h3>
                <p>{stats.topMonth}</p>
              </div>
            </section>

            <section className="page-panel">
              {loading ? (
                <div className="empty-state">
                  <p className="message">Loading analytics…</p>
                </div>
              ) : (
                <div className="overview-card">
                  <h3>Mood Breakdown</h3>
                  {Object.entries(stats.moodCount).length === 0 ? (
                    <p className="message">No mood data available yet.</p>
                  ) : (
                    Object.entries(stats.moodCount).map(([mood, count]) => (
                      <div className="summary-row" key={mood}>
                        <strong>{moodMap[mood]?.label || mood}</strong>
                        <span>{count} entries</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
