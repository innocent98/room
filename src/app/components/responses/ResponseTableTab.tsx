import { useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { EyeOutlined, DeleteOutlined, FlagOutlined } from "@ant-design/icons";

export default function ResponsesTableTab({
  responses,
  loading,
  filters,
}: any) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    {
      title: "Respondent",
      dataIndex: "respondent",
      key: "respondent",
      sorter: (a: any, b: any) => a.respondent.localeCompare(b.respondent),
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a: any, b: any) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Question 1",
      dataIndex: ["answers", "q1"],
      key: "q1",
    },
    {
      title: "Question 2",
      dataIndex: ["answers", "q2"],
      key: "q2",
    },
    {
      title: "Question 3",
      dataIndex: ["answers", "q3"],
      key: "q3",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this response?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} className="ml-2" />
          </Popconfirm>
          <Button
            icon={<FlagOutlined />}
            onClick={() => handleFlagAsSpam(record.id)}
            className="ml-2"
          />
        </span>
      ),
    },
  ];

  const handleViewDetails = (record: string) => {
    // TODO: Implement view details functionality
    console.log("View details:", record);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete response:", id);
    message.success("Response deleted successfully");
  };

  const handleFlagAsSpam = (id: string) => {
    // TODO: Implement flag as spam functionality
    console.log("Flag as spam:", id);
    message.success("Response flagged as spam");
  };

  const onSelectChange = (newSelectedRowKeys: []) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Apply filters
  const filteredResponses = responses.filter((response: any) => {
    const matchesKeyword = filters.keyword
      ? Object.values(response.answers).some((answer: any) =>
          answer
            .toString()
            .toLowerCase()
            .includes(filters.keyword.toLowerCase())
        )
      : true;
    const matchesDateRange = filters.dateRange
      ? new Date(response.timestamp) >= filters.dateRange[0] &&
        new Date(response.timestamp) <= filters.dateRange[1]
      : true;
    const matchesUser = filters.user
      ? response.respondent.toLowerCase().includes(filters.user.toLowerCase())
      : true;
    // Add more filter conditions as needed

    return matchesKeyword && matchesDateRange && matchesUser;
  });

  return (
    <Table
      rowSelection={rowSelection as any}
      columns={columns}
      dataSource={filteredResponses}
      rowKey="id"
      loading={loading}
    />
  );
}
