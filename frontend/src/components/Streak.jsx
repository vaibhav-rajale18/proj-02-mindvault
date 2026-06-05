import React from "react";

const toDateKey = (d) => {
  const dt = new Date(d);
  return dt.toISOString().split("T")[0];
};

const computeStreaks = (entries) => {
  if (!entries || !entries.length) return { current: 0, longest: 0 };
  const dates = Array.from(
    new Set(entries.map((e) => toDateKey(e.createdAt))),
  ).sort();
  // build set for quick lookup
  const dateSet = new Set(dates);

  // current streak
  let current = 0;
  const today = new Date();
  let cursor = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (dateSet.has(key)) {
      current += 1;
      // move back one day
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    } else {
      break;
    }
  }

  // longest streak
  let longest = 0;
  let streak = 0;
  let prev = null;
  for (const d of dates) {
    if (!prev) {
      streak = 1;
    } else {
      const prevDate = new Date(prev + "T00:00:00Z");
      const curDate = new Date(d + "T00:00:00Z");
      const diff = (curDate - prevDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak += 1;
      } else {
        streak = 1;
      }
    }
    if (streak > longest) longest = streak;
    prev = d;
  }

  return { current, longest };
};

const Streak = ({ entries }) => {
  const { current, longest } = computeStreaks(entries);

  return (
    <div className="streak">
      <span className="streak-emoji">🔥</span>
      <div>
        <div className="streak-current">
          {current} Day{current !== 1 ? "s" : ""} Streak
        </div>
        <div className="streak-longest">
          Longest: {longest} Day{longest !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};

export default Streak;
