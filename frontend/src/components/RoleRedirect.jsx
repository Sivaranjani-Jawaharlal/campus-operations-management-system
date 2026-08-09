import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardPathForRole } from "../utils/roles";

export default function RoleRedirect() {
  const { user, authChecked } = useAuth();
  if (!authChecked) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathForRole(user.role)} replace />;
}