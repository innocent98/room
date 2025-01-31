import { Input, Select } from "antd"

const { Search } = Input
const { Option } = Select

interface SearchFilterBarProps {
  onSearch: (value: string) => void
  onFilter: (value: string) => void
}

export default function SearchFilterBar({ onSearch, onFilter }: SearchFilterBarProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Search placeholder="Search forms..." onSearch={onSearch} style={{ width: 300 }} className="mr-4" />
      <Select defaultValue="all" style={{ width: 120 }} onChange={onFilter}>
        <Option value="all">All Forms</Option>
        <Option value="active">Active</Option>
        <Option value="closed">Closed</Option>
        <Option value="archived">Archived</Option>
      </Select>
    </div>
  )
}

