// LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/home", { replace: true });
    } catch (err) {
      if (err.message.includes("not verified")) {
        setError("Account not verified. Redirecting you to verify...");
        setTimeout(() => navigate(`/verify?email=${encodeURIComponent(email)}`), 2000);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 30 }}>
      <h2>Log In</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
};