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