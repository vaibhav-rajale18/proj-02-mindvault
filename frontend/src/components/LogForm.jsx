import { useState } from "react";
import { moodOptions, normalizeTags } from "../utils/journal";

const LogForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("thoughtful");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const addTags = (raw) => {
    const values = String(raw)
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const next = normalizeTags([...tags, ...values]);
    setTags(next);
    setTagInput("");
  };

  const handleTagInputChange = (event) => {
    const value = event.target.value;
    if (value.includes(",")) {
      const next = normalizeTags([
        ...tags,
        ...value
          .split(/[,\s]+/)
          .map((item) => item.trim())
          .filter(Boolean),
      ]);
      setTags(next);
      setTagInput("");
      return;
    }

    setTagInput(value);
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const next = tagInput.trim();
      if (next) addTags(next);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((currentTags) =>
      currentTags.filter(
        (item) => item.toLowerCase() !== tagToRemove.toLowerCase(),
      ),
    );
  };

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
      tags,
    });
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
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
          <div className="tag-input-block">
            <div className="tag-chip-row">
              {tags.map((tag) => (
                <span className="tag tag-chip" key={tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              aria-describedby="tags-help"
            />
          </div>
          <p id="tags-help" className="field-note">
            Add tags like #Goals or #Ideas, then press Enter.
          </p>
        </div>

        <button type="submit">Save Log</button>
      </form>
    </div>
  );
};

export default LogForm;
