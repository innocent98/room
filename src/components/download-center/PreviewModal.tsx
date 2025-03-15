import { useState, useEffect } from "react"
import { Modal, Table } from "antd"

export default function PreviewModal({ visible, onClose, selectedColumns, dateRange, filters }:any) {
  const [previewData, setPreviewData] = useState<any>([])

  useEffect(() => {
    if (visible) {
      // TODO: Fetch preview data based on selected options
      // This is mock data for demonstration
      setPreviewData([
        { id: 1, respondent: "John Doe", timestamp: "2023-05-01T10:00:00Z", q1: "Yes", q2: "Good", q3: 5 },
        { id: 2, respondent: "Jane Smith", timestamp: "2023-05-02T14:30:00Z", q1: "No", q2: "Excellent", q3: 4 },
        // Add more mock data as needed
      ])
    }
  }, [visible])

  const columns = selectedColumns.map((col:any) => ({
    title: col.charAt(0).toUpperCase() + col.slice(1),
    dataIndex: col,
    key: col,
  }))

  return (
    <Modal title="Data Preview" open={visible} onCancel={onClose} width={800} footer={null}>
      <Table dataSource={previewData} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
    </Modal>
  )
}

