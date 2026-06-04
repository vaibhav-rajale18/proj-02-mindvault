const LogList = ({ entries, onDelete }) => {
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
    <div>
      {entries.map((entry) => (
        <div className="card" key={entry._id}>
          <div className="entry-date">
            {new Date(entry.createdAt).toLocaleString()}
          </div>
          <h3>{entry.title}</h3>
          <p className="entry-content">{entry.content}</p>
          <div className="actions">
            <button className="danger" onClick={() => onDelete(entry._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogList;
