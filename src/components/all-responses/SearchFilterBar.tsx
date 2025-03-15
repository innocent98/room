"use client"

import type React from "react"

import { useState } from "react"
import { Input, Select, Button, Space } from "antd"
import { SearchOutlined, FilterOutlined } from "@ant-design/icons"

const { Option } = Select

interface SearchFilterBarProps {
  onSearch: (value: string) => void
  onFilter: (value: string) => void
}

export default function SearchFilterBar({ onSearch, onFilter }: SearchFilterBarProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = () => {
    onSearch(searchValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Space className="w-full" direction="horizontal" wrap>
        <Input
          placeholder="Search forms..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          prefix={<SearchOutlined />}
          className="flex-grow"
          allowClear
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
        <Select defaultValue="all" style={{ minWidth: 150 }} onChange={onFilter} prefix={<FilterOutlined />}>
          <Option value="all">All Forms</Option>
          <Option value="active">Active</Option>
          <Option value="draft">Draft</Option>
          <Option value="archived">Archived</Option>
        </Select>
      </Space>
    </div>
  )
}

