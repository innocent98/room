import { Input, DatePicker, Select, Form } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function FiltersAndSearch({ onSearch, onFilterChange }: any) {
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    onSearch(value);
  };

  const handleFilterChange = () => {
    const values = form.getFieldsValue();
    onFilterChange(values);
  };

  return (
    <Form form={form} layout="inline" onValuesChange={handleFilterChange}>
      <Form.Item name="keyword">
        <Input.Search
          placeholder="Search responses"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </Form.Item>
      <Form.Item name="dateRange">
        <RangePicker />
      </Form.Item>
      <Form.Item name="user">
        <Input placeholder="Filter by user" style={{ width: 150 }} />
      </Form.Item>
      <Form.Item name="answerType">
        <Select placeholder="Answer type" style={{ width: 120 }}>
          <Option value="text">Text</Option>
          <Option value="number">Number</Option>
          <Option value="multipleChoice">Multiple Choice</Option>
        </Select>
      </Form.Item>
    </Form>
  );
}
