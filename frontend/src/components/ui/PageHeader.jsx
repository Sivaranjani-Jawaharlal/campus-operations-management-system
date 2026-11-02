export default function PageHeader({ eyebrow, number, title, description, actions, children }) {
  return (
    <header className="page-head rise">
      <div className="page-head__text">
        {eyebrow && (
          <p className="eyebrow">
            {number && <span className="eyebrow__no">№ {number}</span>}
            {eyebrow}
          </p>
        )}
        {children ?? <h1>{title}</h1>}
        {description && <p className="page-head__desc">{description}</p>}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </header>
  );
}
