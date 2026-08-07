import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };
  // Use handleLogout instead of direct logout in button

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};
