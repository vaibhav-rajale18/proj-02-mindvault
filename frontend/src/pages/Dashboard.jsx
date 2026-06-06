import { useMemo, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import LogForm from "../components/LogForm";
import LogList from "../components/LogList";
import Streak from "../components/Streak";
import StatsPanel from "../components/StatsPanel";
import { moodMap } from "../utils/journal";
import { useEntries } from "../hooks/useEntries";
import { formatCreatedAt, formatDateOnly } from "../utils/date";

const Dashboard = () => {
  const userName = localStorage.getItem("mindvault_username") || "Writer";
  const [searchQuery, setSearchQuery] = useState("");
  const { entries, loading, error, setError, setEntries } = useEntries();

  const streakInfo = useMemo(() => {
    if (!entries.length) return { current: 0, longest: 0 };
    const dates = Array.from(
      new Set(entries.map((entry) => entry.createdAt.split("T")[0])),
    ).sort();
    const dateSet = new Set(dates);
    let current = 0;
    const today = new Date();
    let cursor = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    while (dateSet.has(cursor.toISOString().split("T")[0])) {
      current += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    let longest = 0;
    let streak = 0;
    let prev = null;
    for (const day of dates) {
      if (!prev) {
        streak = 1;
      } else {
        const prevDate = new Date(`${prev}T00:00:00Z`);
        const currentDate = new Date(`${day}T00:00:00Z`);
        const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
        streak = diff === 1 ? streak + 1 : 1;
      }
      longest = Math.max(longest, streak);
      prev = day;
    }
    return { current, longest };
  }, [entries]);

  const dashboardStats = useMemo(() => {
    const total = entries.length;
    const totalWords = entries.reduce((sum, entry) => {
      return (
        sum +
        String(entry.content || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean).length
      );
    }, 0);

    const moodCounts = entries.reduce((acc, entry) => {
      const mood = entry.mood || "thoughtful";
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    const topMoodEntry = Object.entries(moodCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const topMood = topMoodEntry
      ? moodMap[topMoodEntry[0]]?.label || topMoodEntry[0]
      : "Calm";

    return {
      currentStreak: streakInfo.current,
      total,
      totalWords,
      topMood,
    };
  }, [entries, streakInfo]);

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
        window.location.href = "/login";
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
          <section className="dashboard-hero card">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">Welcome back</p>
              <h1 className="hero-heading">
                Good evening, {userName} <span className="wave-emoji">👋</span>
              </h1>
              <p className="hero-subtitle">
                Let’s capture your thoughts and reflect on your day.
              </p>
            </div>
          </section>

          <section className="dashboard-stats-row">
            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-icon">🔥</span>
                <span className="stat-card-label">Current Streak</span>
              </div>
              <div className="stat-card-value">
                {dashboardStats.currentStreak} Days
              </div>
              <p className="stat-card-note">
                Keep it going with daily reflections.
              </p>
            </article>
            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-icon">📝</span>
                <span className="stat-card-label">Total Journals</span>
              </div>
              <div className="stat-card-value">{dashboardStats.total}</div>
              <p className="stat-card-note">Keep writing and keep growing.</p>
            </article>
            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-icon">✍️</span>
                <span className="stat-card-label">Total Words</span>
              </div>
              <div className="stat-card-value">{dashboardStats.totalWords}</div>
              <p className="stat-card-note">Great expression! ✨</p>
            </article>
            <article className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-icon">😊</span>
                <span className="stat-card-label">Top Mood</span>
              </div>
              <div className="stat-card-value">{dashboardStats.topMood}</div>
              <p className="stat-card-note">This month</p>
            </article>
          </section>

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
                <button className="secondary view-all-btn" type="button">
                  View all →
                </button>
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
    </div>
  );
};

export default Dashboard;
