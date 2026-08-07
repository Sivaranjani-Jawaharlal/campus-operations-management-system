// ForgotPasswordPage.jsx
import { useState } from "react";
import { forgotPassword } from "../api/auth";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStatus("If that email exists, a reset link has been sent.");
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Send Reset Link</button>
      {status && <p>{status}</p>}
    </form>
  );
}