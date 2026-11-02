import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { formatToday } from "../../utils/format";
import { roleLabel } from "../../utils/roles";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import Logo from "../ui/Logo";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { navForRole } from "./navConfig";

export default function AppShell() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const groups = navForRole(user.role);
  const inactive = user.accountStatus === "INACTIVE";

  // Close the mobile drawer whenever the route changes, and on Escape.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to navigation
    setNavOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
      toast.info("You've been logged out.");
    } catch (err) {
      toast.error(err.message || "Couldn't log out. Please try again.");
    }
  };

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <aside id="primary-nav" className="sidebar" data-open={navOpen} aria-label="Primary">
        <Logo as={NavLink} to="/home" className="brand" aria-label="Campus Operations home" />
        <Button variant="ghost" iconOnly className="sidebar__close" onClick={() => setNavOpen(false)}>
          <X size={18} aria-hidden="true" />
          Close menu
        </Button>

        <nav className="nav" aria-label="Main navigation">
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="nav__label">{group.heading}</p>
              <ul className="nav__list">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink to={item.href} end={item.end} className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
                      <item.icon size={18} aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar__foot">
          <div className="sidebar__user">
            <Avatar name={user.username} role={user.role} />
            <div className="sidebar__who">
              <span className="sidebar__name">{user.username}</span>
              <span className="sidebar__role">{roleLabel(user.role)}</span>
            </div>
          </div>
          <button type="button" className="sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <div className="main">
        <header className="topbar">
          <Button variant="ghost" iconOnly className="topbar__menu" onClick={() => setNavOpen(true)} aria-expanded={navOpen} aria-controls="primary-nav">
            <Menu size={20} aria-hidden="true" />
            Open menu
          </Button>
          <Logo as="span" className="brand topbar__brand" />
          <span className="topbar__date">{formatToday()}</span>
          <span className="topbar__spacer" />
          <ThemeToggle />
          <UserMenu user={user} onLogout={handleLogout} />
        </header>

        <main id="main" className="content" tabIndex={-1}>
          {inactive && (
            <Alert tone="warning" title="Your account is inactive" className="rise">
              You can view content here, but you can't create, edit, or delete anything. Contact an admin if this seems wrong.
            </Alert>
          )}
          <div style={inactive ? { marginTop: "var(--s-6)" } : undefined}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
