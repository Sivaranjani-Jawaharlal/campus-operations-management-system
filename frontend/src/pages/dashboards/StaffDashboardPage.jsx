// StaffDashboardPage.jsx / LabAssistantDashboardPage.jsx — same pattern:
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";

export const StaffDashboardPage = () => {
  const { user } = useAuth();
  return (
    <DashboardShell title="Staff Dashboard">
      <p>Department: <strong>{user?.department || "—"}</strong></p>
      <p style={{ color: "#888" }}>Placeholder — add staff-facing features here.</p>
    </DashboardShell>
  );
};