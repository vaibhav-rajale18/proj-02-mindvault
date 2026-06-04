import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const LogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const response = await api.get(`/entries/${id}`);
        setEntry(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (fetchError) {
        setError("Unable to load this entry. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id]);

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
      });
      setEntry(response.data);
      setEditMode(false);
    } catch (saveError) {
      setError("Unable to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/entries/${id}`);
      navigate("/dashboard");
    } catch (deleteError) {
      setError("Unable to delete entry. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-card card">
        <Navbar />
        {loading ? (
          <div className="empty-state">
            <p className="message">Loading entry...</p>
          </div>
        ) : entry ? (
          <div>
            {error && <p className="error">{error}</p>}
            <div className="entry-details-header">
              <div>
                <p className="eyebrow">Journal entry</p>
                <h2>{entry.title}</h2>
                <p className="entry-date">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
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
                  <textarea
                    id="detail-content"
                    rows="10"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </div>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            ) : (
              <div className="entry-body">
                <p className="entry-content">{entry.content}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p className="message">Entry not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogDetails;
