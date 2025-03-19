"use client";

import { useState, useEffect } from "react";
import { Table, Button, Pagination, Empty, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface ResponsesTableTabProps {
  formId: string;
  formFields: any[];
  loading: boolean;
  filters: {
    keyword: string;
    dateRange: any;
    answerType: string;
  };
}

export default function ResponsesTableTab({
  formId,
  formFields,
  loading,
  filters,
}: ResponsesTableTabProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, [formId, pagination.current, pagination.pageSize, filters]);

  const fetchResponses = async () => {
    try {
      setTableLoading(true);

      // Build query params
      const queryParams = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      });

      if (filters.keyword) {
        queryParams.append("search", filters.keyword);
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        queryParams.append("startDate", filters.dateRange[0].toISOString());
        queryParams.append("endDate", filters.dateRange[1].toISOString());
      }

      if (filters.answerType) {
        queryParams.append("answerType", filters.answerType);
      }

      const response = await fetch(
        `/api/forms/${formId}/responses/list?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch responses");
      }

      const data = await response.json();
      setResponses(data.responses);
      setPagination({
        ...pagination,
        total: data.pagination.total,
      });
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize,
    });
  };

  const handleViewResponse = (responseId: string) => {
    router.push(`/dashboard/form/${formId}/responses/${responseId}`);
  };

  // Create columns for the table based on form fields
  const columns = [
    {
      title: "Submission Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
      width: 180,
    },
    ...formFields
      .filter((field: any) => !["file", "textarea"].includes(field.type))
      .slice(0, 3) // Only show first 3 fields in the table
      .map((field: any) => ({
        title: field.label,
        dataIndex: ["answers", field.id, "value"],
        key: field.id,
        render: (value: any) => {
          if (field.type.toLowerCase() === "signature" && value) {
            return (
              <img
                src={value}
                alt="Signature"
                style={{ width: 100, height: 50 }}
              />
            );
          }

          if (Array.isArray(value)) {
            return value.join(", ");
          }

          return value || "-";
        },
        ellipsis: true,
      })),
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewResponse(record.id)}
        />
      ),
    },
  ];

  if (loading || tableLoading) {
    return (
      <div className="text-center py-12">
        <Spin size="large" />
        <div className="mt-4">Loading responses...</div>
      </div>
    );
  }

  if (responses.length === 0) {
    return <Empty description="No responses match your search criteria" />;
  }

  return (
    <div>
      <Table
        dataSource={responses}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <div className="mt-4 flex justify-end">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  );
}
