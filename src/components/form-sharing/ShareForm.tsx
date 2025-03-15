"use client";

import { useState } from "react";
import { Modal, Input, Button, Tabs, Switch, Form, message } from "antd";
import { CopyOutlined, MailOutlined, LinkOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

interface ShareFormProps {
  visible: boolean;
  onClose: () => void;
  formId: string;
  formTitle: string;
}

export default function ShareForm({
  visible,
  onClose,
  formId,
  formTitle,
}: ShareFormProps) {
  const [form] = Form.useForm();
  const shareLink = `${process.env.NEXT_PUBLIC_URL}/dashboard/form/${formId}/view`;

  const [allowAnonymous, setAllowAnonymous] = useState(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    message.success("Link copied to clipboard!");
  };

  const handleSendEmail = (values: any) => {
    // In a real app, call your API to send the email
    console.log("Sending email to:", values.emails);
    message.success("Invitation emails sent successfully!");
    form.resetFields();
  };

  const handleEmbedCode = () => {
    const embedCode = `<iframe src="${shareLink}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    message.success("Embed code copied to clipboard!");
  };

  const handlePrivacyChange = (checked: boolean) => {
    setAllowAnonymous(checked);
    // In a real app, update the form settings via API
  };

  return (
    <Modal
      title={`Share: ${formTitle}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Tabs defaultActiveKey="link">
        <TabPane tab="Share Link" key="link" icon={<LinkOutlined />}>
          <div className="mb-4">
            <p>Anyone with this link can view and submit the form:</p>
            <div className="flex mt-2">
              <Input value={shareLink} readOnly className="mr-2" />
              <Button icon={<CopyOutlined />} onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2">Privacy Settings:</p>
            <div className="flex items-center">
              <Switch
                checked={allowAnonymous}
                onChange={handlePrivacyChange}
                className="mr-2"
              />
              <span>Allow anonymous responses</span>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Email" key="email" icon={<MailOutlined />}>
          <Form form={form} layout="vertical" onFinish={handleSendEmail}>
            <Form.Item
              name="emails"
              label="Email Addresses"
              rules={[
                {
                  required: true,
                  message: "Please enter at least one email address",
                },
              ]}
              extra="Enter email addresses separated by commas"
            >
              <Input.TextArea
                rows={4}
                placeholder="example1@email.com, example2@email.com"
              />
            </Form.Item>
            <Form.Item name="message" label="Message (Optional)">
              <Input.TextArea
                rows={3}
                placeholder="Add a personal message"
                defaultValue={`I'd like to share the "${formTitle}" form with you.`}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Invitations
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Embed" key="embed" icon={<CopyOutlined />}>
          <p>Embed this form on your website:</p>
          <div className="mt-2 mb-4">
            <Input.TextArea
              rows={4}
              readOnly
              value={`<iframe src="${shareLink}" width="100%" height="600" frameborder="0"></iframe>`}
            />
          </div>
          <Button onClick={handleEmbedCode}>Copy Embed Code</Button>
        </TabPane>
      </Tabs>
    </Modal>
  );
}
