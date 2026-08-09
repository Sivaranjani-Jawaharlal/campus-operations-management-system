import DashboardShell from "../../components/DashboardShell";
import AnnouncementFeed from "../../components/AnnouncementFeed";
import { useAuth } from "../../context/AuthContext";

export const LabAssistantDashboardPage = () => {
  const { user } = useAuth();
  return (
    <DashboardShell title="Lab Assistant Dashboard">
      <p>Department: <strong>{user?.department || "—"}</strong></p>
      <h2>Announcements</h2>
      <AnnouncementFeed canManage={false} />
    </DashboardShell>
  );
};