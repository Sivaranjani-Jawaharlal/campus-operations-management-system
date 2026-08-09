import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardShell({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p style={{ margin: "4px 0 0", color: "#666" }}>
            {user?.username} · {user?.email} · {user?.role}
          </p>
        </div>
        <button onClick={handleLogout}>Log out</button>
      </div>
      {children}
    </div>
  );
}