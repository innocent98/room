import { Form, Input, Switch } from "antd";

export default function GeneralSettings({ settings, onChange }: any) {
  const handleChange = (key: string, value: string) => {
    onChange({ [key]: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Form Title">
        <Input
          value={settings.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea
          value={settings.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
        />
      </Form.Item>
      <Form.Item label="Custom URL">
        <Input
          value={settings.customUrl}
          onChange={(e) => handleChange("customUrl", e.target.value)}
          addonBefore="https://room.com/forms/"
        />
      </Form.Item>
      <Form.Item label="Theme">
        <Switch
          checked={settings.theme === "dark"}
          onChange={(checked) =>
            handleChange("theme", checked ? "dark" : "light")
          }
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </Form.Item>
    </Form>
  );
}
