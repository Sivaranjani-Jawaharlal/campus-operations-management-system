import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LinkIcon, MailOpen } from "lucide-react";
import { acceptInvitation } from "../api/auth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { PasswordField } from "../components/ui/Field";

export const AcceptInvitePage = () => {
  useDocumentTitle("Accept invitation");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const timer = useRef(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This invite link is invalid or missing a token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await acceptInvitation({ token, password });
      setSuccess("Account created! Redirecting to log in…");
      timer.current = setTimeout(() => navigate("/login", { state: { notice: "Your account is ready — log in to get started." } }), 1800);
    } catch (err) {
      setError(err.message || "This invite may have expired. Please ask an admin for a new one.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="auth__title">
          <span className="auth__badge auth__badge--danger">
            <LinkIcon size={26} aria-hidden="true" />
          </span>
          <h1 style={{ marginTop: "var(--s-2)" }}>No invitation found.</h1>
          <p>This link is missing its invite token. Please use the link from your invitation email.</p>
        </div>
        <Link to="/login" className="btn btn--lg btn--block">
          Back to log in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth__title">
        <span className="auth__badge">
          <MailOpen size={26} aria-hidden="true" />
        </span>
        <p className="eyebrow" style={{ marginTop: "var(--s-2)" }}>
          <span className="eyebrow__no">№ 06</span>Invitation
        </p>
        <h1>You're invited.</h1>
        <p>Choose a password to finish creating your account.</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}

      <form className="auth__form" onSubmit={handleSubmit}>
        <PasswordField label="Password" showStrength autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" required />
        <PasswordField label="Confirm password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required error={mismatch ? "Passwords don't match yet." : undefined} />
        <Button type="submit" variant="primary" size="lg" block loading={loading} loadingText="Creating account…" disabled={Boolean(success)}>
          Accept &amp; create account
        </Button>
      </form>

      <p className="auth__alt">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};
