"use client"

import "@ant-design/v5-patch-for-react-19"
import { useState, useEffect } from "react"
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  message,
  Result,
  Spin,
} from "antd"
import { usePathname, useRouter } from "next/navigation"

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography
const { TextArea } = Input
const { Group: RadioGroup } = Radio
const { Group: CheckboxGroup } = Checkbox

export default function FormView() {
  const path = usePathname()
  const formId = path.split("/")[3]

  const [form] = Form.useForm()
  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/forms/${formId}/view`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Form not found")
          } else {
            throw new Error("Failed to fetch form")
          }
          return
        }

        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error("Error fetching form:", error)
        setError("Failed to load form. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFormData()
  }, [formId])

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true)

      const response = await fetch(`/api/forms/${formId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit form")
      }

      message.success("Form submitted successfully!")
      setSubmitted(true)
    } catch (error) {
      // console.error("Error submitting form:", error)
      message.error(error instanceof Error ? error.message : "Failed to submit form. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormField = (field: any) => {
    switch (field.type) {
      case "text":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Please enter ${field.label.toLowerCase()}`,
              },
            ]}
          >
            <Input placeholder={field.placeholder} />
          </Form.Item>
        )

      case "email":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Please enter ${field.label.toLowerCase()}`,
              },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder={field.placeholder} />
          </Form.Item>
        )

      case "textarea":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Please enter ${field.label.toLowerCase()}`,
              },
            ]}
          >
            <TextArea rows={4} placeholder={field.placeholder} />
          </Form.Item>
        )

      case "radio":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[{ required: field.required, message: "Please select an option" }]}
          >
            <RadioGroup>
              {field.options.map((option: string, index: number) => (
                <Radio key={index} value={option}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          </Form.Item>
        )

      case "checkbox":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: "Please select at least one option",
              },
            ]}
          >
            <CheckboxGroup options={field.options} />
          </Form.Item>
        )

      case "dropdown":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[{ required: field.required, message: "Please select an option" }]}
          >
            <Select placeholder={field.placeholder || "Select an option"}>
              {field.options.map((option: string, index: number) => (
                <Select.Option key={index} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )

      case "date":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[{ required: field.required, message: "Please select a date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        )

      case "number":
        return (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            rules={[
              {
                required: field.required,
                message: `Please enter ${field.label.toLowerCase()}`,
              },
              { type: "number", message: "Please enter a valid number" },
            ]}
          >
            <Input type="number" placeholder={field.placeholder} />
          </Form.Item>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12">
              <Spin size="large" />
              <div className="mt-4">Loading form...</div>
            </div>
          </div>
        </Content>
      </Layout>
    )
  }

  if (error || !formData) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="404"
              title="Form Not Found"
              subTitle={error || "Sorry, the form you are looking for does not exist."}
              extra={
                <Button type="primary" onClick={() => router.push("/")}>
                  Back Home
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    )
  }

  if (submitted) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="success"
              title="Form Submitted Successfully!"
              subTitle="Thank you for your submission. Your response has been recorded."
              extra={[
                <Button key="home" onClick={() => router.push("/")}>
                  Back Home
                </Button>,
                <Button
                  key="another"
                  type="primary"
                  onClick={() => {
                    setSubmitted(false)
                    form.resetFields()
                  }}
                >
                  Submit Another Response
                </Button>,
              ]}
            />
          </div>
        </Content>
      </Layout>
    )
  }

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <Title level={4} className="m-0">
            {formData.title}
          </Title>
        </div>
      </Header>
      <Content className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <Paragraph>{formData.description}</Paragraph>
            <Paragraph className="text-gray-500">Created by: {formData.createdBy}</Paragraph>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              {formData.fields.map(renderFormField)}

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" loading={submitting} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
      <Footer className="text-center">
        <div className="text-gray-500">Powered by ROOM Form Builder</div>
      </Footer>
    </Layout>
  )
}

