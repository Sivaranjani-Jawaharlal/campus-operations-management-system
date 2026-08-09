import DashboardShell from "../../components/DashboardShell";
import AnnouncementFeed from "../../components/AnnouncementFeed";
import { useAuth } from "../../context/AuthContext";

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  return (
    <DashboardShell title="Student Dashboard">
      <p>
        Department: <strong>{user?.department}</strong> · Academic year:{" "}
        <strong>{user?.academicYear}</strong>
      </p>
      <h2>Announcements</h2>
      <AnnouncementFeed canManage={false} />
    </DashboardShell>
  );
};