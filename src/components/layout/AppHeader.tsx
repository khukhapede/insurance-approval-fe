import { Layout, Button, Space, Typography, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

const { Header } = Layout;
const { Text } = Typography;

const roleColor: Record<UserRole, string> = {
  [UserRole.USER]: "blue",
  [UserRole.VERIFIER]: "orange",
  [UserRole.APPROVER]: "green",
};

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text strong style={{ fontSize: 16 }}>
        Insurance Approval System
      </Text>

      <Space>
        {user && (
          <>
            <Text type="secondary">{user.fullName}</Text>
            <Tag color={roleColor[user.role]}>{user.role}</Tag>
          </>
        )}
        <Button onClick={handleLogout} danger size="small">
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
