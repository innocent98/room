"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { Layout, Input, Button } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import ContactSupportForm from "../../components/help-center/ContactSUpportForm";
import FAQSection from "../../components/help-center/FAQSection";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

export default function HelpCenterPage() {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    // TODO: Implement actual search functionality
    // This is a mock implementation
    const mockResults = [
      "How to create a form",
      "How to download responses",
      "What is the export limit",
    ].filter((item) => item.toLowerCase().includes(value.toLowerCase()));
    setSearchResults(mockResults);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center">
        <Link href="/">
          <Button icon={<ArrowLeftOutlined />} className="mr-4">
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Help Center</h1>
      </Header>
      <Content className="p-6">
        <div className="max-w-3xl mx-auto">
          <Search
            placeholder="Search for answers..."
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="mb-6"
          />
          {searchResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Search Results:</h2>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index} className="mb-1">
                    <Link
                      href={`#${result.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {result}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <FAQSection />
          <ContactSupportForm />
        </div>
      </Content>
      <Footer className="text-center">
        <Link href="/terms" className="mr-4">
          Terms of Service
        </Link>
        <Link href="/privacy">Privacy Policy</Link>
      </Footer>
    </Layout>
  );
}
