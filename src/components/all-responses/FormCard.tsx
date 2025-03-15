"use client";

import { Card, Tag, Button, Tooltip, Space, message } from "antd";
import {
  BarChartOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CopyOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Link from "next/link";

interface FormCardProps {
  form: {
    id: string;
    title: string;
    creationDate: string;
    status: string;
    responseCount: number;
    description?: string;
  };
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function FormCard({
  form,
  onDelete,
  onDuplicate,
}: FormCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "draft":
        return "blue";
      case "closed":
      case "archived":
        return "gray";
      default:
        return "default";
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/form/${form.id}/view`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // You could use a toast notification here
        message.success("Form link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold mr-2">{form.title}</h3>
            <Tag color={getStatusColor(form.status)}>{form.status}</Tag>
          </div>
          <p className="text-gray-500 text-sm mb-2">
            Created on {new Date(form.creationDate).toLocaleDateString()}
          </p>
          {form.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {form.description}
            </p>
          )}
          <p className="text-sm">
            <strong>{form.responseCount}</strong>{" "}
            {form.responseCount === 1 ? "response" : "responses"}
          </p>
        </div>

        <Space wrap>
          <Tooltip title="View Responses">
            <Link href={`/dashboard/form/${form.id}/responses`}>
              <Button icon={<BarChartOutlined />}>Responses</Button>
            </Link>
          </Tooltip>

          <Tooltip title="Edit Form">
            <Link href={`/dashboard/form/create?draft=${form.id}`}>
              <Button icon={<EditOutlined />}>Edit</Button>
            </Link>
          </Tooltip>

          <Tooltip title="Preview Form">
            <Link href={`/form/${form.id}/view`} target="_blank">
              <Button icon={<EyeOutlined />}>Preview</Button>
            </Link>
          </Tooltip>

          <Tooltip title="Copy Link">
            <Button icon={<LinkOutlined />} onClick={handleCopyLink}>
              Share
            </Button>
          </Tooltip>

          {onDuplicate && (
            <Tooltip title="Duplicate Form">
              <Button
                icon={<CopyOutlined />}
                onClick={() => onDuplicate(form.id)}
              >
                Duplicate
              </Button>
            </Tooltip>
          )}

          {onDelete && (
            <Tooltip title="Delete Form">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(form.id)}
              >
                Delete
              </Button>
            </Tooltip>
          )}
        </Space>
      </div>
    </Card>
  );
}
