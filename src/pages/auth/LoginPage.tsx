import { Form, Input, Button, Card, Typography, App } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { LoginDto } from "@/types";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { notification } = App.useApp();

  const handleSubmit = async (values: LoginDto) => {
    try {
      await login(values);
      notification.success({ message: "Welcome back!" });
      navigate("/");
    } catch {
      notification.error({
        message: "Login failed",
        description: "Invalid email or password.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 380, borderRadius: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            Insurance Approval System
          </Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Enter your username" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block size="large">
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">Don't have an account? </Text>
          <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
