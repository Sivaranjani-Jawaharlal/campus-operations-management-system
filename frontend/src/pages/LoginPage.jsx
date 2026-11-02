import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { PasswordField, TextField } from "../components/ui/Field";

export const LoginPage = () => {
  useDocumentTitle("Log in");
  const { user, authChecked, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const timer = useRef(null);
  const notice = location.state?.notice;

  useEffect(() => () => clearTimeout(timer.current), []);

  // Already signed in? Skip the form.
  if (authChecked && user && !redirecting) return <Navigate to="/home" replace />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/home", { replace: true });
    } catch (err) {
      if (err.message.includes("not verified")) {
        setError("Account not verified. Redirecting you to verify…");
        setRedirecting(true);
        timer.current = setTimeout(() => navigate(`/verify?email=${encodeURIComponent(email)}`), 2000);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="auth__title">
        <p className="eyebrow">
          <span className="eyebrow__no">№ 01</span>Sign in
        </p>
        <h1>Welcome back.</h1>
        <p>Log in to see what's new on campus.</p>
      </div>

      {notice && !error && <Alert tone="success">{notice}</Alert>}
      {error && (
        <Alert tone={redirecting ? "warning" : "error"}>
          {error}{" "}
          {redirecting && (
            <Link to={`/verify?email=${encodeURIComponent(email)}`}>Verify now</Link>
          )}
        </Alert>
      )}

      <form className="auth__form" onSubmit={handleLogin}>
        <TextField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <PasswordField label="Password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="auth__links" style={{ justifyContent: "flex-end", marginTop: "calc(var(--s-2) * -1)" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <Button type="submit" variant="primary" size="lg" block icon={LogIn} loading={loading} loadingText="Logging in…">
          Log in
        </Button>
      </form>

      <p className="auth__alt">
        New student? <Link to="/signup">Create your account</Link>
      </p>
    </AuthLayout>
  );
};
