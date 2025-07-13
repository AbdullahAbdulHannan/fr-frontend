import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Collapse,
  Radio,
  DatePicker,
  message,
  Space,
  Tooltip,
  Layout,
} from "antd";
import {
  FileTextOutlined,
  LinkOutlined,
  GoogleOutlined,
  CopyOutlined,
  CheckCircleTwoTone,
  UsergroupAddOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../main";
import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Content } = Layout;

const REMINDER_SCHEDULES = [
  { label: "Gentle: 3 and 1 days before due", value: "gentle" },
  { label: "Normal: 5, 3, and 1 days before due", value: "normal" },
  { label: "Frequent: 14, 7, 6, 5, 4, 3, 2, 1 days before due", value: "frequent" },
];

const NewRequestPage: React.FC = () => {
  const [form] = Form.useForm();
  const [showTracking, setShowTracking] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<null | "success" | "error" | "info">(null);
  const [verifyMsg, setVerifyMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Show Submission Tracking after Form URL is entered
  const handleFormUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) setShowTracking(true);
    else setShowTracking(false);
  };

  // Simulate verify sheet (replace with real API call)
  const handleVerifySheet = async () => {
    setVerifying(true);
    setVerifyStatus("info");
    setVerifyMsg("Verifying access to the Google Sheet and column...");
    setTimeout(() => {
      // Simulate success
      setVerifying(false);
      setVerifyStatus("success");
      setVerifyMsg("Success! FormReminder has access to the Sheet, and the column was found. You're ready to create your request.");
    }, 1500);
  };

  // Validate recipients (tab-separated, valid email)
  const validateRecipients = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const lines = value.split("\n");
    for (let line of lines) {
      const parts = line.split("\t");
      if (parts.length !== 3) return Promise.reject("Each row must have 3 tab-separated values: First Name, Last Name, Email");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(parts[2])) return Promise.reject("Invalid email address: " + parts[2]);
    }
    return Promise.resolve();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      // 1. Create form request
      const payload = {
        form_name: values.title,
        form_url: values.formUrl,
        sheet_id: values.sheetUrl,
      };
      const res = await axios.post(`${baseURL}/form-requests`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const formRequestId = res.data.id;
      if (!formRequestId) throw new Error("No form request ID returned");

      // 2. Parse recipients
      const lines = (values.recipients || "").split("\n");
      const recipients = lines
        .map((line: string) => {
          const parts = line.split("\t");
          if (parts.length !== 3) return null;
          return {
            name: `${parts[0]} ${parts[1]}`.trim(),
            email: parts[2].trim(),
          };
        })
        .filter(Boolean);
      if (recipients.length === 0) throw new Error("No valid recipients");

      // 3. Upload recipients
      await axios.post(`${baseURL}/recipients/${formRequestId}`, recipients, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Request and recipients created!");
      navigate("/form-requests");
    } catch (err: any) {
      message.error(err.response?.data?.error || err.message || "Failed to create request or recipients.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="new-request" />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: "24px 16px 0", minHeight: 280 }}>
          <Title level={3} style={{ marginBottom: 24 }}>
            <FileTextOutlined /> Create a New Form Request
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ reminderSchedule: "normal", firstReminder: "immediate" }}
          >
            <Form.Item
              name="title"
              label={<><FileTextOutlined /> Request Title</>}
              rules={[{ required: true, message: "Please enter a request title" }]}
            >
              <Input placeholder="A short name to help you identify this request" />
            </Form.Item>
            <Form.Item
              name="formUrl"
              label={<><LinkOutlined /> Form URL</>}
              rules={[{ required: true, message: "Please enter the form URL" }]}
            >
              <Input placeholder="Paste the link to the online form" onChange={handleFormUrlChange} />
            </Form.Item>
            <Collapse activeKey={showTracking ? ["tracking"] : []} style={{ marginBottom: 16 }}>
              <Panel header={<span><GoogleOutlined /> Submission Tracking</span>} key="tracking">
                <Paragraph>
                  To allow FormReminder to track who has submitted the form, follow the steps below:
                </Paragraph>
                <ol style={{ paddingLeft: 20 }}>
                  <li>
                    <b>Link your form to a Google Sheet.</b> Make sure your Google Form is saving responses to a Google Sheet.<br />
                    <Form.Item name="sheetUrl" label={<><GoogleOutlined /> Google Sheet URL</>} rules={[{ required: true, message: "Please enter the Google Sheet URL" }]} style={{ marginTop: 8 }}>
                      <Input placeholder="Paste the Google Sheet URL here" />
                    </Form.Item>
                  </li>
                  <li style={{ marginTop: 12 }}>
                    <b>Share the Google Sheet with FormReminder’s email account</b>
                    <Space style={{ marginLeft: 8 }}>
                      <Tooltip title="Copy FormReminder Email">
                        <Button icon={<CopyOutlined />} size="small" onClick={() => {navigator.clipboard.writeText("formreminder@example.com"); message.success("Email copied!");}}>Copy FormReminder Email</Button>
                      </Tooltip>
                      <Tooltip title="How to Share"><Button size="small">How to Share</Button></Tooltip>
                    </Space>
                  </li>
                  <li style={{ marginTop: 12 }}>
                    <b>Specify the column name in the Google Sheet that contains the email addresses of the people submitting the form.</b>
                    <Form.Item name="emailColumn" label={<><MailOutlined /> Email column name in Google Sheet</>} rules={[{ required: true, message: "Please enter the column name" }]} style={{ marginTop: 8 }}>
                      <Input placeholder="Email" />
                    </Form.Item>
                  </li>
                  <li style={{ marginTop: 12 }}>
                    <b>Verify access to Sheet</b>
                    <Button type="dashed" loading={verifying} onClick={handleVerifySheet} style={{ marginLeft: 8 }}>
                      <CheckCircleTwoTone twoToneColor="#52c41a" /> Verify Sheet Access
                    </Button>
                    {verifyStatus && (
                      <div style={{ marginTop: 8 }}>
                        {verifyStatus === "success" && <Text type="success">{verifyMsg}</Text>}
                        {verifyStatus === "error" && <Text type="danger">{verifyMsg}</Text>}
                        {verifyStatus === "info" && <Text type="secondary">{verifyMsg}</Text>}
                      </div>
                    )}
                  </li>
                </ol>
              </Panel>
            </Collapse>
            <Form.Item
              name="recipients"
              label={<><UsergroupAddOutlined /> Form Recipients</>}
              rules={[{ required: true, message: "Please paste recipient data" }, { validator: validateRecipients }]}
              extra={<span>Paste names and emails from a spreadsheet. One person per line, tab-separated: First Name, Last Name, Email.</span>}
            >
              <Input.TextArea rows={3} placeholder={"John\tDoe\tjohn@example.com\nJane\tSmith\tjane@example.com"} />
            </Form.Item>
            <Form.Item
              name="dueDate"
              label={<><CalendarOutlined /> Form Request Due Date</>}
              rules={[{ required: true, message: "Please select a due date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="reminderSchedule"
              label={<><ClockCircleOutlined /> Reminder Schedule</>}
              rules={[{ required: true, message: "Please select a reminder schedule" }]}
            >
              <Radio.Group options={REMINDER_SCHEDULES} />
            </Form.Item>
            <Form.Item
              name="firstReminder"
              label={<><ClockCircleOutlined /> First Reminder Timing</>}
              rules={[{ required: true, message: "Please select when to send the first reminder" }]}
            >
              <Radio.Group>
                <Radio value="immediate">Send immediately after creating this request</Radio>
                <Radio value="scheduled">Schedule first reminder for: <DatePicker style={{ marginLeft: 8 }} /></Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                Create Request
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewRequestPage;
