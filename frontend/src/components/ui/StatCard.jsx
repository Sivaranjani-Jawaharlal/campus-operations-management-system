import { Link } from "react-router-dom";

export default function StatCard({ label, value, note, icon: Icon, tone, to, loading }) {
  const body = (
    <>
      <span className="stat__label">
        {Icon && <Icon size={14} aria-hidden="true" />}
        {label}
      </span>
      {loading ? <span className="skeleton" style={{ height: "2.5rem", width: "4.5rem" }} aria-label="Loading" /> : <span className="stat__value">{value}</span>}
      {note && <span className="stat__note">{note}</span>}
    </>
  );
  const style = tone ? { "--stat-tone": tone } : undefined;
  return to ? (
    <Link to={to} className="stat" style={style}>
      {body}
    </Link>
  ) : (
    <div className="stat" style={style}>
      {body}
    </div>
  );
}
