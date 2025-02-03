import { Card, Button, Badge, Tooltip } from "antd";
import {
  EyeOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";

interface FormCardProps {
  form: {
    id: number;
    title: string;
    creationDate: string;
    status: string;
    responseCount: number;
  };
}

export default function FormCard({ form }: FormCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "closed":
        return "red";
      case "archived":
        return "gray";
      default:
        return "blue";
    }
  };

  return (
    <Card
      hoverable
      className="w-full transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold mb-2">{form.title}</h2>
          <p className="text-sm text-gray-500 mb-2">
            Created on: {form.creationDate}
          </p>
          <Badge
            status={getStatusColor(form.status) as any}
            text={form.status}
          />
        </div>
        <div className="text-right">
          <p className="text-lg font-bold mb-2">{form.responseCount}</p>
          <p className="text-sm text-gray-500">Responses</p>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Tooltip title="View Responses">
          <Link href={`/responses/${form.id}?form=${form.title}`}>
            <Button icon={<EyeOutlined />} className="mr-2">
              Responses
            </Button>
          </Link>
        </Tooltip>
        <Tooltip title="View Analytics">
          <Link href={`/analytics/${form.id}?form=${form.title}`}>
            <Button icon={<BarChartOutlined />} className="mr-2">
              Analytics
            </Button>
          </Link>
        </Tooltip>
        <Tooltip title="Form Settings">
          <Link href={`/settings/${form.id}?form=${form.title}`}>
            <Button icon={<SettingOutlined />}>Settings</Button>
          </Link>
        </Tooltip>
      </div>
    </Card>
  );
}
