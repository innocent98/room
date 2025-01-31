import { Form, Select, Switch } from "antd";

const { Option } = Select;

export default function PrivacyPermissions({ settings, onChange }: any) {
  const handleChange = (key: string, value: string | boolean) => {
    onChange({ [key]: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Who Can Submit?">
        <Select
          value={settings.whoCanSubmit}
          onChange={(value) => handleChange("whoCanSubmit", value)}
        >
          <Option value="anyone">Anyone with the link</Option>
          <Option value="loggedIn">Logged-in users only</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Allow Multiple Submissions">
        <Switch
          checked={settings.allowMultipleSubmissions}
          onChange={(checked) =>
            handleChange("allowMultipleSubmissions", checked)
          }
        />
      </Form.Item>
      <Form.Item label="Enable Captcha for Security">
        <Switch
          checked={settings.enableCaptcha}
          onChange={(checked) => handleChange("enableCaptcha", checked)}
        />
      </Form.Item>
    </Form>
  );
}
