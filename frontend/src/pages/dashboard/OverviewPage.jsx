import { Link } from "react-router-dom";
import { ArrowRight, Bell, GraduationCap, Megaphone, MailPlus, Table2, TriangleAlert, Users } from "lucide-react";
import { useAnnouncements } from "../../hooks/useAnnouncements";
import { useAuth } from "../../hooks/useAuth";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { greetingFor } from "../../utils/format";
import { ANNOUNCEMENT_AUTHOR_ROLES, dashboardPathForRole } from "../../utils/roles";
import Avatar from "../../components/ui/Avatar";
import { RoleBadge, StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/ui/PageHeader";
import Panel from "../../components/ui/Panel";
import { NoticeSkeleton } from "../../components/ui/Skeleton";
import NoticeList from "../../features/announcements/NoticeList";
import AdminStats from "../../features/admin/AdminStats";

const BLURB = {
  STUDENT: "Here's what's new for your department and year.",
  STAFF: "Keep your students informed and your notices in order.",
  LAB_ASSISTANT: "The latest notices from across campus, at a glance.",
  ADMIN: "A live picture of the people and notices on campus.",
};

function quickActions(role, base, canPost) {
  const link = (to, icon, title, sub) => ({ to: `${base}/${to}`.replace(/\/$/, ""), icon, title, sub });
  const read = link("announcements", Bell, "Read announcements", "Everything addressed to you");
  if (role === "ADMIN") {
    return [
      link("announcements?compose=1", Megaphone, "Publish an announcement", "Reach any department or year"),
      link("invitations", MailPlus, "Invite a colleague", "Staff, lab assistant or admin"),
      link("roster", Table2, "Upload the student roster", "CSV of eligible students"),
      link("academic-year", GraduationCap, "Promote or graduate a cohort", "Year-end account changes"),
      link("people", Users, "Manage people", "Search accounts, set active or inactive"),
    ];
  }
  if (canPost) return [link("announcements?compose=1", Megaphone, "Publish an announcement", "Target a department or year"), read];
  return [read];
}

export const OverviewPage = () => {
  useDocumentTitle("Overview");
  const { user } = useAuth();
  const feed = useAnnouncements();
  const base = dashboardPathForRole(user.role);
  const canPost = ANNOUNCEMENT_AUTHOR_ROLES.includes(user.role) && user.accountStatus === "ACTIVE";
  const firstName = (user.username || "").split(/[\s._-]+/)[0];
  const latest = feed.items.slice(0, 3);
  const isStudent = user.role === "STUDENT";

  return (
    <>
      <PageHeader eyebrow="Overview" number="00" description={BLURB[user.role]}>
        <div className="greeting">
          <h1>
            {greetingFor()}, <em>{firstName}</em>.
          </h1>
        </div>
      </PageHeader>

      {user.role === "ADMIN" && (
        <div className="rise rise-1" style={{ marginBottom: "var(--s-6)" }}>
          <AdminStats announcementCount={feed.status === "ready" ? feed.items.length : null} />
        </div>
      )}

      <div className="grid-2">
        <section aria-labelledby="latest-heading" className="rise rise-2">
          <div className="section__head" style={{ marginTop: 0 }}>
            <div>
              <p className="eyebrow">
                <span className="eyebrow__no">№ 01</span>Latest
              </p>
              <h2 id="latest-heading" style={{ marginTop: "var(--s-1)" }}>
                From the notice board
              </h2>
            </div>
            <Link to={`${base}/announcements`} className="btn btn--ghost btn--sm">
              View all
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {feed.status === "loading" && <NoticeSkeleton count={2} />}
          {feed.status === "error" && (
            <div className="panel">
              <EmptyState
                tone="error"
                icon={TriangleAlert}
                title="Couldn't load announcements"
                actions={<Button onClick={() => feed.reload()}>Try again</Button>}
              >
                {feed.error}
              </EmptyState>
            </div>
          )}
          {feed.status === "ready" && latest.length === 0 && (
            <div className="panel">
              <EmptyState icon={Bell} title="All quiet for now">
                {canPost ? "Publish an announcement and it will show up here first." : "New announcements will appear here as soon as they're posted."}
              </EmptyState>
            </div>
          )}
          {feed.status === "ready" && latest.length > 0 && <NoticeList items={latest} grouped={false} />}
        </section>

        <aside className="stack stack--lg rise rise-3" aria-label="Your profile and shortcuts">
          <Panel>
            <div className="profile">
              <div className="profile__top">
                <Avatar name={user.username} role={user.role} size="lg" />
                <div style={{ minWidth: 0 }}>
                  <p className="profile__name">{user.username}</p>
                  <p className="profile__email">{user.email}</p>
                </div>
              </div>
              <dl className="kv">
                <dt>Role</dt>
                <dd>
                  <RoleBadge role={user.role} />
                </dd>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={user.accountStatus} />
                </dd>
                {user.role !== "ADMIN" && (
                  <>
                    <dt>Department</dt>
                    <dd>{user.department || <span className="muted">Not assigned</span>}</dd>
                  </>
                )}
                {isStudent && (
                  <>
                    <dt>Year</dt>
                    <dd>{user.academicYear || <span className="muted">Not assigned</span>}</dd>
                  </>
                )}
              </dl>
            </div>
          </Panel>

          <Panel title="Shortcuts" flush>
            <nav className="actions-list" aria-label="Shortcuts">
              {quickActions(user.role, base, canPost).map((a) => (
                <Link key={a.to} to={a.to} className="action">
                  <span className="action__icon">
                    <a.icon size={18} aria-hidden="true" />
                  </span>
                  <span className="action__text">
                    <span className="action__title">{a.title}</span>
                    <br />
                    <span className="action__sub">{a.sub}</span>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </Panel>
        </aside>
      </div>
    </>
  );
};
