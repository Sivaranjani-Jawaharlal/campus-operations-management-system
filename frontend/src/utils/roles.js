// Single source of truth for role -> dashboard path, used by both the
// post-login redirect and route guards.
export const ROLE_DASHBOARD_PATH = {
  STUDENT: "/dashboard/student",
  STAFF: "/dashboard/staff",
  LAB_ASSISTANT: "/dashboard/lab-assistant",
  ADMIN: "/dashboard/admin",
};

export function dashboardPathForRole(role) {
  return ROLE_DASHBOARD_PATH[role] || "/login";
}

export const ROLE_LABELS = {
  STUDENT: "Student",
  STAFF: "Staff",
  LAB_ASSISTANT: "Lab assistant",
  ADMIN: "Administrator",
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role || "";
}

// Roles that may publish announcements (mirrors SecurityConfiguration).
export const ANNOUNCEMENT_AUTHOR_ROLES = ["STAFF", "ADMIN"];
