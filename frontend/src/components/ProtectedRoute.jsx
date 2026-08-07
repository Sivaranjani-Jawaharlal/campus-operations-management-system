import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authChecked } = useAuth();
  if (!authChecked) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}