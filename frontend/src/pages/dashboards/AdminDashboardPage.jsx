import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { createInvitation, uploadEligibleStudentsCsv } from "../../api/admin";

const INVITABLE_ROLES = ["STAFF", "LAB_ASSISTANT", "ADMIN"];

export const AdminDashboardPage = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(INVITABLE_ROLES[0]);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus(null);
    setInviteLoading(true);
    try {
      await createInvitation({ email: inviteEmail, role: inviteRole });
      setInviteStatus({ type: "success", message: `Invitation sent to ${inviteEmail}.` });
      setInviteEmail("");
    } catch (err) {
      setInviteStatus({ type: "error", message: err.message });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError("");
    setUploadResult(null);
    if (!csvFile) {
      setUploadError("Choose a CSV file first.");
      return;
    }
    setUploadLoading(true);
    try {
      const result = await uploadEligibleStudentsCsv(csvFile);
      setUploadResult(result);
      setCsvFile(null);
      e.target.reset();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <DashboardShell title="Admin Dashboard">
      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>Invite a Staff / Lab Assistant / Admin</h2>
        <p style={{ color: "#666", fontSize: 14 }}>
          Students self-register with a roll number — they're never invited from here.
        </p>
        {inviteStatus && (
          <div style={inviteStatus.type === "success" ? successBox : errorBox}>
            {inviteStatus.message}
          </div>
        )}
        <form onSubmit={handleInvite} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input type="email" placeholder="person@example.com" value={inviteEmail}
                 onChange={(e) => setInviteEmail(e.target.value)} required
                 style={{ flex: 1, minWidth: 220, padding: 10, borderRadius: 4, border: "1px solid #ccc" }} />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  style={{ padding: 10, borderRadius: 4, border: "1px solid #ccc" }}>
            {INVITABLE_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <button type="submit" disabled={inviteLoading}>
            {inviteLoading ? "Sending..." : "Send Invite"}
          </button>
        </form>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0 }}>Upload Eligible Students (CSV)</h2>
        <p style={{ color: "#666", fontSize: 14 }}>
          Header row: <code>rollNumber,name,email,dateOfBirth,department,academicYear</code>{" "}
          (date as <code>yyyy-MM-dd</code>).
        </p>
        {uploadError && <div style={errorBox}>{uploadError}</div>}
        {uploadResult && (
          <div style={successBox}>
            Created: {uploadResult.created} · Skipped duplicates: {uploadResult.skippedDuplicates}
            {uploadResult.rowErrors?.length > 0 && (
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                {uploadResult.rowErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>
        )}
        <form onSubmit={handleUpload} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
          <button type="submit" disabled={uploadLoading}>
            {uploadLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </section>
    </DashboardShell>
  );
};

const sectionStyle = { marginBottom: 30, padding: 20, border: "1px solid #eee", borderRadius: 8 };
const successBox = { color: "green", backgroundColor: "#f0fff0", border: "1px solid green", borderRadius: 4, padding: 10, marginBottom: 10 };
const errorBox = { color: "red", backgroundColor: "#fff0f0", border: "1px solid red", borderRadius: 4, padding: 10, marginBottom: 10 };