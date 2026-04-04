import { Button, Typography } from "antd";
import { useAuth } from "@/contexts/AuthContext";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 32 }}>
      <Title level={3}>Welcome, {user?.fullName}!</Title>
      <Text type="secondary">Role: {user?.role}</Text>
      <br />
      <br />
      <Button onClick={logout} danger>
        Logout
      </Button>
    </div>
  );
};

export default DashboardPage;
