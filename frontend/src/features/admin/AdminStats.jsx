import { RefreshCw, UserCheck, UserX, Users, Bell } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { ROLE_LABELS } from "../../utils/roles";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Panel from "../../components/ui/Panel";
import StatCard from "../../components/ui/StatCard";

const ROLE_ORDER = ["STUDENT", "STAFF", "LAB_ASSISTANT", "ADMIN"];
const ROLE_COLOR = {
  STUDENT: "var(--role-student)",
  STAFF: "var(--role-staff)",
  LAB_ASSISTANT: "var(--role-lab)",
  ADMIN: "var(--role-admin)",
};

// Live headline numbers for the admin overview, computed from the real user directory.
export default function AdminStats({ announcementCount }) {
  const { users, status, error, reload } = useUsers();
  const loading = status === "loading";

  if (status === "error") {
    return (
      <Alert
        tone="error"
        title="Couldn't load campus figures"
        action={
          <Button size="sm" icon={RefreshCw} onClick={reload}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const byRole = Object.fromEntries(ROLE_ORDER.map((r) => [r, users.filter((u) => u.role === r).length]));
  const inactive = users.filter((u) => u.accountStatus === "INACTIVE").length;
  const total = users.length;

  return (
    <div className="stack stack--lg">
      <div className="grid-stats">
        <StatCard label="People" icon={Users} value={total} note={`${byRole.STUDENT} students · ${total - byRole.STUDENT} team`} loading={loading} to="/dashboard/admin/people" />
        <StatCard label="Active accounts" icon={UserCheck} tone="var(--success)" value={total - inactive} note="Can create and edit" loading={loading} />
        <StatCard label="Inactive" icon={UserX} tone="var(--ink-faint)" value={inactive} note="Read-only access" loading={loading} />
        <StatCard
          label="Announcements"
          icon={Bell}
          tone="var(--accent)"
          value={announcementCount ?? "–"}
          note="Published in total"
          loading={announcementCount === null}
          to="/dashboard/admin/announcements"
        />
      </div>

      {total > 0 && (
        <Panel title="Who's on campus" description="Accounts by role">
          <div className="dist">
            <div className="dist__bar" role="img" aria-label={ROLE_ORDER.map((r) => `${byRole[r]} ${ROLE_LABELS[r]}`).join(", ")}>
              {ROLE_ORDER.filter((r) => byRole[r] > 0).map((r) => (
                <span key={r} className="dist__seg" style={{ flexGrow: byRole[r], background: ROLE_COLOR[r] }} />
              ))}
            </div>
            <ul className="dist__legend">
              {ROLE_ORDER.map((r) => (
                <li key={r} className="dist__item">
                  <span className="dist__swatch" style={{ background: ROLE_COLOR[r] }} />
                  {ROLE_LABELS[r]}
                  <span className="dist__num">{byRole[r]}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      )}
      {status === "ready" && total === 0 && (
        <Alert tone="info" title="No accounts yet">
          Upload the student roster and invite your team to get started.
        </Alert>
      )}
    </div>
  );
}
