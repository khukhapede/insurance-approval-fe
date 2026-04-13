import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import RoleRoute from "@/components/RoleRoute";

import { Routes, Route, Navigate } from "react-router-dom";
import { App as AntApp } from "antd";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import UserDashboardPage from "@/pages/user/UserDashboardPage";
import MyClaimsPage from "@/pages/user/MyClaimsPage";
import SubmitClaimPage from "@/pages/user/SubmitClaimPage";
import ClaimDetailPage from "@/pages/user/ClaimDetailPage";
import EditClaimPage from "@/pages/user/EditClaimPage";

import VerifierDashboardPage from "@/pages/verifier/VerifierDashboardPage";
import SubmittedClaimsPage from "@/pages/verifier/SubmittedClaimsPage";

import ApproverDashboardPage from "@/pages/approver/ApproverDashboardPage";
import VerifiedClaimsPage from "@/pages/approver/VerifiedClaimsPage";

import ClaimReviewPage from "@/pages/staff/ClaimReviewPage";
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === UserRole.VERIFIER)
    return <Navigate to="/verifier/dashboard" replace />;
  if (user?.role === UserRole.APPROVER)
    return <Navigate to="/approver/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  return (
    <AntApp>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — all share MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route index element={<Navigate to="/dashboard" replace />} /> */}
            <Route index element={<DashboardRedirect />} />
            {/* User only routes */}
            <Route
              path="dashboard"
              element={
                <RoleRoute allowedRoles={[UserRole.USER]}>
                  <UserDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="claims"
              element={
                <RoleRoute allowedRoles={[UserRole.USER]}>
                  <MyClaimsPage />
                </RoleRoute>
              }
            />
            <Route
              path="claims/submit"
              element={
                <RoleRoute allowedRoles={[UserRole.USER]}>
                  <SubmitClaimPage />
                </RoleRoute>
              }
            />
            <Route
              path="claims/:id"
              element={
                <RoleRoute allowedRoles={[UserRole.USER]}>
                  <ClaimDetailPage />
                </RoleRoute>
              }
            />
            <Route
              path="claims/:id/edit"
              element={
                <RoleRoute allowedRoles={[UserRole.USER]}>
                  <EditClaimPage />
                </RoleRoute>
              }
            />

            {/* Verifier only routes */}
            <Route
              path="verifier/dashboard"
              element={
                <RoleRoute allowedRoles={[UserRole.VERIFIER]}>
                  <VerifierDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="claims/submitted"
              element={
                <RoleRoute allowedRoles={[UserRole.VERIFIER]}>
                  <SubmittedClaimsPage />
                </RoleRoute>
              }
            />

            {/* Approver only routes */}
            <Route
              path="approver/dashboard"
              element={
                <RoleRoute allowedRoles={[UserRole.APPROVER]}>
                  <ApproverDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="claims/verified"
              element={
                <RoleRoute allowedRoles={[UserRole.APPROVER]}>
                  <VerifiedClaimsPage />
                </RoleRoute>
              }
            />

            {/* Staff routes */}
            <Route
              path="staff/claims/:id"
              element={
                <RoleRoute
                  allowedRoles={[UserRole.VERIFIER, UserRole.APPROVER]}
                >
                  <ClaimReviewPage />
                </RoleRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </AntApp>
  );
};

export default App;
