import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, FileUp, Upload, X } from "lucide-react";
import { uploadEligibleStudentsCsv } from "../../api/admin";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useToast } from "../../hooks/useToast";
import { formatBytes, plural } from "../../utils/format";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import Panel from "../../components/ui/Panel";

const COLUMNS = ["rollNumber", "name", "email", "dateOfBirth", "department", "academicYear"];
const MAX_BYTES = 5 * 1024 * 1024; // matches spring.servlet.multipart.max-file-size

const COLUMN_NOTES = [
  ["rollNumber", "Unique per student. Used at sign-up."],
  ["name", "Full name."],
  ["email", "Where their verification code is sent."],
  ["dateOfBirth", "yyyy-MM-dd, e.g. 2005-08-14."],
  ["department", "Must match how you'll target announcements."],
  ["academicYear", "e.g. 1, 2, 3 or 4."],
];

// Reads the file in the browser to give instant feedback before anything is sent.
async function inspect(file) {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  const header = (lines[0] || "").split(",").map((c) => c.trim());
  const body = lines.slice(1).filter((l) => l.trim());
  const headerOk = COLUMNS.every((c, i) => header[i] === c);
  return { header, headerOk, rows: body.length, preview: body.slice(0, 5).map((l) => l.split(",").map((c) => c.trim())) };
}

export const RosterPage = () => {
  useDocumentTitle("Student roster");
  const toast = useToast();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const choose = async (f) => {
    setResult(null);
    setError("");
    setInfo(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!/\.csv$/i.test(f.name)) {
      setFile(null);
      setError("That doesn't look like a CSV file. Choose a .csv file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setFile(null);
      setError(`That file is ${formatBytes(f.size)}. The limit is 5 MB.`);
      return;
    }
    setFile(f);
    try {
      setInfo(await inspect(f));
    } catch {
      setInfo(null);
    }
  };

  const clear = () => {
    setFile(null);
    setInfo(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a CSV file first.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await uploadEligibleStudentsCsv(file);
      setResult(res);
      toast.success(`Roster uploaded — ${plural(res.created, "student")} added.`);
      clear();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([`${COLUMNS.join(",")}\n`], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "eligible-students-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        number="04"
        title="Student roster"
        description="Students can only register if they appear on this list. Upload a CSV and each person can then sign up with their roll number and date of birth."
        actions={
          <Button icon={Download} onClick={downloadTemplate}>
            Download template
          </Button>
        }
      />

      <div className="two-col">
        <Panel icon={FileUp} title="Upload a CSV" description="Existing roll numbers are skipped, so it's safe to re-upload an updated list.">
          <form className="stack" onSubmit={handleUpload}>
            {error && <Alert tone="error">{error}</Alert>}

            {!file ? (
              <label
                className="dropzone"
                data-drag={drag}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  choose(e.dataTransfer.files?.[0]);
                }}
              >
                <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={(e) => choose(e.target.files?.[0])} />
                <span className="dropzone__icon">
                  <Upload size={22} aria-hidden="true" />
                </span>
                <span className="dropzone__title">Drop a CSV here, or browse</span>
                <span className="dropzone__sub">Up to 5 MB · six columns</span>
              </label>
            ) : (
              <div className="stack">
                <div className="filechip">
                  <FileSpreadsheet size={22} aria-hidden="true" style={{ color: "var(--brand-text)", flex: "none" }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="filechip__name">{file.name}</div>
                    <div className="filechip__meta">
                      {formatBytes(file.size)}
                      {info && ` · ${plural(info.rows, "row")}`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" iconOnly onClick={clear} disabled={loading}>
                    <X size={16} aria-hidden="true" />
                    Remove file
                  </Button>
                </div>

                {info && !info.headerOk && (
                  <Alert tone="warning" title="Check the column order">
                    The first row should read <code>{COLUMNS.join(",")}</code>. Columns are matched by position, so a different order would put values in the wrong fields.
                  </Alert>
                )}
                {info && info.rows === 0 && <Alert tone="warning">This file has a header but no student rows.</Alert>}

                {info && info.preview.length > 0 && (
                  <div>
                    <p className="eyebrow" style={{ marginBottom: "var(--s-2)" }}>
                      Preview · first {info.preview.length}
                    </p>
                    <div className="csv-preview">
                      <table>
                        <thead>
                          <tr>
                            {COLUMNS.map((c) => (
                              <th key={c}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {info.preview.map((row, i) => (
                            <tr key={i}>
                              {COLUMNS.map((c, j) => (
                                <td key={c}>{row[j] ?? ""}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <Button type="submit" variant="primary" icon={Upload} loading={loading} loadingText="Uploading…" disabled={!file}>
                Upload roster
              </Button>
            </div>
          </form>
        </Panel>

        <div className="stack stack--lg">
          {result && (
            <Panel
              icon={CheckCircle2}
              title="Upload complete"
              description={result.rowErrors?.length ? "Some rows need attention — everything else was imported." : "Every row was processed."}
            >
              <div className="stack">
                <div className="result-grid">
                  <div className="result-cell">
                    <div className="result-cell__num" style={{ color: "var(--success-text)" }}>{result.created}</div>
                    <div className="result-cell__label">Added</div>
                  </div>
                  <div className="result-cell">
                    <div className="result-cell__num">{result.skippedDuplicates}</div>
                    <div className="result-cell__label">Already on roster</div>
                  </div>
                  <div className="result-cell">
                    <div className="result-cell__num" style={{ color: result.rowErrors?.length ? "var(--danger-text)" : undefined }}>{result.rowErrors?.length ?? 0}</div>
                    <div className="result-cell__label">Row errors</div>
                  </div>
                </div>
                {result.rowErrors?.length > 0 && (
                  <div>
                    <p className="eyebrow" style={{ marginBottom: "var(--s-2)", color: "var(--danger-text)" }}>
                      <AlertTriangle size={13} aria-hidden="true" /> Rows skipped
                    </p>
                    <ul className="error-list">
                      {result.rowErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Panel>
          )}

          <Panel title="File format" description="One student per row, with this header in the first line.">
            <dl className="kv">
              {COLUMN_NOTES.map(([name, note]) => (
                <div key={name} style={{ display: "contents" }}>
                  <dt>
                    <code>{name}</code>
                  </dt>
                  <dd className="muted" style={{ fontWeight: 400 }}>
                    {note}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
};
