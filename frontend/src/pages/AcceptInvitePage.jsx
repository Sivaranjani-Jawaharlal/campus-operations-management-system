import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { acceptInvitation } from "../api/auth";

export const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "This invite may have expired. Please ask an admin for a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 30, backgroundColor: "#fff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Accept Invitation</h2>

      {!token && <div style={errorBox}>No invite token found in the link. Please use the link from your email.</div>}
      {error && <div style={errorBox}>{error}</div>}
      {success && <div style={successBox}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={labelStyle}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                 placeholder="Choose a password" required style={inputStyle} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={labelStyle}>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="Confirm password" required style={inputStyle} />
        </div>
        <button type="submit" disabled={loading || !token} style={{
          width: "100%", padding: 12, backgroundColor: "#007bff", color: "white",
          border: "none", borderRadius: 4, cursor: loading || !token ? "not-allowed" : "pointer",
          fontSize: 16, fontWeight: 500, opacity: loading || !token ? 0.7 : 1,
        }}>
          {loading ? "Creating account..." : "Accept & Create Account"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: "center", paddingTop: 15, borderTop: "1px solid #eee" }}>
        <Link to="/login" style={{ color: "#6c757d", textDecoration: "none", fontSize: 14 }}>Back to Login</Link>
      </div>
    </div>
  );
};

const labelStyle = { display: "block", marginBottom: 5, fontWeight: 500 };
const inputStyle = { width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ccc", fontSize: 16 };
const errorBox = { color: "red", padding: 10, border: "1px solid red", borderRadius: 4, marginBottom: 10, backgroundColor: "#fff0f0" };
const successBox = { color: "green", padding: 10, border: "1px solid green", borderRadius: 4, marginBottom: 10, backgroundColor: "#f0fff0" };