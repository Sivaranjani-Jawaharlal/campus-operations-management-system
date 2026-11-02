import { useCallback, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "../../context/toastContext";

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (tone, message, { duration = 4800 } = {}) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-3), { id, tone, message }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (m, o) => push("success", m, o),
      error: (m, o) => push("error", m, { duration: 7000, ...o }),
      info: (m, o) => push("info", m, o),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <div key={t.id} className={`toast toast--${t.tone}`} role={t.tone === "error" ? "alert" : "status"}>
              <Icon className="toast__icon" size={18} aria-hidden="true" />
              <p className="toast__text">{t.message}</p>
              <button type="button" className="toast__close" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
