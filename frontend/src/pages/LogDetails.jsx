import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";import { formatCreatedAt } from "../utils/date";
import { moodOptions, moodMap, normalizeTags } from "../utils/journal";

const LogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("mindvault_token");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("thoughtful");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleAuthError = (loadError) => {
    if (
      loadError.response?.status === 401 ||
      loadError.response?.status === 403
    ) {
      localStorage.removeItem("mindvault_token");
      navigate("/login");
      return;
    }

    setError("Unable to load this entry. Please try again.");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadEntry = async () => {
      try {
        const response = await api.get(`/entries/${id}`);
        setEntry(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setMood(response.data.mood || "thoughtful");
        setTags(normalizeTags(response.data.tags));
        setTagInput("");
      } catch (fetchError) {
        handleAuthError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id, navigate, token]);

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

  const handleSave = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await api.put(`/entries/${id}`, {
        title: title.trim(),
        content: content.trim(),
        mood,
        tags,
      });
      setEntry(response.data);
      setEditMode(false);
    } catch (saveError) {
      if (
        saveError.response?.status === 401 ||
        saveError.response?.status === 403
      ) {
        handleAuthError(saveError);
      } else {
        setError("Unable to save changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/entries/${id}`);
      navigate("/dashboard");
    } catch (deleteError) {
      if (
        deleteError.response?.status === 401 ||
        deleteError.response?.status === 403
      ) {
        handleAuthError(deleteError);
      } else {
        setError("Unable to delete entry. Please try again.");
      }
    }
  };

  const activeMood = moodMap[entry?.mood] || moodMap.thoughtful;
  const entryTags = normalizeTags(entry?.tags);

  const markdownToHtml = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    html = html.replace(/\n/g, "<br />");
    return html;
  };

  return (

  <div className="details-page">
    <div className="app-shell">
      <Sidebar />

```
  <div className="container details-shell">
    {loading ? (
      <div className="empty-state">
        <p className="message">Loading entry...</p>
      </div>
    ) : entry ? (
      <div className="details-card card">
        <div className="detail-action-row">
          <button
            className="secondary"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Journal
          </button>

          <div className="detail-actions">
            <button
              className="secondary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>

            <button className="danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="entry-details-header">
          <div>
            <p className="eyebrow">Journal Entry</p>
            <h2>{entry.title}</h2>

            <p className="entry-date detail-date">
              {formatCreatedAt(entry.createdAt)}
            </p>
          </div>

          <span className="tag mood-pill detail-mood">
            <span className="mood-emoji">{activeMood.emoji}</span>
            {activeMood.label}
          </span>
        </div>

        {entryTags.length > 0 && (
          <div className="tag-list detail-tags">
            {entryTags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {editMode ? (
          <form onSubmit={handleSave} className="detail-form">
            <div className="form-group">
              <label htmlFor="detail-title">Title</label>
              <input
                id="detail-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="detail-content">Content</label>

              <div className="form-actions-row">
                <div />

                <div className="preview-toggle">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setPreview((p) => !p)}
                  >
                    {preview ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>

              {preview ? (
                <div
                  className="markdown-preview card"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(content),
                  }}
                />
              ) : (
                <textarea
                  id="detail-content"
                  rows="12"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              )}
            </div>

            <div className="form-group mood-group">
              <label>How are you feeling?</label>

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
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="detail-tags">Tags</label>

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
                  id="detail-tags"
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter"
                  aria-describedby="detail-tags-help"
                />
              </div>

              <p id="detail-tags-help" className="field-note">
                Add tags like #Goals or #Ideas, then press Enter.
              </p>
            </div>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <article className="entry-body detail-body">
            <p className="entry-content">{entry.content}</p>
          </article>
        )}
      </div>
    ) : (
      <div className="empty-state">
        <p className="message">Entry not found.</p>
      </div>
    )}
  </div>
</div>


  </div>


  );
};

export default LogDetails;
