"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect, SetStateAction } from "react";
import { Layout, Button, DatePicker, message, Progress } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  HistoryOutlined,
  EyeOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import DataCustomization from "@/components/download-center/DataCustomization";
import ExportSettings from "@/components/download-center/ExportSettings";
import FileFormatSelection from "@/components/download-center/FileFormatSelection";
import PreviewModal from "@/components/download-center/PreviewModal";
import ScheduleReportModal from "@/components/download-center/ScheduleReportModal";

const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;

export default function DownloadCenter() {
  const [formName, setFormName] = useState("Untitled Form");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState<any>([]);
  const [filters, setFilters] = useState({
    allResponses: true,
    removeDuplicates: false,
  });
  const [fileName, setFileName] = useState("");
  const [useCompression, setUseCompression] = useState(false);
  const [emailReport, setEmailReport] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    // TODO: Fetch form name and available columns from API
    setFormName("Customer Feedback Survey");
    setSelectedColumns(["respondent", "timestamp", "q1", "q2", "q3"]);
  }, []);

  const handleFormatChange = (format: SetStateAction<string>) => {
    setSelectedFormat(format);
  };

  const handleDateRangeChange = (dates: SetStateAction<null>) => {
    setDateRange(dates);
  };

  const handleColumnChange = (columns: any) => {
    setSelectedColumns(columns);
  };

  const handleFilterChange = (key: any, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleFileNameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setFileName(e.target.value);
  };

  const handleCompressionChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setUseCompression(e.target.checked);
  };

  const handleEmailReportChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmailReport(e.target.value);
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleDownload = () => {
    // TODO: Implement actual download functionality
    message.success("Download started");
    simulateDownload();
  };

  const handleScheduleReport = () => {
    setScheduleModalVisible(true);
  };

  const simulateDownload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        message.success("Download completed");
        setDownloadProgress(0);
      }
    }, 500);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/responses">
            <Button icon={<ArrowLeftOutlined />} className="mr-4">
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Download Center for {formName}</h1>
        </div>
        <Button icon={<HistoryOutlined />}>Download History</Button>
      </Header>
      <Content className="p-6">
        <FileFormatSelection
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
        />
        <DataCustomization
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <ExportSettings
          fileName={fileName}
          onFileNameChange={handleFileNameChange}
          useCompression={useCompression}
          onCompressionChange={handleCompressionChange}
          emailReport={emailReport}
          onEmailReportChange={handleEmailReportChange}
        />
        <div className="mt-6 flex justify-between items-center">
          <div>
            <Button
              icon={<EyeOutlined />}
              onClick={handlePreview}
              className="mr-4"
            >
              Preview Data
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="mr-4"
            >
              Download Now
            </Button>
            <Button icon={<ScheduleOutlined />} onClick={handleScheduleReport}>
              Schedule Report
            </Button>
          </div>
          {downloadProgress > 0 && (
            <Progress
              percent={downloadProgress}
              status="active"
              className="w-1/3"
            />
          )}
        </div>
      </Content>
      <Footer className="text-center">
        <Button type="link" href="/help/exporting-data">
          Help & Support: Guide for Exporting Data
        </Button>
      </Footer>
      <PreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        selectedColumns={selectedColumns}
        dateRange={dateRange}
        filters={filters}
      />
      <ScheduleReportModal
        visible={scheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        onSchedule={(schedule: any) => {
          console.log("Scheduled:", schedule);
          message.success("Report scheduled successfully");
          setScheduleModalVisible(false);
        }}
      />
    </Layout>
  );
}
