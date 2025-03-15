import { DatePicker, Select, Checkbox, Space } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DataCustomizationProps {
  dateRange: any;
  onDateRangeChange: (dates: any, dateStrings: [string, string]) => void;
  selectedColumns: string[];
  onColumnChange: (value: string[]) => void;
  filters: {
    allResponses: boolean;
    removeDuplicates: boolean;
  };
  onFilterChange: (filterName: string, checked: boolean) => void;
}

export default function DataCustomization({
  dateRange,
  onDateRangeChange,
  selectedColumns,
  onColumnChange,
  filters,
  onFilterChange,
}: DataCustomizationProps) {
  const allColumns = ["respondent", "timestamp", "q1", "q2", "q3", "q4", "q5"]; // Replace with actual column names

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Data Customization</h2>
      <Space direction="vertical" className="w-full">
        <div>
          <label className="block mb-1">Date Range:</label>
          <RangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Select Columns:</label>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select columns to include"
            value={selectedColumns}
            onChange={onColumnChange}
          >
            {allColumns.map((column) => (
              <Option key={column} value={column}>
                {column}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block mb-1">Filters:</label>
          <Checkbox
            checked={filters.allResponses}
            onChange={(e) => onFilterChange("allResponses", e.target.checked)}
          >
            Include all responses
          </Checkbox>
          <Checkbox
            checked={filters.removeDuplicates}
            onChange={(e) =>
              onFilterChange("removeDuplicates", e.target.checked)
            }
          >
            Remove duplicate submissions
          </Checkbox>
        </div>
      </Space>
    </div>
  );
}
