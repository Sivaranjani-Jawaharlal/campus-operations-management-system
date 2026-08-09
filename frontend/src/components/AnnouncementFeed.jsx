import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../api/announcements";

// canManage: true for STAFF/ADMIN -- shows the create form and edit/delete
// controls. Students (and Lab Assistant, for now) get a plain read-only feed.
// This prop only controls which UI controls render, it does NOT re-check
// permissions; the backend still rejects a write from a role that shouldn't
// have one.
export default function AnnouncementFeed({ canManage = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetDepartment, setTargetDepartment] = useState("");
  const [targetAcademicYear, setTargetAcademicYear] = useState("");
  const [posting, setPosting] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();

        if (!ignore) {
          setAnnouncements(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      ignore = true;
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTargetDepartment("");
    setTargetAcademicYear("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPosting(true);
    const dto = { title, content, targetDepartment, targetAcademicYear };
    try {
      if (editingId) {
        await updateAnnouncement(editingId, dto);
      } else {
        await createAnnouncement(dto);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setTitle(a.title);
    setContent(a.content);
    setTargetDepartment(a.targetDepartment || "");
    setTargetAcademicYear(a.targetAcademicYear || "");
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {canManage && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 24,
            padding: 16,
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Edit Announcement" : "Post Announcement"}
          </h3>
          {error && (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          )}
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Target department (blank = everyone)"
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value)}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <input
              placeholder="Target academic year (blank = everyone)"
              value={targetAcademicYear}
              onChange={(e) => setTargetAcademicYear(e.target.value)}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button type="submit" disabled={posting}>
            {posting ? "Saving..." : editingId ? "Save Changes" : "Post"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          )}
        </form>
      )}

      {!canManage && error && (
        <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
      )}

      {loading ? (
        <p>Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p style={{ color: "#888" }}>No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            style={{ padding: 12, borderBottom: "1px solid #eee" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <strong>{a.title}</strong>
              <span style={{ fontSize: 12, color: "#888" }}>
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </div>
            <p style={{ margin: "4px 0" }}>{a.content}</p>
            <div style={{ fontSize: 12, color: "#888" }}>
              {a.targetDepartment || "All departments"} ·{" "}
              {a.targetAcademicYear || "All years"} · by {a.createdByEmail}
            </div>
            {canManage && (
              <div style={{ marginTop: 6 }}>
                <button onClick={() => startEdit(a)}>Edit</button>
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
