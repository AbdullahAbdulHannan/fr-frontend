import React, { useEffect, useState } from "react";
import { Layout, Menu, Table, Button, Typography, Empty, Spin } from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../main";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

interface FormRequest {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  nextReminder: string;
}

const FormRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<FormRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    // Fetch form requests from backend
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/form-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Map backend fields to frontend fields
        const mapped = res.data.map((req: any) => ({
          id: req.id,
          title: req.form_name,
          dueDate: req.created_at || "",
          // You can add more fields if needed
        }));
        setRequests(mapped);
      } catch (err) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created At",
      dataIndex: "dueDate",
      key: "dueDate",
    },
  ];

  console.log("requests:", requests);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="form-requests" />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: "24px 16px 0", minHeight: 280 }}>
          <Title level={4}>Your Form Requests</Title>
          {loading ? (
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Spin size="large" />
            </div>
          ) : requests.length > 0 ? (
            <Table
              dataSource={requests}
              columns={columns}
              rowKey="id"
              pagination={false}
              style={{ background: "#fff", borderRadius: 8 }}
              onRow={(record) => ({
                onClick: () => navigate(`/form-requests/${record.id}`),
                style: { cursor: "pointer" },
              })}
            />
          ) : (
            <Empty
              description={
                <>
                  <div style={{ marginBottom: 8 }}>
                    You haven’t created any Form Requests to send reminders.
                  </div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/new-request")}>Create a New Request</Button>
                </>
              }
              style={{ marginTop: 48 }}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default FormRequestsPage; 