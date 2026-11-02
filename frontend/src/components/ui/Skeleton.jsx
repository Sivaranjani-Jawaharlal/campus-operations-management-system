export function Skeleton({ width = "100%", height = "1rem", style }) {
  return <span className="skeleton" style={{ width, height, ...style }} aria-hidden="true" />;
}

export function NoticeSkeleton({ count = 3 }) {
  return (
    <div className="stack" role="status" aria-label="Loading announcements">
      {Array.from({ length: count }, (_, i) => (
        <div className="notice-skeleton" key={i}>
          <div className="notice-skeleton__stamp" />
          <div className="notice-skeleton__body">
            <Skeleton width="55%" height="1.25rem" />
            <Skeleton width="95%" />
            <Skeleton width="70%" />
            <Skeleton width="35%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RowsSkeleton({ rows = 6 }) {
  return (
    <div style={{ padding: "var(--s-4)", display: "grid", gap: "var(--s-4)" }} role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ display: "flex", gap: "var(--s-3)", alignItems: "center" }}>
          <Skeleton width="2.25rem" height="2.25rem" style={{ borderRadius: "50%", flex: "none" }} />
          <div style={{ flex: 1, display: "grid", gap: 6 }}>
            <Skeleton width="38%" />
            <Skeleton width="58%" height="0.75rem" />
          </div>
          <Skeleton width="4.5rem" height="1.5rem" style={{ borderRadius: 999 }} />
        </div>
      ))}
    </div>
  );
}
