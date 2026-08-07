// ResetPasswordPage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await resetPassword({ token, newPassword });
      setStatus("Password reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set New Password</h2>
      <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      <button type="submit">Reset Password</button>
      {status && <p>{status}</p>}
    </form>
  );
}