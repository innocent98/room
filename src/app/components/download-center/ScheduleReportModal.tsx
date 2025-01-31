import { Modal, Form, Select, DatePicker, TimePicker, Button } from "antd"

const { Option } = Select

export default function ScheduleReportModal({ visible, onClose, onSchedule }) {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSchedule(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title="Schedule Report"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Schedule
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="frequency"
          label="Frequency"
          rules={[{ required: true, message: "Please select a frequency" }]}
        >
          <Select>
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name="time" label="Time" rules={[{ required: true, message: "Please select a time" }]}>
          <TimePicker format="HH:mm" className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

