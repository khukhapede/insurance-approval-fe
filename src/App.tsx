import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

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
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route path="claims" element={<MyClaimsPage />} />
            <Route path="claims/submit" element={<SubmitClaimPage />} />
            <Route path="claims/:id" element={<ClaimDetailPage />} />
            <Route path="claims/:id/edit" element={<EditClaimPage />} />

            <Route
              path="verifier/dashboard"
              element={<VerifierDashboardPage />}
            />
            <Route path="claims/submitted" element={<SubmittedClaimsPage />} />

            <Route
              path="approver/dashboard"
              element={<ApproverDashboardPage />}
            />
            <Route path="claims/verified" element={<VerifiedClaimsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </AntApp>
  );
};

export default App;
