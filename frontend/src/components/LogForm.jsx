import { useState } from "react";
import { moodOptions, normalizeTags } from "../utils/journal";

const LogForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("thoughtful");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please add both a title and your reflection.");
      return;
    }

    setError("");
    await onSave({
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: normalizeTags(tagsInput),
    });
    setTitle("");
    setContent("");
    setTagsInput("");
    setMood("thoughtful");
  };

  return (
    <div className="card create-form-card">
      <h2>Create New Log</h2>
      {error && <p className="error">{error}</p>}
      <form className="create-form" onSubmit={handleSubmit}>
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

        <div className="form-group mood-group">
          <label>How are you feeling?</label>
          <div className="mood-row">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`mood-option ${mood === option.value ? "selected" : ""}`}
                onClick={() => setMood(option.value)}
              >
                <span className="mood-emoji">{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="#Goals, #Coding, #Ideas"
            aria-describedby="tags-help"
          />
          <p id="tags-help" className="field-note">
            Add one or more tags separated by commas or spaces.
          </p>
        </div>

        <button type="submit">Save Log</button>
      </form>
    </div>
  );
};

export default LogForm;
