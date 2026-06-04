import { useNavigate } from "react-router-dom";

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
      {entries.map((entry) => (
        <div
          className="log-card clickable"
          key={entry._id}
          onClick={() => navigate(`/log/${entry._id}`)}
        >
          <div className="entry-date">
            {new Date(entry.createdAt).toLocaleString()}
          </div>
          <h3>{entry.title}</h3>
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
      ))}
    </div>
  );
};

export default LogList;
