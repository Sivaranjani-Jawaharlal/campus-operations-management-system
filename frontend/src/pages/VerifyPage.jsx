// VerifyPage.jsx
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const VerifyPage = () => {
  const { verify, resendCode } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await verify({ email, verificationCode });
      setSuccess("Account verified! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);
    try {
      await resendCode(email);
      setSuccess("New verification code sent!");
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 30 }}>
      <h2>Verify Your Account</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <form onSubmit={handleVerify}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!emailParam} />
        <input type="text" placeholder="6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} required />
        <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify Account"}</button>
      </form>
      <button onClick={handleResendCode} disabled={resendLoading}>{resendLoading ? "Sending..." : "Resend code"}</button>
      <Link to="/login">Back to Login</Link>
    </div>
  );
};