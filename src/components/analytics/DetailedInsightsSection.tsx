import { Card, List, Typography } from "antd"
import { Pie } from "react-chartjs-2"

const { Title } = Typography

interface DetailedInsightsSectionProps {
  topResponses: { question: string; answer: string; count: number }[]
  demographicData: {
    age: { group: string; count: number }[]
    location: { name: string; value: number }[]
  }
}

export default function DetailedInsightsSection({ topResponses, demographicData }: DetailedInsightsSectionProps) {
  const ageChartData = {
    labels: demographicData.age.map((item) => item.group),
    datasets: [
      {
        data: demographicData.age.map((item) => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  }

  const locationChartData = {
    labels: demographicData.location.map((item) => item.name),
    datasets: [
      {
        data: demographicData.location.map((item) => item.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed !== undefined) {
              label += context.parsed
            }
            return label
          },
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card title="Top Responses">
        <List
          itemLayout="horizontal"
          dataSource={topResponses}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.question} description={`${item.answer} (${item.count} responses)`} />
            </List.Item>
          )}
        />
      </Card>
      <Card title="Demographic Breakdown">
        <Title level={5}>Age Distribution</Title>
        <Pie data={ageChartData} options={options} />
        <Title level={5} className="mt-4">
          Location Distribution
        </Title>
        <Pie data={locationChartData} options={options} />
      </Card>
    </div>
  )
}

