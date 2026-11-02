export default function Panel({ title, description, icon: Icon, actions, footer, flush = false, children, className = "", headingLevel: H = "h2", warn = false }) {
  return (
    <section className={`panel ${flush ? "panel--flush" : ""} ${className}`.trim()}>
      {(title || actions) && (
        <header className="panel__head">
          <div className="panel__heading">
            {Icon && (
              <span className={`panel__icon ${warn ? "panel__icon--warn" : ""}`}>
                <Icon size={19} aria-hidden="true" />
              </span>
            )}
            <div>
              {title && <H className="panel__title">{title}</H>}
              {description && <p className="panel__desc">{description}</p>}
            </div>
          </div>
          {actions}
        </header>
      )}
      <div className="panel__body">{children}</div>
      {footer && <footer className="panel__foot">{footer}</footer>}
    </section>
  );
}
