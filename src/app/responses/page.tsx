"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { Layout, Button, Select, Pagination } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import FormCard from "../components/all-responses/FormCard";
import SearchFilterBar from "../components/all-responses/SearchFilterBar";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

// Mock data for forms
const mockForms = [
  {
    id: 1,
    title: "Customer Feedback Survey",
    creationDate: "2023-05-01",
    status: "Active",
    responseCount: 150,
  },
  {
    id: 2,
    title: "Employee Satisfaction Survey",
    creationDate: "2023-04-15",
    status: "Closed",
    responseCount: 75,
  },
  {
    id: 3,
    title: "Product Feature Request",
    creationDate: "2023-05-10",
    status: "Active",
    responseCount: 32,
  },
  {
    id: 4,
    title: "Event Registration Form",
    creationDate: "2023-03-20",
    status: "Archived",
    responseCount: 200,
  },
  {
    id: 5,
    title: "Website Feedback Form",
    creationDate: "2023-05-05",
    status: "Active",
    responseCount: 88,
  },
];

export default function AllResponsesPage() {
  const [forms, setForms] = useState(mockForms);
  const [filteredForms, setFilteredForms] = useState(mockForms);
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage] = useState(10);

  const handleSearch = (value: string) => {
    const filtered = forms.filter(
      (form) =>
        form.title.toLowerCase().includes(value.toLowerCase()) ||
        form.creationDate.includes(value) ||
        form.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredForms(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (value: string) => {
    if (value === "all") {
      setFilteredForms(forms);
    } else {
      const filtered = forms.filter(
        (form) => form.status.toLowerCase() === value.toLowerCase()
      );
      setFilteredForms(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOfFirstForm = indexOfLastForm - formsPerPage;
  const currentForms = filteredForms.slice(indexOfFirstForm, indexOfLastForm);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Button icon={<ArrowLeftOutlined />} className="mr-4">
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">All Forms & Responses</h1>
        </div>
        <Link href="/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Create New Form
          </Button>
        </Link>
      </Header>
      <Content className="p-6">
        <SearchFilterBar onSearch={handleSearch} onFilter={handleFilter} />
        <div className="grid gap-4 mt-4">
          {currentForms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Pagination
            current={currentPage}
            total={filteredForms.length}
            pageSize={formsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </Content>
      <Footer className="text-center">
        <Link href="/help" className="mr-4">
          Help Center
        </Link>
        <Link href="/privacy" className="mr-4">
          Privacy Policy
        </Link>
        <Link href="/terms">Terms of Service</Link>
      </Footer>
    </Layout>
  );
}
