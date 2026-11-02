import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboardPathForRole } from "../utils/roles";
import BootScreen from "./BootScreen";

export default function RoleRedirect() {
  const { user, authChecked } = useAuth();
  if (!authChecked) return <BootScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathForRole(user.role)} replace />;
}
