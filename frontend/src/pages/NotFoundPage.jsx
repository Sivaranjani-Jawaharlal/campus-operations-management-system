import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { dashboardPathForRole } from "../utils/roles";
import { LogoMark } from "../components/ui/Logo";

export const NotFoundPage = () => {
  useDocumentTitle("Page not found");
  const { user } = useAuth();
  return (
    <main className="fullpage" id="main">
      <div className="fullpage__inner rise">
        <span style={{ color: "var(--brand)" }}>
          <LogoMark size={36} />
        </span>
        <p className="fullpage__code">
          4<span>0</span>4
        </p>
        <h1>This page isn't on the register.</h1>
        <p className="muted">The address may have changed, or it never existed. Let's get you back on track.</p>
        <div className="cluster" style={{ justifyContent: "center" }}>
          <Link to={user ? dashboardPathForRole(user.role) : "/login"} className="btn btn--primary">
            <Home size={17} aria-hidden="true" />
            {user ? "Go to my dashboard" : "Go to log in"}
          </Link>
          <button type="button" className="btn" onClick={() => window.history.back()}>
            <ArrowLeft size={17} aria-hidden="true" />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
};
