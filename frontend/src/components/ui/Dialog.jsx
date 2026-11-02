import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";
import Alert from "./Alert";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Accessible modal: labelled, focus-trapped, Escape/scrim to close, scroll-locked,
// and focus returns to whatever opened it.
export default function Dialog({ open, onClose, title, description, icon: Icon, tone, wide = false, busy = false, footer, children }) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const firstField = panel?.querySelector("[data-autofocus], input:not([type=hidden]), textarea, select");
    (firstField || panel?.querySelector(FOCUSABLE) || panel)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape" && !busy) {
        e.stopPropagation();
        onClose();
      } else if (e.key === "Tab" && panel) {
        const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="dialog-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`dialog ${wide ? "dialog--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
      >
        <header className="dialog__head">
          <div className="dialog__headline">
            {Icon && (
              <span className={`dialog__mark ${tone ? `dialog__mark--${tone}` : ""}`}>
                <Icon size={20} aria-hidden="true" />
              </span>
            )}
            <div>
              <h2 className="dialog__title" id={titleId}>
                {title}
              </h2>
              {description && (
                <p className="dialog__desc" id={descId}>
                  {description}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" iconOnly onClick={onClose} disabled={busy}>
            <X size={17} aria-hidden="true" />
            Close dialog
          </Button>
        </header>
        <div className="dialog__body">{children}</div>
        {footer && <footer className="dialog__foot">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

// Confirmation for destructive / high-impact actions. `onConfirm` may be async;
// a thrown error is shown inside the dialog and keeps it open.
export function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", busyLabel = "Working…", tone = "danger", icon = AlertTriangle, onConfirm, onCancel, children }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cancel = () => {
    setError("");
    onCancel();
  };

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={cancel}
      title={title}
      description={description}
      icon={icon}
      tone={tone}
      busy={busy}
      footer={
        <>
          <Button onClick={cancel} disabled={busy} data-autofocus>
            Cancel
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={confirm} loading={busy} loadingText={busyLabel}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {error && <Alert tone="error">{error}</Alert>}
    </Dialog>
  );
}
