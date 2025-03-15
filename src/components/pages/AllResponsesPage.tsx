"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Layout, Button, Pagination, message, Spin, Empty, Modal } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchFilterBar from "@/components/all-responses/SearchFilterBar";
import FormCard from "@/components/all-responses/FormCard";

const { Header, Content, Footer } = Layout;

export default function AllResponsesPage() {
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [formsPerPage] = useState(10);
  const [totalForms, setTotalForms] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchForms = async () => {
    try {
      setLoading(true);

      // Build the query string
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: formsPerPage.toString(),
      });

      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      const response = await fetch(
        `/api/forms/with-responses?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }

      const data = await response.json();
      setForms(data.forms);
      setTotalForms(data.pagination.total);
    } catch (error) {
      // console.error("Error fetching forms:", error);
      message.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteForm = (id: string) => {
    setFormToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;

    try {
      const response = await fetch(`/api/forms/${formToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      message.success("Form deleted successfully");
      fetchForms(); // Refresh the list
    } catch (error) {
      console.error("Error deleting form:", error);
      message.error("Failed to delete form");
    } finally {
      setDeleteModalVisible(false);
      setFormToDelete(null);
    }
  };

  const handleDuplicateForm = async (id: string) => {
    try {
      // First, get the form data
      const response = await fetch(`/api/forms/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch form");
      }

      const formData = await response.json();

      // Create a new form with the same data
      const duplicateResponse = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${formData.title} (Copy)`,
          fields: formData.fields,
          isDraft: true,
        }),
      });

      if (!duplicateResponse.ok) {
        throw new Error("Failed to duplicate form");
      }

      const newForm = await duplicateResponse.json();
      message.success("Form duplicated successfully");

      // Refresh the list
      fetchForms();
    } catch (error) {
      // console.error("Error duplicating form:", error);
      message.error("Failed to duplicate form");
    }
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
            <span className="ml-2">Loading forms...</span>
          </div>
        ) : forms.length === 0 ? (
          <div className="mt-8">
            <Empty
              description={
                <span>
                  {searchTerm || statusFilter !== "all"
                    ? "No forms match your search criteria"
                    : "You haven't created any forms yet"}
                </span>
              }
            >
              <Link href="/dashboard/form/create">
                <Button type="primary">Create Your First Form</Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <div className="grid gap-4 mt-4">
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onDelete={handleDeleteForm}
                onDuplicate={handleDuplicateForm}
              />
            ))}
          </div>
        )}

        {!loading && forms.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              total={totalForms}
              pageSize={formsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
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

      <Modal
        title="Delete Form"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete this form? This action cannot be
          undone.
        </p>
        <p>All responses associated with this form will also be deleted.</p>
      </Modal>
    </Layout>
  );
}
