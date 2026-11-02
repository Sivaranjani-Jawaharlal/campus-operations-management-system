import { useState } from "react";
import { CheckCircle2, Clock, Mail, Send, ShieldCheck } from "lucide-react";
import { createInvitation } from "../../api/admin";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useToast } from "../../hooks/useToast";
import { ROLE_LABELS } from "../../utils/roles";
import Alert from "../../components/ui/Alert";
import { RoleBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { SelectField, TextField } from "../../components/ui/Field";
import PageHeader from "../../components/ui/PageHeader";
import Panel from "../../components/ui/Panel";

const INVITABLE_ROLES = ["STAFF", "LAB_ASSISTANT", "ADMIN"];
const ROLE_NOTE = {
  STAFF: "Can publish, edit and delete announcements.",
  LAB_ASSISTANT: "Can read announcements across campus.",
  ADMIN: "Full access: people, rosters, academic year and announcements.",
};

export const InvitationsPage = () => {
  useDocumentTitle("Invitations");
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(INVITABLE_ROLES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState([]); // this session only — the API has no "list invitations" endpoint

  const handleInvite = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createInvitation({ email, role });
      setSent((s) => [{ email, role, at: new Date() }, ...s]);
      toast.success(`Invitation sent to ${email}.`);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        number="03"
        title="Invitations"
        description="Staff, lab assistants and fellow admins join by invitation. Students never appear here — they register themselves with their roll number."
      />

      <div className="two-col">
        <Panel
          icon={Mail}
          title="Invite someone"
          description="They'll receive an email with a link to set their password. The link expires after 72 hours."
        >
          <form className="stack" onSubmit={handleInvite}>
            {error && <Alert tone="error">{error}</Alert>}
            <TextField label="Email address" type="email" icon={Mail} placeholder="name@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" />
            <SelectField label="Role" value={role} onChange={(e) => setRole(e.target.value)} hint={ROLE_NOTE[role]}>
              {INVITABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </SelectField>
            <div>
              <Button type="submit" variant="primary" icon={Send} loading={loading} loadingText="Sending…">
                Send invitation
              </Button>
            </div>
          </form>
        </Panel>

        <Panel icon={Clock} title="Sent this session" description="A running record of the invitations you've sent since opening this page.">
          {sent.length === 0 ? (
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              Nothing sent yet. Invitations you send will be listed here.
            </p>
          ) : (
            <ul className="timeline">
              {sent.map((s, i) => (
                <li className="timeline__item" key={`${s.email}-${s.at.getTime()}-${i}`}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span style={{ overflowWrap: "anywhere" }}>{s.email}</span>
                  <RoleBadge role={s.role} />
                  <span className="timeline__time">{s.at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="field__hint" style={{ marginTop: "var(--s-4)", display: "flex", gap: "var(--s-2)" }}>
            <ShieldCheck size={14} aria-hidden="true" style={{ flex: "none", marginTop: 2 }} />
            Pending invitations can't be re-sent until they expire or are accepted.
          </p>
        </Panel>
      </div>
    </>
  );
};
