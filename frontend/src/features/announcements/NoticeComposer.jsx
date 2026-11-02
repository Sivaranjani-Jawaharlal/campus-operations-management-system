import { useState } from "react";
import { Globe2, Megaphone, Pencil, Target } from "lucide-react";
import Dialog from "../../components/ui/Dialog";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { TextAreaField, TextField } from "../../components/ui/Field";

const MAX_CONTENT = 2000;

function describeAudience(dept, year) {
  const d = dept.trim();
  const y = year.trim();
  if (!d && !y) return { targeted: false, text: "Visible to every department and every academic year." };
  if (d && y) return { targeted: true, text: `Visible only to ${d} students in year ${y}.` };
  if (d) return { targeted: true, text: `Visible only to ${d} students, in any year.` };
  return { targeted: true, text: `Visible only to year ${y} students, in any department.` };
}

// Create / edit dialog. Mounted fresh each time it opens (parent keys it), so form state
// always starts from the notice being edited — no reset effects needed.
export default function NoticeComposer({ open, notice, suggestions, onClose, onSubmit }) {
  const editing = Boolean(notice);
  const [title, setTitle] = useState(notice?.title ?? "");
  const [content, setContent] = useState(notice?.content ?? "");
  const [dept, setDept] = useState(notice?.targetDepartment ?? "");
  const [year, setYear] = useState(notice?.targetAcademicYear ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const audience = describeAudience(dept, year);
  const AudienceIcon = audience.targeted ? Target : Globe2;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit({ title, content, targetDepartment: dept, targetAcademicYear: year });
    } catch (err) {
      setError(err.message || "Couldn't save the announcement.");
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      wide
      busy={busy}
      icon={editing ? Pencil : Megaphone}
      title={editing ? "Edit announcement" : "New announcement"}
      description={editing ? "Changes are visible to the audience straight away." : "Publish a notice to students and colleagues. Leave the audience blank to reach everyone."}
    >
      <form className="stack" onSubmit={submit} id="notice-form">
        {error && <Alert tone="error">{error}</Alert>}
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} placeholder="e.g. Library hours extended for exams" />
        <TextAreaField
          label="Message"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
          required
          rows={6}
          placeholder="Write the details people need to act on this."
          counter={
            <span className="counter" data-warn={content.length > MAX_CONTENT * 0.9} style={{ justifySelf: "end" }}>
              {content.length} / {MAX_CONTENT}
            </span>
          }
        />
        <div className="field-row">
          <TextField label="Department" optional value={dept} onChange={(e) => setDept(e.target.value)} suggestions={suggestions.departments} placeholder="All departments" />
          <TextField label="Academic year" optional value={year} onChange={(e) => setYear(e.target.value)} suggestions={suggestions.years} placeholder="All years" />
        </div>
        <div className={`audience ${audience.targeted ? "audience--targeted" : ""}`} aria-live="polite">
          <AudienceIcon size={18} aria-hidden="true" />
          <span>{audience.text}</span>
        </div>
        <div className="cluster" style={{ justifyContent: "flex-end", marginTop: "var(--s-2)" }}>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={busy} loadingText={editing ? "Saving…" : "Publishing…"}>
            {editing ? "Save changes" : "Publish"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
