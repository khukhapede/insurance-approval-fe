import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

// const menuByRole = {
//   [UserRole.USER]: [
//     { key: "/dashboard", label: "Dashboard" },
//     { key: "/claims", label: "My Claims" },
//     { key: "/claims/submit", label: "Submit Claim" },
//   ],
//   [UserRole.VERIFIER]: [
//     { key: "/dashboard", label: "Dashboard" },
//     { key: "/claims/pending", label: "Pending Claims" },
//     { key: "/claims", label: "All Claims" },
//   ],
//   [UserRole.APPROVER]: [
//     { key: "/dashboard", label: "Dashboard" },
//     { key: "/claims/verified", label: "Claims to Approve" },
//     { key: "/claims", label: "All Claims" },
//     { key: "/users", label: "Users" },
//   ],
// };

const menuByRole = {
  [UserRole.USER]: [
    { key: "/dashboard", label: "Dashboard" },
    { key: "/claims", label: "My Claims" },
    { key: "/claims/submit", label: "Submit Claim" },
  ],
  [UserRole.VERIFIER]: [
    { key: "/verifier/dashboard", label: "Dashboard" },
    { key: "/claims/submitted", label: "Submitted Claims" },
  ],
  [UserRole.APPROVER]: [
    { key: "/approver/dashboard", label: "Dashboard" },
    { key: "/claims/verified", label: "Verified Claims" },
  ],
};

const AppSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = menuByRole[user.role] ?? [];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: "100%", borderRight: 0 }}
      items={items}
      onClick={({ key }) => navigate(key)}
    />
  );
};

export default AppSidebar;
