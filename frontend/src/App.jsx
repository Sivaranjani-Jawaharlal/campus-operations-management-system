import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ToastProvider from "./components/ui/ToastProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import AppShell from "./components/layout/AppShell";
import { ROLE_DASHBOARD_PATH } from "./utils/roles";

import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { VerifyPage } from "./pages/VerifyPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { AcceptInvitePage } from "./pages/AcceptInvitePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OverviewPage } from "./pages/dashboard/OverviewPage";
import { AnnouncementsPage } from "./pages/dashboard/AnnouncementsPage";
import { PeoplePage } from "./pages/admin/PeoplePage";
import { InvitationsPage } from "./pages/admin/InvitationsPage";
import { RosterPage } from "./pages/admin/RosterPage";
import { AcademicYearPage } from "./pages/admin/AcademicYearPage";

// Every role gets the same shell, an overview and announcements; admins get four extra pages.
const ADMIN_PAGES = [
  ["people", PeoplePage],
  ["invitations", InvitationsPage],
  ["roster", RosterPage],
  ["academic-year", AcademicYearPage],
];

function roleRoutes(role) {
  return (
    <Route
      key={role}
      path={ROLE_DASHBOARD_PATH[role]}
      element={
        <ProtectedRoute allowedRoles={[role]}>
          <AppShell />
        </ProtectedRoute>
      }
    >
      <Route index element={<OverviewPage />} />
      <Route path="announcements" element={<AnnouncementsPage />} />
      {role === "ADMIN" && ADMIN_PAGES.map(([path, Page]) => <Route key={path} path={path} element={<Page />} />)}
      <Route path="*" element={<Navigate to={ROLE_DASHBOARD_PATH[role]} replace />} />
    </Route>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/home" element={<RoleRedirect />} />

            {Object.keys(ROLE_DASHBOARD_PATH).map(roleRoutes)}

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
