import { Input, Checkbox } from "antd"

interface ExportSettingsProps {
  fileName: string;
  onFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  useCompression: boolean;
  onCompressionChange: (e: any) => void;
  emailReport: string;
  onEmailReportChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExportSettings({
  fileName,
  onFileNameChange,
  useCompression,
  onCompressionChange,
  emailReport,
  onEmailReportChange,
}: ExportSettingsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Export Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">File Name:</label>
          <Input value={fileName} onChange={onFileNameChange} placeholder="Enter file name" />
        </div>
        <div>
          <Checkbox checked={useCompression} onChange={onCompressionChange}>
            Enable ZIP compression for large datasets
          </Checkbox>
        </div>
        <div>
          <label className="block mb-1">Email Report:</label>
          <Input value={emailReport} onChange={onEmailReportChange} placeholder="Enter email address" />
        </div>
      </div>
    </div>
  )
}

