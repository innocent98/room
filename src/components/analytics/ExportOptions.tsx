import { Button, message } from "antd"
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons"

export default function ExportOptions() {
  const handleExport = (format: string) => {
    // TODO: Implement actual export functionality
    message.success(`Exporting analytics as ${format}`)
  }

  return (
    <div className="flex justify-end space-x-4">
      <Button icon={<FilePdfOutlined />} onClick={() => handleExport("PDF")}>
        Export as PDF
      </Button>
      <Button icon={<FileExcelOutlined />} onClick={() => handleExport("Excel")}>
        Export as Excel
      </Button>
    </div>
  )
}

