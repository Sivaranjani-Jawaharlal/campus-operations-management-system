import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, MailCheck } from "lucide-react";
import { forgotPassword } from "../api/auth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { TextField } from "../components/ui/Field";

export const ForgotPasswordPage = () => {
  useDocumentTitle("Forgot password");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="auth__title">
          <span className="auth__badge auth__badge--success">
            <MailCheck size={26} aria-hidden="true" />
          </span>
          <h1 style={{ marginTop: "var(--s-2)" }}>Reset link sent.</h1>
          <p>
            If an account exists for <strong style={{ overflowWrap: "anywhere" }}>{email}</strong>, a reset link is on its way. It stays valid for 15 minutes.
          </p>
        </div>
        <div className="stack">
          <Button
            onClick={() => {
              setSent(false);
            }}
          >
            Use a different email
          </Button>
          <Link to="/login" className="btn btn--ghost">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to log in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth__title">
        <p className="eyebrow">
          <span className="eyebrow__no">№ 04</span>Account recovery
        </p>
        <h1>Forgot your password?</h1>
        <p>Enter your email and we'll send you a link to choose a new one.</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <form className="auth__form" onSubmit={handleSubmit}>
        <TextField label="Email" type="email" icon={Mail} autoComplete="email" placeholder="you@campus.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" variant="primary" size="lg" block icon={KeyRound} loading={loading} loadingText="Sending…">
          Send reset link
        </Button>
      </form>

      <p className="auth__alt">
        Remembered it? <Link to="/login">Back to log in</Link>
      </p>
    </AuthLayout>
  );
};
