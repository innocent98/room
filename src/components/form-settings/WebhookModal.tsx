import { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

export default function WebhookModal({
  visible,
  onCancel,
  onSave,
  initialUrl,
}: any) {
  const [form] = Form.useForm();
  const [url, setUrl] = useState(initialUrl || "");

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ url: initialUrl || "" });
    }
  }, [visible, initialUrl, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values.url);
    });
  };

  return (
    <Modal
      title="Set Up Webhook"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="url"
          label="Webhook URL"
          rules={[
            { required: true, message: "Please enter a webhook URL" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input
            placeholder="https://example.com/webhook"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
