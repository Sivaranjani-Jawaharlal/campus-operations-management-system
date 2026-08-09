import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  return (
    <DashboardShell title="Student Dashboard">
      <p>
        Department: <strong>{user?.department}</strong> · Academic year:{" "}
        <strong>{user?.academicYear}</strong>
      </p>
      <p style={{ color: "#888" }}>
        Placeholder — add student-facing features here (course info, campus
        services, etc.).
      </p>
    </DashboardShell>
  );
};