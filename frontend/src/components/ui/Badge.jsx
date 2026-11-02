import { roleLabel } from "../../utils/roles";

export function RoleBadge({ role }) {
  return <span className={`badge badge--${String(role).toLowerCase()}`}>{roleLabel(role)}</span>;
}

export function StatusBadge({ status }) {
  const active = status === "ACTIVE";
  return (
    <span className={`badge ${active ? "badge--success" : "badge--muted"}`}>
      <span className="badge__dot" aria-hidden="true" />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function Badge({ tone, children }) {
  return <span className={`badge ${tone ? `badge--${tone}` : ""}`.trim()}>{children}</span>;
}
