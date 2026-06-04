import { useState } from "react";

const LogForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please add both title and content.");
      return;
    }

    setError("");
    await onSave({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
  };

  return (
    <div className="card">
      <h2>Create New Log</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Today I..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Daily Writing</label>
          <textarea
            id="content"
            rows="6"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Capture your thoughts and memories."
          />
        </div>
        <button type="submit">Save Log</button>
      </form>
    </div>
  );
};

export default LogForm;
