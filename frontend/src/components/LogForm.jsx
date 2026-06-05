import { useEffect, useState, useRef } from "react";
import { moodOptions, normalizeTags } from "../utils/journal";

const LogForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("thoughtful");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const saveTimer = useRef(null);

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

  // Basic markdown -> HTML (very lightweight, safe-ish for small preview)
  const markdownToHtml = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // headings
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    // bold
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    // italic
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    // line breaks
    html = html.replace(/\n/g, "<br />");
    return html;
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

  // Autosave draft to localStorage (debounced)
  useEffect(() => {
    const draft = { title, content, mood, tags };
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem("mindvault_draft", JSON.stringify(draft));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 1200);
      } catch (e) {
        // ignore
      }
    }, 600);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, content, mood, tags]);

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mindvault_draft");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.title) setTitle(d.title);
        if (d.content) setContent(d.content);
        if (d.mood) setMood(d.mood);
        if (d.tags) setTags(d.tags);
      }
    } catch (e) {
      // ignore
    }
  }, []);


return (
  <div className="card create-form-card">
    <div className="form-header">
      <h2>Create New Log</h2>
      {draftSaved && <span className="draft-badge">Draft saved</span>}
    </div>

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

      <div className="form-group mood-group">
        <label>How are you feeling today?</label>

        <div className="mood-row">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`mood-option ${
                mood === option.value ? "selected" : ""
              }`}
              onClick={() => setMood(option.value)}
            >
              <span className="mood-emoji">{option.emoji}</span>
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
            placeholder="Add tags..."
          />
        </div>
      </div>

      <div className="form-actions-row compact">
        <button
          type="button"
          className="secondary"
          onClick={() => setPreview((p) => !p)}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="content">Daily Writing</label>

        {preview ? (
          <div
            className="markdown-preview card"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(content),
            }}
          />
        ) : (
          <textarea
            id="content"
            rows="5"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your thoughts calmly..."
          />
        )}
      </div>

      <button type="submit" className="save-btn">
        Save Log
      </button>
    </form>
  </div>
);
};

export default LogForm;
