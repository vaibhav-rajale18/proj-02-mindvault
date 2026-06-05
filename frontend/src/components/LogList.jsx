import { useNavigate } from "react-router-dom";
import { formatCreatedAt } from "../utils/date";
import { moodMap, normalizeTags } from "../utils/journal";

const LogList = ({ entries, onDelete }) => {
  const navigate = useNavigate();

  if (!entries.length) {
    return (
      <div className="card">
        <p className="message">
          No logs found yet. Add your first entry above.
        </p>
      </div>
    );
  }

  return (
    <div className="log-list">
      {entries.map((entry) => {
        const mood = moodMap[entry.mood] || moodMap.thoughtful;
        const tags = normalizeTags(entry.tags);

        return (
          <div
            className="log-card clickable"
            key={entry._id}
            onClick={() => navigate(`/log/${entry._id}`)}
          >
            <div className="log-card-header">
              <div>
                <div className="log-card-topline">
                  <span className="entry-date">
                    {formatCreatedAt(entry.createdAt)}
                  </span>
                  <span className="tag mood-pill">
                    <span className="mood-emoji">{mood.emoji}</span>
                    {mood.label}
                  </span>
                </div>
                <h3>{entry.title}</h3>
              </div>
              <div className="actions">
                <button
                  className="danger"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(entry._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="log-card-preview">{entry.content}</p>

            {tags.length > 0 && (
              <div className="tag-list card-tag-list">
                {tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LogList;
