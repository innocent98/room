"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import {
  Layout,
  Tabs,
  Button,
  Dropdown,
  message,
  MenuProps,
  TabsProps,
} from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import FiltersAndSearch from "../../components/responses/FiltersAndSearch";
import ResponsesTableTab from "../../components/responses/ResponseTableTab";
import SummaryTab from "../../components/responses/SummaryTab";
import { useSearchParams } from "next/navigation";

const { Header, Content, Footer } = Layout;

export default function ResponseDataPage() {
  const param = useSearchParams();

  const [formName, setFormName] = useState<string | null>("Untitled Form");
  const [responses, setResponses] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    dateRange: null,
    user: "",
    answerType: "",
  });

  useEffect(() => {
    // TODO: Fetch form name and responses from API
    // For now, we'll use mock data
    const formTitle = param.get("form");
    setFormName(formTitle);
    setResponses([
      // Mock response data
      {
        id: 1,
        respondent: "John Doe",
        timestamp: "2023-05-01T10:00:00Z",
        answers: { q1: "Yes", q2: "Good", q3: 5 },
      },
      {
        id: 2,
        respondent: "Jane Smith",
        timestamp: "2023-05-02T14:30:00Z",
        answers: { q1: "No", q2: "Excellent", q3: 4 },
      },
      // Add more mock responses as needed
    ]);
    setLoading(false);
  }, []);

  const handleExport = (type: string) => {
    // TODO: Implement export functionality
    message.success(`Exporting as ${type}`);
  };

  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword });
  };

  const handleFilterChange = (newFilters: []) => {
    setFilters({ ...filters, ...newFilters });
  };

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
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "summary",
      label: "Summary",
      children: <SummaryTab responses={responses} loading={loading} />,
    },
    {
      key: "table",
      label: "Responses Table",
      children: (
        <ResponsesTableTab
          responses={responses}
          loading={loading}
          filters={filters}
        />
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/responses">
            <Button icon={<ArrowLeftOutlined />} className="mr-4">
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Responses for {formName}</h1>
        </div>
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button type="primary" icon={<DownloadOutlined />}>
            Export
          </Button>
        </Dropdown>
      </Header>
      <Content className="p-6">
        <FiltersAndSearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <Tabs defaultActiveKey="summary" className="mt-4" items={tabItems} />
      </Content>
      <Footer className="text-center">
        <Button type="link" href="/help/data-interpretation">
          Help Center: Data Interpretation
        </Button>
      </Footer>
    </Layout>
  );
}
