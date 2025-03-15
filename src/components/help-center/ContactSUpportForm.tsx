import { useState } from "react"
import { Form, Input, Select, Upload, Button, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Option } = Select

export default function ContactSupportForm() {
  const [form] = Form.useForm()
  const [ticketId, setTicketId] = useState<string | null>(null)

  const onFinish = (values: any) => {
    // TODO: Implement actual form submission
    console.log("Form values:", values)
    // Simulate ticket creation
    const mockTicketId = `TICKET-${Math.floor(Math.random() * 10000)}`
    setTicketId(mockTicketId)
    message.success(`Support ticket ${mockTicketId} has been created. We'll get back to you soon.`)
    form.resetFields()
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter your name" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="issueType"
          label="Issue Type"
          rules={[{ required: true, message: "Please select an issue type" }]}
        >
          <Select placeholder="Select an issue type">
            <Option value="technical">Technical Issue</Option>
            <Option value="billing">Billing Question</Option>
            <Option value="feature">Feature Request</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Issue Description"
          rules={[{ required: true, message: "Please describe your issue" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="attachment" label="Attachment" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload name="file" action="/upload.do" listType="text">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Ticket
          </Button>
        </Form.Item>
      </Form>
      {ticketId && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p>Your ticket ID is: {ticketId}</p>
          <p>We'll update you on the progress of your ticket via email.</p>
        </div>
      )}
    </div>
  )
}

