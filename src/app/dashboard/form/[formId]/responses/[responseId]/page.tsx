"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Layout,
  Typography,
  Card,
  Button,
  Spin,
  Result,
  Descriptions,
  Divider,
  Tag,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function ResponseDetail() {
  const path = usePathname();
  const pathParts = path.split("/");
  const formId = pathParts[3];
  const responseId = pathParts[5];
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch form data
        const formResponse = await fetch(`/api/forms/${formId}`);

        if (!formResponse.ok) {
          if (formResponse.status === 404) {
            setError("Form not found");
          } else if (formResponse.status === 401) {
            setError("Unauthorized");
          } else {
            throw new Error("Failed to fetch form");
          }
          return;
        }

        const formData = await formResponse.json();
        setFormData(formData);

        // Fetch response data
        const responseResponse = await fetch(
          `/api/forms/${formId}/responses/${responseId}`
        );

        if (!responseResponse.ok) {
          if (responseResponse.status === 404) {
            setError("Response not found");
          } else if (responseResponse.status === 401) {
            setError("Unauthorized");
          } else {
            throw new Error("Failed to fetch response");
          }
          return;
        }

        const responseData = await responseResponse.json();
        setResponseData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId, responseId]);

  const renderFieldValue = (field: any, answer: any) => {
    if (!answer) return "-";

    const { type, value } = answer;

    switch (type) {
      case "signature":
        return (
          <img src={value} alt="Signature" style={{ width: 150, height: 100 }} />
        );

      case "checkbox":
        if (Array.isArray(value)) {
          return value.map((item, index) => (
            <Tag key={index} className="mb-1">
              {item}
            </Tag>
          ));
        }
        return value;

      case "radio":
      case "dropdown":
        return <Tag>{value}</Tag>;

      case "date":
        try {
          return new Date(value).toLocaleDateString();
        } catch (e) {
          return value;
        }

      default:
        return value;
    }
  };

  if (error) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status={error.includes("Unauthorized") ? "403" : "404"}
              title={
                error.includes("Unauthorized") ? "Unauthorized" : "Not Found"
              }
              subTitle={error}
              extra={
                <Button type="primary" onClick={() => router.push("/")}>
                  Back Home
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    );
  }

  if (loading || !formData || !responseData) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12">
              <Spin size="large" />
              <div className="mt-4">Loading response data...</div>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center">
            <Link href={`/dashboard/form/${formId}/responses`} className="mr-4">
              <Button icon={<ArrowLeftOutlined className="h-4 w-4" />}>
                Back to Responses
              </Button>
            </Link>
            <Title level={4} className="m-0">
              Response Details
            </Title>
          </div>
        </div>
      </Header>
      <Content className="p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <div className="mb-4">
              <Title level={5}>{formData.title}</Title>
              <Text type="secondary">
                Submitted on {new Date(responseData.createdAt).toLocaleString()}
              </Text>
            </div>

            <Divider />

            <Descriptions layout="vertical" column={1} bordered>
              {formData.fields.map((field: any) => {
                const answer = responseData.answers[field.id];
                return (
                  <Descriptions.Item key={field.id} label={field.label}>
                    {renderFieldValue(field, answer)}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
