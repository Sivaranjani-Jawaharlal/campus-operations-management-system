import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, IdCard, Mail, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { PasswordField, TextField } from "../components/ui/Field";

export const SignupPage = () => {
  useDocumentTitle("Create account");
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const timer = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
      await signup({ username, email, password, rollNumber, dateOfBirth });
      setSuccess("Account created! Please check your email for the verification code.");
      timer.current = setTimeout(() => navigate(`/verify?email=${encodeURIComponent(email)}`), 2000);
    } catch (err) {
      const msg = err.message || "Signup failed. Please try again.";
      if (msg.includes("already exists")) {
        setError("An account with this email already exists. Please log in or reset your password.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout wide>
      <div className="auth__title">
        <p className="eyebrow">
          <span className="eyebrow__no">№ 02</span>Student registration
        </p>
        <h1>Create your account.</h1>
        <p>
          We'll check your roll number and date of birth against the campus roster. Staff and lab assistants join by invitation instead.
        </p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {success && (
        <Alert tone="success">
          {success} <Link to={`/verify?email=${encodeURIComponent(email)}`}>Enter code now</Link>
        </Alert>
      )}

      <form className="auth__form" onSubmit={handleSignup}>
        <div className="field-row">
          <TextField label="Roll number" icon={IdCard} value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="Your roll number" required autoComplete="off" />
          <TextField label="Date of birth" type="date" icon={CalendarDays} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required autoComplete="bday" />
        </div>
        <div className="field-row">
          <TextField label="Username" icon={User} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" required autoComplete="username" />
          <TextField label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu" required autoComplete="email" />
        </div>
        <PasswordField label="Password" showStrength autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          required
          error={mismatch ? "Passwords don't match yet." : undefined}
        />
        <Button type="submit" variant="primary" size="lg" block loading={loading} loadingText="Creating account…" disabled={Boolean(success)}>
          Create account
        </Button>
      </form>

      <p className="auth__alt">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};
