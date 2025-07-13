import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await fetch("https://form-reminder-backend.abdullahdev098.workers.dev/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
    } catch (e) {
      // ignore errors
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("token_type");
    navigate("/login");
  };

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Button icon={<LogoutOutlined />} type="link" danger onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
};

export default HeaderBar; 