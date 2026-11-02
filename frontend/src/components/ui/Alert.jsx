import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const ICONS = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info };

// tone: success | error | warning | info. Errors are announced assertively, the rest politely.
export default function Alert({ tone = "info", title, children, className = "", action }) {
  const Icon = ICONS[tone];
  return (
    <div className={`alert alert--${tone} ${className}`.trim()} role={tone === "error" ? "alert" : "status"}>
      <Icon className="alert__icon" size={18} aria-hidden="true" />
      <div className="alert__body">
        {title && <p className="alert__title">{title}</p>}
        {children}
      </div>
      {action}
    </div>
  );
}
