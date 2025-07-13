// components/AuthForm.tsx

import React from "react";
import { Form, Input, Button, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  SafetyOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Link } = Typography;

type AuthFormMode = "login" | "register" | "forgot";

interface AuthFormProps {
  mode: AuthFormMode;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const modeConfig = {
    login: {
      title: "Login",
      button: "Login",
      fields: ["email", "password"],
      icon: <LoginOutlined style={{ fontSize: 40, color: "#1890ff" }} />,
      bottomLinks: (
        <>
          <span>Don't have an account? </span>
          <Link onClick={() => navigate("/register")}>Register</Link>
          <span> | </span>
          <Link onClick={() => navigate("/forgot-password")} style={{ color: "#faad14" }}>
            Forgot Password?
          </Link>
        </>
      ),
    },
    register: {
      title: "Register",
      button: "Register",
      fields: ["email", "password"],
      icon: <UserOutlined style={{ fontSize: 40, color: "#1890ff" }} />,
      bottomLinks: (
        <>
          <span>Already have an account? </span>
          <Link onClick={() => navigate("/login")}>Login</Link>
        </>
      ),
    },
    forgot: {
      title: "Forgot Password",
      button: "Send Reset Link",
      fields: ["email"],
      icon: <SafetyOutlined style={{ fontSize: 40, color: "#faad14" }} />,
      bottomLinks: (
        <>
          <span>Remembered your password? </span>
          <Link onClick={() => navigate("/login")}>Login</Link>
        </>
      ),
    },
  };

  const config = modeConfig[mode];

  const handleFinish = async (values: any) => {
    await onSubmit(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-4">{config.icon}</div>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          {config.title}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          {config.fields.includes("email") && (
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email address!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@email.com"
              />
            </Form.Item>
          )}

          {config.fields.includes("password") && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {config.button}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 text-sm">{config.bottomLinks}</div>
      </div>
    </div>
  );
};
