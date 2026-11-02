import { Bell, GraduationCap, LayoutDashboard, MailPlus, Table2, Users } from "lucide-react";
import { ROLE_DASHBOARD_PATH } from "../../utils/roles";

// Navigation per role. Paths are relative to the role's dashboard base, so adding a page
// means one line here plus one <Route>.
const ANNOUNCEMENTS = { to: "announcements", label: "Announcements", icon: Bell };
const OVERVIEW = { to: "", label: "Overview", icon: LayoutDashboard, end: true };

const NAV = {
  STUDENT: [{ heading: "Campus", items: [OVERVIEW, ANNOUNCEMENTS] }],
  STAFF: [{ heading: "Campus", items: [OVERVIEW, ANNOUNCEMENTS] }],
  LAB_ASSISTANT: [{ heading: "Campus", items: [OVERVIEW, ANNOUNCEMENTS] }],
  ADMIN: [
    { heading: "Campus", items: [OVERVIEW, ANNOUNCEMENTS] },
    {
      heading: "Administration",
      items: [
        { to: "people", label: "People", icon: Users },
        { to: "invitations", label: "Invitations", icon: MailPlus },
        { to: "roster", label: "Student roster", icon: Table2 },
        { to: "academic-year", label: "Academic year", icon: GraduationCap },
      ],
    },
  ],
};

export function navForRole(role) {
  const base = ROLE_DASHBOARD_PATH[role];
  return (NAV[role] || []).map((group) => ({
    ...group,
    items: group.items.map((item) => ({ ...item, href: item.to ? `${base}/${item.to}` : base })),
  }));
}

export function pageTitleFor(role, pathname) {
  for (const group of navForRole(role)) {
    for (const item of group.items) {
      if (pathname === item.href || pathname === `${item.href}/`) return item.label;
    }
  }
  return "";
}
