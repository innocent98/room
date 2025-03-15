"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Layout, Typography, Button, Spin, Result, Card, Tabs, Dropdown, type MenuProps, message } from "antd"
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FilePdfOutlined,
} from "@ant-design/icons"
import Link from "next/link"
import FiltersAndSearch from "@/components/responses/FiltersAndSearch"
import ResponsesTableTab from "@/components/responses/ResponseTableTab"
import SummaryTab from "@/components/responses/SummaryTab"

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

export default function FormResponses() {
  const path = usePathname()
  const formId = path.split("/")[2]
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [filters, setFilters] = useState({
    keyword: "",
    dateRange: null,
    answerType: "",
  })

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Form not found")
          } else if (response.status === 401) {
            setError("Unauthorized")
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

  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword })
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
  }

  const handleExport = (type: string) => {
    switch (type) {
      case "Excel":
        exportToExcel()
        break
      case "CSV":
        exportToCSV()
        break
      case "PDF":
        exportToPDF()
        break
    }
  }

  const exportToCSV = async () => {
    try {
      // Fetch all responses for export
      const response = await fetch(`/api/forms/${formId}/responses/list?limit=1000`)

      if (!response.ok) {
        throw new Error("Failed to fetch responses for export")
      }

      const data = await response.json()
      const responses = data.responses

      if (!formData || !responses.length) return

      // Get all field labels to use as headers
      const fields = formData.fields
      const headers = fields.map((field: any) => field.label)

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,"

      // Add headers
      csvContent += headers.join(",") + "\n"

      // Add rows
      responses.forEach((response: any) => {
        const row = fields.map((field: any) => {
          const answer = response.answers[field.id]
          if (!answer) return ""

          let value = answer.value

          // Format array values
          if (Array.isArray(value)) {
            value = value.join("; ")
          }

          // Escape commas and quotes
          if (typeof value === "string") {
            if (value.includes(",") || value.includes('"')) {
              value = `"${value.replace(/"/g, '""')}"`
            }
          }

          return value || ""
        })

        csvContent += row.join(",") + "\n"
      })

      // Create download link
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `${formData.title}_responses.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      message.success("Responses exported successfully as CSV")
    } catch (error) {
      console.error("Error exporting responses:", error)
      message.error("Failed to export responses")
    }
  }

  const exportToExcel = () => {
    message.info("Excel export functionality coming soon")
  }

  const exportToPDF = () => {
    message.info("PDF export functionality coming soon")
  }

  if (error) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-6xl mx-auto">
            <Result
              status={error.includes("Unauthorized") ? "403" : "404"}
              title={error.includes("Unauthorized") ? "Unauthorized" : "Not Found"}
              subTitle={error}
              extra={
                <Button type="primary" onClick={() => router.push("/responses")}>
                  Back to All Responses
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    )
  }

  if (!formData) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <Spin size="large" />
              <div className="mt-4">Loading form...</div>
            </div>
          </div>
        </Content>
      </Layout>
    )
  }

  const items: MenuProps["items"] = [
    {
      key: "excel",
      icon: <FileExcelOutlined />,
      label: "Download as Excel (.xlsx)",
      onClick: () => handleExport("Excel"),
    },
    {
      key: "csv",
      icon: <FileTextOutlined />,
      label: "Download as CSV",
      onClick: () => handleExport("CSV"),
    },
    {
      key: "pdf",
      icon: <FilePdfOutlined />,
      label: "Generate Report (PDF)",
      onClick: () => handleExport("PDF"),
    },
  ]

  const tabItems = [
    {
      key: "summary",
      label: "Summary",
      children: <SummaryTab formId={formId} loading={loading} />,
    },
    {
      key: "table",
      label: "Responses Table",
      children: <ResponsesTableTab formId={formId} formFields={formData.fields} loading={loading} filters={filters} />,
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/responses" className="mr-4">
              <Button icon={<ArrowLeftOutlined className="h-4 w-4" />}>Back to All Forms</Button>
            </Link>
            <Title level={4} className="m-0">
              {formData.title} - Responses
            </Title>
          </div>
          <Dropdown menu={{ items }} placement="bottomRight">
            <Button type="primary" icon={<DownloadOutlined className="h-4 w-4 mr-1" />}>
              Export
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Content className="p-6">
        <div className="max-w-6xl mx-auto">
          <FiltersAndSearch onSearch={handleSearch} onFilterChange={handleFilterChange} />
          <Card className="mt-4">
            <Tabs defaultActiveKey="summary" items={tabItems} />
          </Card>
        </div>
      </Content>
      <Footer className="text-center">
        <Button type="link" href="/help/data-interpretation">
          Help Center: Data Interpretation
        </Button>
      </Footer>
    </Layout>
  )
}

