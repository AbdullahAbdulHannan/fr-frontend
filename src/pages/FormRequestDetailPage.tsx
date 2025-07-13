import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Table, Tag, Space, Divider, message, Popconfirm, Modal, Form, Input, Layout } from "antd";
import { ArrowLeftOutlined, EditOutlined, SafetyOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL } from "../main";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const FormRequestDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formRequest, setFormRequest] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        // Fetch form request details
        const res = await axios.get(`${baseURL}/form-requests/${id}`, { headers });
        setFormRequest(res.data);
      } catch {
        setFormRequest(null);
      }
      try {
        // Fetch recipients
        const res2 = await axios.get(`${baseURL}/recipients/${id}`, { headers });
        setRecipients(res2.data);
      } catch {
        setRecipients([]);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${baseURL}/form-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Request deleted");
      navigate("/form-requests");
    } catch {
      message.error("Failed to delete request");
    }
  };

  const handleEdit = () => {
    editForm.setFieldsValue({
      form_name: formRequest?.form_name?.trim() || "",
      form_url: formRequest?.form_url?.trim() || "",
      sheet_id: formRequest?.sheet_id?.trim() || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setEditLoading(true);
      const values = await editForm.validateFields();
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`${baseURL}/form-requests/${id}`, values, { headers });
      setFormRequest((prev: any) => ({ ...prev, ...values }));
      setEditModalOpen(false);
      message.success("Request updated!");
    } catch (err: any) {
      message.error(err.response?.data?.error || "Failed to update request.");
    } finally {
      setEditLoading(false);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Submitted?",
      dataIndex: "submission_status",
      key: "submission_status",
      render: (val: string) => val === "submitted" ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>,
      sorter: (a: any, b: any) => (a.submission_status === "submitted" ? 1 : 0) - (b.submission_status === "submitted" ? 1 : 0),
    },
  ];

  // Sort: Submitted=No first, then by Name
  const sortedRecipients = [...recipients].sort((a, b) => {
    if ((a.submission_status === "submitted") === (b.submission_status === "submitted")) {
      return a.name.localeCompare(b.name);
    }
    return (a.submission_status === "submitted" ? 1 : 0) - (b.submission_status === "submitted" ? 1 : 0);
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="form-requests" />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: "24px 16px 0", minHeight: 280 }}>
          <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 8px #f0f1f2" }}>
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/form-requests")}>Back to Form Requests</Button>
              <Button icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>
            </Space>
            <Title level={4} style={{ marginBottom: 0 }}># Form Requests</Title>
            <Title level={5} style={{ marginTop: 0 }}>{formRequest?.form_name || "-"}</Title>
            <Paragraph>
              <b>Form URL:</b> <a href={formRequest?.form_url} target="_blank" rel="noopener noreferrer">{formRequest?.form_url}</a><br />
              <b>Google Sheet:</b> <a href={formRequest?.sheet_id} target="_blank" rel="noopener noreferrer">{formRequest?.sheet_id}</a><br />
              <b>Due Date:</b> {formRequest?.due_date || "-"}<br />
              <b>Reminder Schedule:</b> {formRequest?.reminder_schedule || "-"}<br />
              <b>Status:</b> {formRequest?.stats ? `${formRequest.stats.submitted} of ${formRequest.stats.total_recipients} submitted` : "-"} <SafetyOutlined style={{ color: "#52c41a" }} />
            </Paragraph>
            <Divider orientation="left">Recipients</Divider>
            <Table
              dataSource={sortedRecipients}
              columns={columns}
              rowKey={(row) => row.email}
              pagination={false}
              size="small"
              style={{ background: "#fff", borderRadius: 8 }}
            />
            <div style={{ marginTop: 24 }}>
              <Popconfirm title="Are you sure to cancel this request?" onConfirm={handleDelete} okText="Yes" cancelText="No">
                <Button danger type="default" icon={<DeleteOutlined />}>Cancel Request</Button>
              </Popconfirm>
            </div>
            <Modal
              title="Edit Form Request"
              open={editModalOpen}
              onCancel={() => setEditModalOpen(false)}
              onOk={handleEditSubmit}
              confirmLoading={editLoading}
              okText="Save"
            >
              <Form form={editForm} layout="vertical">
                <Form.Item name="form_name" label="Form Name" rules={[{ required: true, message: "Please enter the form name" }]}> <Input /> </Form.Item>
                <Form.Item name="form_url" label="Form URL" rules={[{ required: true, message: "Please enter the form URL" }]}> <Input /> </Form.Item>
                <Form.Item name="sheet_id" label="Google Sheet ID" rules={[{ required: true, message: "Please enter the Google Sheet ID" }]}> <Input /> </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FormRequestDetailPage; 