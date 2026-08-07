// frontend/src/pages/SignupPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export const SignupPage = () => {

  const {user, checkAuth} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/home', {replace: true});
    }
  }, [user]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      const data = await response.text();

      if (response.ok) {
        setSuccess(
          "Account created! Please check your email for verification code."
        );
        setTimeout(() => {
          navigate(`/verify?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        // ✅ Display user-friendly error messages
        if (data.includes("already exists")) {
          setError(
            "An account with this email already exists. Please log in or reset your password."
          );
        } else if (data.includes("verification code was already sent")) {
          setError(
            "A verification code was already sent to your email. Please check your inbox or wait 15 minutes."
          );
        } else {
          setError(data || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 30,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Sign Up</h2>

      {error && (
        <div
          style={{
            color: "red",
            padding: 10,
            border: "1px solid red",
            borderRadius: 4,
            marginBottom: 10,
            backgroundColor: "#fff0f0",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            color: "green",
            padding: 10,
            border: "1px solid green",
            borderRadius: 4,
            marginBottom: 10,
            backgroundColor: "#f0fff0",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: 500,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {/* ✅ Link back to Login */}
      <div
        style={{
          marginTop: 20,
          textAlign: "center",
          paddingTop: 15,
          borderTop: "1px solid #eee",
        }}
      >
        <p style={{ margin: 0, color: "#666" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
