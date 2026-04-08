import { Form, Input, Button, Card, Typography, App } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from '@/contexts/ThemeContext';
import type { LoginDto } from "@/types";
import { useState } from "react";

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login } = useAuth();
   const { themeMode } = useTheme();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
         background: themeMode === 'dark' ? '#141414' : '#f5f5f5',
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
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
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
