import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

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
  const [saving, setSaving] = useState(false);

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
      } catch (fetchError) {
        handleAuthError(fetchError);
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id, navigate, token]);

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

  return (
    <div className="details-page">
      <Navbar />
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
                Back to Journal
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
                <p className="eyebrow">Journal entry</p>
                <h2>{entry.title}</h2>
                <p className="entry-date detail-date">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
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
                    rows="12"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
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
  );
};

export default LogDetails;
