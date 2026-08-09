// frontend/src/pages/dashboards/StaffDashboardPage.jsx
import DashboardShell from "../../components/DashboardShell";
import AnnouncementFeed from "../../components/AnnouncementFeed";
import ReadOnlyBanner from "../../components/ReadOnlyBanner";
import { useAuth } from "../../context/AuthContext";

export const StaffDashboardPage = () => {
  const { user } = useAuth();
  const canManage = user?.accountStatus === "ACTIVE";
  return (
    <DashboardShell title="Staff Dashboard">
      {!canManage && <ReadOnlyBanner />}
      <p>Department: <strong>{user?.department || "—"}</strong></p>
      <h2>Announcements</h2>
      <AnnouncementFeed canManage={canManage} />
    </DashboardShell>
  );
};