import { Form, Input, Switch } from "antd";

interface FormSettingsProps {
  formTitle: string;
  formDescription: string;
  setFormTitle: (title: string) => void;
  setFormDesc: (description: string) => void;
  formFields: any[];
}

export default function FormSettings({
  formTitle,
  formDescription,
  setFormTitle,
  setFormDesc,
  formFields,
}: FormSettingsProps) {
  return (
    <Form layout="vertical" className="p-4">
      <h2 className="text-lg font-semibold mb-4">Form Settings</h2>
      <Form.Item label="Form Title">
        <Input
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea
          placeholder="Enter form description"
          rows={4}
          value={formDescription}
          onChange={(e) => setFormDesc(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Allow Multiple Submissions">
        <Switch />
      </Form.Item>
      <Form.Item label="Collect Email Addresses">
        <Switch />
      </Form.Item>
      <Form.Item label="Show Progress Bar">
        <Switch />
      </Form.Item>
      <Form.Item label="Confirmation Message">
        <Input.TextArea placeholder="Enter confirmation message" rows={4} />
      </Form.Item>
    </Form>
  );
}
