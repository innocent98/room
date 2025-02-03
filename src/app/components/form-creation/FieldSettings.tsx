import { Form, Input, Switch, Button, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Field } from "@/constants/types";

interface FieldSettingsProps {
  field: Field;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  deleteField: (fieldId: string) => void;
}

export default function FieldSettings({
  field,
  updateField,
  deleteField,
}: FieldSettingsProps) {
  const handleChange = (key: string, value: unknown) => {
    updateField(field.id, { [key]: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    handleChange("options", newOptions);
  };

  const addOption = () => {
    const newOptions = [...(field.options || []), ""];
    handleChange("options", newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    handleChange("options", newOptions);
  };

  return (
    <Form layout="vertical" className="p-4">
      <h2 className="text-lg font-semibold mb-4">Field Settings</h2>
      <Form.Item label="Field Label">
        <Input
          key={field.label}
          defaultValue={field.label}
          onChange={(e) => handleChange("label", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Placeholder">
        <Input
          key={field.placeholder}
          defaultValue={field.placeholder}
          onChange={(e) => handleChange("placeholder", e.target.value)}
          placeholder="Enter placeholder text"
        />
      </Form.Item>
      <Form.Item label="Required">
        <Switch
          key={field.required ? "true" : "false"}
          defaultValue={field.required}
          onChange={(checked) => handleChange("required", checked)}
        />
      </Form.Item>

      {["dropdown", "radio", "checkbox", "multiselect"].includes(
        field.type
      ) && (
        <Form.Item label="Options">
          {field.options.map((option: string, index: number) => (
            <Space key={index} className="mb-2 w-full">
              <Input
                key={option}
                defaultValue={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow"
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => removeOption(index)}
                danger
              />
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={addOption}
            block
            icon={<PlusOutlined />}
          >
            Add Option
          </Button>
        </Form.Item>
      )}

      <Form.Item>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteField(field.id)}
        >
          Delete Field
        </Button>
      </Form.Item>
    </Form>
  );
}
