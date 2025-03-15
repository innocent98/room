"use client"

import '@ant-design/v5-patch-for-react-19';
import type React from "react"
import { useState } from "react"
import { Input, Select, DatePicker, Button, Space, Card } from "antd"
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons"

const { RangePicker } = DatePicker
const { Option } = Select

interface FiltersAndSearchProps {
  onSearch: (keyword: string) => void
  onFilterChange: (filters: any) => void
}

export default function FiltersAndSearch({ onSearch, onFilterChange }: FiltersAndSearchProps) {
  const [keyword, setKeyword] = useState("")
  const [dateRange, setDateRange] = useState<any>(null)
  const [answerType, setAnswerType] = useState("")

  const handleSearch = () => {
    onSearch(keyword)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleFilterChange = () => {
    onFilterChange({
      dateRange,
      answerType,
    })
  }

  const handleClearFilters = () => {
    setKeyword("")
    setDateRange(null)
    setAnswerType("")
    onSearch("")
    onFilterChange({
      dateRange: null,
      answerType: "",
    })
  }

  return (
    <Card className="mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search responses..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            placeholder={["Start Date", "End Date"]}
          />
          <Select
            placeholder="Filter by answer type"
            style={{ minWidth: 180 }}
            value={answerType}
            onChange={(value) => setAnswerType(value)}
            allowClear
          >
            <Option value="complete">Complete Responses</Option>
            <Option value="incomplete">Incomplete Responses</Option>
            <Option value="positive">Positive Feedback</Option>
            <Option value="negative">Negative Feedback</Option>
          </Select>
          <Button type="primary" icon={<FilterOutlined />} onClick={handleFilterChange}>
            Apply Filters
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
            Clear
          </Button>
        </Space>
      </div>
    </Card>
  )
}

