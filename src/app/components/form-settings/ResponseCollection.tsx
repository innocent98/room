import { Form, Switch, InputNumber, DatePicker } from "antd";

const { RangePicker } = DatePicker;

export default function ResponseCollection({ settings, onChange }: any) {
  const handleChange = (key: string, value: string | boolean) => {
    onChange({ [key]: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Open/Close Form">
        <Switch
          checked={settings.isOpen}
          onChange={(checked) => handleChange("isOpen", checked)}
        />
      </Form.Item>
      <Form.Item label="Response Limit">
        <InputNumber
          value={settings.responseLimit}
          onChange={(value) => handleChange("responseLimit", value)}
          min={0}
          placeholder="No limit"
        />
      </Form.Item>
      <Form.Item label="Time Limit">
        <RangePicker
          value={[settings.startDate, settings.endDate]}
          onChange={(dates: any) => {
            handleChange("startDate", dates[0]);
            handleChange("endDate", dates[1]);
          }}
          showTime
        />
      </Form.Item>
    </Form>
  );
}
