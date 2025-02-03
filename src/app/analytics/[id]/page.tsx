"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Layout, Button, Card, Statistic } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import DetailedInsightsSection from "@/app/components/analytics/DetailedInsightsSection";
import ExportOptions from "@/app/components/analytics/ExportOptions";
import OverviewSection from "@/app/components/analytics/OverviewSection";
import { useParams, useSearchParams } from "next/navigation";

const { Header, Content, Footer } = Layout;

// Mock data for demonstration
const mockAnalyticsData = {
  formName: "Customer Satisfaction Survey",
  totalResponses: 1234,
  responsesByChoice: [
    { name: "Very Satisfied", value: 500 },
    { name: "Satisfied", value: 400 },
    { name: "Neutral", value: 200 },
    { name: "Dissatisfied", value: 100 },
    { name: "Very Dissatisfied", value: 34 },
  ],
  responsesOverTime: [
    { date: "2023-05-01", count: 50 },
    { date: "2023-05-02", count: 75 },
    { date: "2023-05-03", count: 60 },
    { date: "2023-05-04", count: 90 },
    { date: "2023-05-05", count: 120 },
  ],
  topResponses: [
    {
      question: "What feature do you like most?",
      answer: "User Interface",
      count: 450,
    },
    {
      question: "How likely are you to recommend us?",
      answer: "Very Likely",
      count: 600,
    },
    {
      question: "What area needs improvement?",
      answer: "Customer Support",
      count: 300,
    },
  ],
  demographicData: {
    age: [
      { group: "18-24", count: 200 },
      { group: "25-34", count: 400 },
      { group: "35-44", count: 350 },
      { group: "45-54", count: 200 },
      { group: "55+", count: 84 },
    ],
    location: [
      { name: "North America", value: 600 },
      { name: "Europe", value: 350 },
      { name: "Asia", value: 200 },
      { name: "Other", value: 84 },
    ],
  },
};

export default function AnalyticsPage() {
  const params = useParams();
  const param = useSearchParams();

  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);

  useEffect(() => {
    // TODO: Fetch real analytics data based on formId
    const formTitle = param.get("form");

    setAnalyticsData((prev) => ({
      ...prev,
      formName: formTitle || "Untitled Form",
      // Fetch real analytics data here...
    }));
  }, []);

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/responses/${params.id}`}>
            <Button icon={<ArrowLeftOutlined />} className="mr-4">
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">
            Analytics for {analyticsData.formName}
          </h1>
        </div>
      </Header>
      <Content className="p-6">
        <Card className="mb-6">
          <Statistic
            title="Total Responses"
            value={analyticsData.totalResponses}
            valueStyle={{ color: "#3f8600" }}
          />
        </Card>
        <OverviewSection
          responsesByChoice={analyticsData.responsesByChoice}
          responsesOverTime={analyticsData.responsesOverTime}
        />
        <DetailedInsightsSection
          topResponses={analyticsData.topResponses}
          demographicData={analyticsData.demographicData}
        />
        <ExportOptions />
      </Content>
      <Footer className="text-center">
        <Link href="/help/data-interpretation">
          Help Center: Data Interpretation Tips
        </Link>
      </Footer>
    </Layout>
  );
}
