"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card, Statistic, Progress, Spin, Empty, Divider } from "antd"
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, BarChartOutlined } from "@ant-design/icons"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface SummaryTabProps {
  formId: string
  loading: boolean
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function SummaryTab({ formId, loading }: SummaryTabProps) {
  const [summaryData, setSummaryData] = useState<any>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
    fetchSummaryData()
  }, [formId])

  const fetchSummaryData = async () => {
    try {
      setSummaryLoading(true)
      const response = await fetch(`/api/forms/${formId}/responses/analytics`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const data = await response.json()
      setSummaryData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setSummaryLoading(false)
    }
  }

  if (loading || summaryLoading) {
    return (
      <div className="text-center py-12">
        <Spin size="large" />
        <div className="mt-4">Loading analytics...</div>
      </div>
    )
  }

  if (!summaryData) {
    return <Empty description="No data available for analytics" />
  }

  const { totalResponses, completionRate, averageCompletionTime, responsesByDay, responsesByHour, questionStats } =
    summaryData

  return (
    <div>
      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Responses" value={totalResponses} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Completion Rate" value={completionRate} suffix="%" prefix={<CheckCircleOutlined />} />
            <Progress percent={completionRate} showInfo={false} status="active" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Completion Time"
              value={averageCompletionTime}
              suffix="sec"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Questions Answered" value={questionStats.totalAnswered} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Response Trends */}
      <Card title="Response Trends" className="mb-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responsesByDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Responses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Response Distribution */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={12}>
          <Card title="Responses by Time of Day">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responsesByHour} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" name="Responses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Question Completion Rates">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={questionStats.questions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="completionRate"
                    nameKey="label"
                    label={({ name, percent }:any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {questionStats.questions.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value:string) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Question Analysis */}
      <Card title="Question Analysis">
        <div className="space-y-6">
          {questionStats.questions.map((question: any, index: number) => (
            <div key={index}>
              <h3 className="text-lg font-medium mb-2">{question.label}</h3>
              <p className="text-gray-500 mb-2">
                Completion Rate: {question.completionRate}% | Skipped: {question.skippedCount}
              </p>

              {question.type === "radio" || question.type === "checkbox" ? (
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={question.answerDistribution}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="option" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS[index % COLORS.length]} name="Responses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500">Most common answer: {question.mostCommonAnswer || "N/A"}</p>
              )}

              {index < questionStats.questions.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

