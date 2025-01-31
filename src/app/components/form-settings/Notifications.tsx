import { Form, Switch, Button } from "antd";

export default function Notifications({
  settings,
  onChange,
  onWebhookSetup,
}: any) {
  const handleChange = (key: string, value: string | boolean) => {
    onChange({ [key]: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Email Notifications">
        <Switch
          checked={settings.emailNotifications}
          onChange={(checked) => handleChange("emailNotifications", checked)}
        />
      </Form.Item>
      <Form.Item label="Webhook Integration">
        <Button onClick={onWebhookSetup}>
          {settings.webhookUrl ? "Edit Webhook" : "Set Up Webhook"}
        </Button>
      </Form.Item>
    </Form>
  );
}
