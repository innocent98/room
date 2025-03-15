import { Radio, Space } from "antd";
import {
  FilePdfOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

export default function FileFormatSelection({
  selectedFormat,
  onFormatChange,
}: any) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">File Format</h2>
      <Radio.Group
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value)}
      >
        <Space direction="vertical">
          <Radio value="pdf">
            <FilePdfOutlined /> PDF (Summary Report)
          </Radio>
          <Radio value="excel">
            <FileExcelOutlined /> Excel (.xlsx)
          </Radio>
          <Radio value="csv">
            <FileTextOutlined /> CSV (Raw Data)
          </Radio>
          <Radio value="charts">
            <AreaChartOutlined /> Charts Only (PNG/JPG Export)
          </Radio>
        </Space>
      </Radio.Group>
    </div>
  );
}
