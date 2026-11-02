import { useSearchParams } from "react-router-dom";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { useAuth } from "../../hooks/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { ANNOUNCEMENT_AUTHOR_ROLES } from "../../utils/roles";
import PageHeader from "../../components/ui/PageHeader";
import AnnouncementsView from "../../features/announcements/AnnouncementsView";

export const AnnouncementsPage = () => {
  useDocumentTitle("Announcements");
  const { user } = useAuth();
  const [params] = useSearchParams();
  const feed = useAnnouncements();
  const canManage = ANNOUNCEMENT_AUTHOR_ROLES.includes(user.role) && user.accountStatus === "ACTIVE";
  const isStudent = user.role === "STUDENT";

  return (
    <>
      <PageHeader
        eyebrow="Notice board"
        number="01"
        title="Announcements"
        description={
          isStudent
            ? "Notices for the whole campus, plus anything aimed at your department and year."
            : canManage
              ? "Everything that's been published, across every department and year. Publish, edit or retire notices here."
              : "Everything that's been published, across every department and year."
        }
      />
      <AnnouncementsView feed={feed} canManage={canManage} startComposing={params.get("compose") === "1"} />
    </>
  );
};
