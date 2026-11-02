import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import Avatar from "../ui/Avatar";
import { RoleBadge } from "../ui/Badge";

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={ref}>
      <button type="button" className="menu__trigger" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Avatar name={user.username} role={user.role} size="sm" />
        <span className="sr-only">Account menu for {user.username}</span>
        <ChevronDown size={15} aria-hidden="true" style={{ color: "var(--ink-mute)" }} />
      </button>
      {open && (
        <div className="menu__panel" role="menu">
          <div className="menu__who">
            <Avatar name={user.username} role={user.role} />
            <div className="menu__who-text">
              <div className="menu__name">{user.username}</div>
              <div className="menu__email">{user.email}</div>
            </div>
          </div>
          <div style={{ padding: "0 var(--s-3) var(--s-2)" }}>
            <RoleBadge role={user.role} />
          </div>
          <div className="menu__sep" />
          <button type="button" role="menuitem" className="menu__item menu__item--danger" onClick={onLogout}>
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
