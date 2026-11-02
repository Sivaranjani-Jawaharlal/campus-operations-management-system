export default function EmptyState({ icon: Icon, title, children, actions, tone }) {
  return (
    <div className={`empty ${tone === "error" ? "empty--error" : ""}`.trim()}>
      {Icon && (
        <span className="empty__art">
          <Icon size={26} aria-hidden="true" />
        </span>
      )}
      <h3 className="empty__title">{title}</h3>
      {children && <p className="empty__text">{children}</p>}
      {actions && <div className="empty__actions">{actions}</div>}
    </div>
  );
}
