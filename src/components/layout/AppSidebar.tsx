import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  HomeOutlined,
  FileOutlined,
  PlusOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface AppSidebarProps {
  collapsed?: boolean;
}

const menuByRole = {
  [UserRole.USER]: [
    { key: "/dashboard", label: "Dashboard", icon: <HomeOutlined /> },
    { key: "/claims", label: "My Claims", icon: <FileOutlined /> },
    { key: "/claims/submit", label: "Submit Claim", icon: <PlusOutlined /> },
  ],
  [UserRole.VERIFIER]: [
    { key: "/verifier/dashboard", label: "Dashboard", icon: <HomeOutlined /> },
    {
      key: "/claims/submitted",
      label: "Submitted Claims",
      icon: <FileSearchOutlined />,
    },
  ],
  [UserRole.APPROVER]: [
    { key: "/approver/dashboard", label: "Dashboard", icon: <HomeOutlined /> },
    {
      key: "/claims/verified",
      label: "Verified Claims",
      icon: <CheckCircleOutlined />,
    },
  ],
};

const AppSidebar = ({ collapsed }: AppSidebarProps) => {
  const { user } = useAuth();
  const { themeMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const items = menuByRole[user.role] ?? [];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      inlineCollapsed={collapsed}
      style={{
        height: "100%",
        borderRight: 0,
        background: themeMode === "dark" ? "#141414" : "#fff",
      }}
      items={items}
      onClick={({ key }) => navigate(key)}
      theme={themeMode}
    />
  );
};

export default AppSidebar;
