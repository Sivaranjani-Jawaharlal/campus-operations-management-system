import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { TextField } from "../components/ui/Field";
import OtpInput from "../components/ui/OtpInput";

const RESEND_COOLDOWN = 30; // seconds — a UI courtesy; the server enforces its own limits

export const VerifyPage = () => {
  useDocumentTitle("Verify account");
  const { verify, resendCode } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email");
  const timer = useRef(null);

  const [email, setEmail] = useState(emailParam || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await verify({ email, verificationCode });
      setSuccess("Account verified! Redirecting to login…");
      timer.current = setTimeout(() => navigate("/login", { state: { notice: "Account verified — you can log in now." } }), 1800);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);
    try {
      await resendCode(email);
      setSuccess("A new verification code is on its way.");
      setCooldown(RESEND_COOLDOWN);
      setVerificationCode("");
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const verified = success.startsWith("Account verified");

  return (
    <AuthLayout>
      <div className="auth__title">
        <span className={`auth__badge ${verified ? "auth__badge--success" : ""}`}>
          <MailCheck size={26} aria-hidden="true" />
        </span>
        <p className="eyebrow" style={{ marginTop: "var(--s-2)" }}>
          <span className="eyebrow__no">№ 03</span>Verification
        </p>
        <h1>Check your inbox.</h1>
        <p>
          {emailParam ? (
            <>
              We sent a 6-digit code to <strong style={{ overflowWrap: "anywhere" }}>{emailParam}</strong>. It's valid for 15 minutes.
            </>
          ) : (
            "Enter your email and the 6-digit code we sent you. It's valid for 15 minutes."
          )}
        </p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}

      <form className="auth__form" onSubmit={handleVerify}>
        {!emailParam && <TextField label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu" required />}
        <OtpInput value={verificationCode} onChange={setVerificationCode} autoFocus error={undefined} />
        <Button type="submit" variant="primary" size="lg" block loading={loading} loadingText="Verifying…" disabled={verificationCode.length < 6 || verified}>
          Verify account
        </Button>
      </form>

      <div className="auth__links">
        <span className="muted">
          Didn't get it?{" "}
          <button type="button" className="linkbtn" onClick={handleResendCode} disabled={resendLoading || cooldown > 0 || !email}>
            {resendLoading ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </span>
        <Link to="/login">Back to log in</Link>
      </div>
    </AuthLayout>
  );
};
