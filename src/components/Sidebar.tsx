import React from "react";
import { Layout, Menu } from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

interface SidebarProps {
  selectedKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedKey }) => {
  const navigate = useNavigate();
  return (
    <Sider width={220} style={{ background: "#fff" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 22,
          color: "#fff",
          background: "#1677ff",
          padding: 16,
          margin: 8,
          borderRadius: 8,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        FormReminder
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ borderRight: 0 }}
        items={[
          {
            key: "form-requests",
            icon: <FileTextOutlined />,
            label: "Form Requests",
            onClick: () => navigate("/form-requests"),
          },
          {
            key: "new-request",
            icon: <PlusOutlined />,
            label: "New Request",
            onClick: () => navigate("/new-request"),
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            onClick: () => navigate("/settings"),
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar; 