import React, { useMemo } from "react";

const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

const StatsPanel = ({ entries }) => {
  const stats = useMemo(() => {
    const total = entries.length;
    const totalWords = entries.reduce((sum, e) => {
      const words = (e.content || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      return sum + words;
    }, 0);

    const moodCounts = entries.reduce((acc, e) => {
      const m = e.mood || "thoughtful";
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {});
    const mostUsedMood = Object.entries(moodCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    const monthCounts = entries.reduce((acc, e) => {
      const k = monthKey(e.createdAt);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
    const mostActiveMonth = Object.entries(monthCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      total,
      totalWords,
      mostUsedMood: mostUsedMood ? mostUsedMood[0] : null,
      mostActiveMonth: mostActiveMonth ? mostActiveMonth[0] : null,
    };
  }, [entries]);

  return (
    <div className="stats-panel card">
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Journals</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.totalWords}</div>
          <div className="stat-label">Total Words</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.mostUsedMood || "—"}</div>
          <div className="stat-label">Most Used Mood</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.mostActiveMonth || "—"}</div>
          <div className="stat-label">Top Month</div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
