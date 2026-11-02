import { Link } from "react-router-dom";
import { BellRing, GraduationCap, ShieldCheck } from "lucide-react";
import Logo from "../ui/Logo";
import ThemeToggle from "./ThemeToggle";

function Arches() {
  // A repeating colonnade; purely decorative.
  return (
    <svg className="auth__arches" viewBox="0 0 600 300" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 20 + i * 112;
        return (
          <g key={i}>
            <path d={`M${x} 300V150a48 48 0 0 1 96 0V300`} />
            <path d={`M${x + 14} 300V152a34 34 0 0 1 68 0V300`} />
            <path d={`M${x + 28} 300V154a20 20 0 0 1 40 0V300`} />
          </g>
        );
      })}
      <path d="M0 150h600" />
    </svg>
  );
}

// Split-screen shell shared by every signed-out page: brand story on one side, task on the other.
export default function AuthLayout({ children, wide = false }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <Logo as={Link} to="/login" className="brand" aria-label="Campus Operations" />
        <div className="auth__pitch">
          <p className="eyebrow" style={{ color: "var(--side-mute)" }}>
            <span className="eyebrow__no">№ 00</span>
            One register for the whole campus
          </p>
          <h2>
            Every notice, every account, <em>in good order.</em>
          </h2>
          <ul className="auth__points">
            <li>
              <BellRing size={17} aria-hidden="true" />
              Announcements that reach exactly the department and year they're meant for.
            </li>
            <li>
              <GraduationCap size={17} aria-hidden="true" />
              Students join with their roll number; staff and lab assistants by invitation.
            </li>
            <li>
              <ShieldCheck size={17} aria-hidden="true" />
              Role-based access, with graduated accounts kept safely read-only.
            </li>
          </ul>
        </div>
        <p className="auth__legal">Campus Operations Management System</p>
        <Arches />
      </aside>

      <div className="auth__main">
        <div className="auth__bar">
          <Logo as={Link} to="/login" className="brand" aria-label="Campus Operations" />
          <span style={{ marginLeft: "auto" }}>
            <ThemeToggle />
          </span>
        </div>
        <main className="auth__center" id="main">
          <div className={`auth__card ${wide ? "auth__card--wide" : ""}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}
