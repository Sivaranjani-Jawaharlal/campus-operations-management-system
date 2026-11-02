import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LinkIcon, ShieldCheck } from "lucide-react";
import { resetPassword } from "../api/auth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { PasswordField } from "../components/ui/Field";

export const ResetPasswordPage = () => {
  useDocumentTitle("Set new password");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const timer = useRef(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const mismatch = confirm.length > 0 && newPassword !== confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      setDone(true);
      timer.current = setTimeout(() => navigate("/login", { state: { notice: "Password updated — log in with your new password." } }), 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="auth__title">
          <span className="auth__badge auth__badge--danger">
            <LinkIcon size={26} aria-hidden="true" />
          </span>
          <h1 style={{ marginTop: "var(--s-2)" }}>This link isn't valid.</h1>
          <p>The reset link is missing its token. Please use the link from your email, or request a new one.</p>
        </div>
        <Link to="/forgot-password" className="btn btn--primary btn--lg btn--block">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth__title">
        <p className="eyebrow">
          <span className="eyebrow__no">№ 05</span>Account recovery
        </p>
        <h1>Choose a new password.</h1>
        <p>Pick something you haven't used elsewhere.</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {done && <Alert tone="success">Password reset! Taking you to log in…</Alert>}

      <form className="auth__form" onSubmit={handleSubmit}>
        <PasswordField label="New password" showStrength autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" required />
        <PasswordField label="Confirm new password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" required error={mismatch ? "Passwords don't match yet." : undefined} />
        <Button type="submit" variant="primary" size="lg" block icon={ShieldCheck} loading={loading} loadingText="Saving…" disabled={done}>
          Reset password
        </Button>
      </form>

      <p className="auth__alt">
        <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};
