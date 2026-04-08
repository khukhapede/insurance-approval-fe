import { Form, Input, Button, Card, Typography, Select, App } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { UserRole } from "@/types";
import type { RegisterDto } from "@/types";
import { useState } from "react";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { themeMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const { notification } = App.useApp();

  const handleSubmit = async (
    values: RegisterDto & { confirmPassword: string },
  ) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerDto } = values;
      await register(registerDto);
      notification.success({
        message: "Account created!",
        description: "Please log in.",
      });
      navigate("/login");
    } catch {
      notification.error({
        message: "Registration failed",
        description: "Please try again.",
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
        background: themeMode === "dark" ? "#141414" : "#f5f5f5",
      }}
    >
      <Card style={{ width: 380, borderRadius: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>
            Create Account
          </Title>
          <Text type="secondary">Register to get started</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="alice_user" size="large" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input placeholder="Alice User" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "At least 6 characters" },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            initialValue={UserRole.USER}
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select size="large">
              <Select.Option value={UserRole.USER}>User</Select.Option>
              <Select.Option value={UserRole.VERIFIER}>Verifier</Select.Option>
              <Select.Option value={UserRole.APPROVER}>Approver</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
            >
              Create account
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
