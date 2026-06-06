import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { useEntries } from "../hooks/useEntries";
import { moodMap } from "../utils/journal";

const MoodStats = () => {
  const { entries, loading, error } = useEntries();

  const moodCounts = useMemo(() => {
    const counts = {};
    entries.forEach((entry) => {
      const mood = entry.mood || "thoughtful";
      counts[mood] = (counts[mood] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <div className="dashboard-page">
      <div className="app-shell">
        <Sidebar entries={entries} />
        <div className="container dashboard-shell">
          {error && <p className="error page-error">{error}</p>}
          <div className="page-content">
            <section className="page-panel">
              <p className="eyebrow">Mood Stats</p>
              <h1>Emotion trends</h1>
              <p className="panel-copy">
                See how your moods evolve over time with a count of entries for
                each state.
              </p>
            </section>

            <section className="page-panel">
              {loading ? (
                <div className="empty-state">
                  <p className="message">Loading mood stats…</p>
                </div>
              ) : moodCounts.length === 0 ? (
                <div className="empty-state">
                  <p className="message">No mood data available yet.</p>
                </div>
              ) : (
                moodCounts.map(([mood, count]) => (
                  <div className="summary-row" key={mood}>
                    <strong>
                      {moodMap[mood]?.emoji || "🙂"}{" "}
                      {moodMap[mood]?.label || mood}
                    </strong>
                    <span>
                      {count} entry{count !== 1 ? "s" : ""}
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

export default MoodStats;
