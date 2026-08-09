import { Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { VerifyPage } from "./pages/VerifyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { AcceptInvitePage } from "./pages/AcceptInvitePage";
import { StudentDashboardPage } from "./pages/dashboards/StudentDashboardPage";
import { StaffDashboardPage } from "./pages/dashboards/StaffDashboardPage";
import { LabAssistantDashboardPage } from "./pages/dashboards/LabAssistantDashboardPage";
import { AdminDashboardPage } from "./pages/dashboards/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/home" element={<RoleRedirect />} />

          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}><StudentDashboardPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/staff" element={
            <ProtectedRoute allowedRoles={["STAFF"]}><StaffDashboardPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/lab-assistant" element={
            <ProtectedRoute allowedRoles={["LAB_ASSISTANT"]}><LabAssistantDashboardPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboardPage /></ProtectedRoute>
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;