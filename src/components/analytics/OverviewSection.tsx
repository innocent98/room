import { Card } from "antd"
import { Pie, Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

interface OverviewSectionProps {
  responsesByChoice: { name: string; value: number }[]
  responsesOverTime: { date: string; count: number }[]
}

export default function OverviewSection({ responsesByChoice, responsesOverTime }: OverviewSectionProps) {
  const pieChartData = {
    labels: responsesByChoice.map((item) => item.name),
    datasets: [
      {
        data: responsesByChoice.map((item) => item.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  }

  const barChartData = {
    labels: responsesOverTime.map((item) => item.date),
    datasets: [
      {
        label: "Responses",
        data: responsesOverTime.map((item) => item.count),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  }

  const lineChartData = {
    labels: responsesOverTime.map((item) => item.date),
    datasets: [
      {
        label: "Responses",
        data: responsesOverTime.map((item) => item.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
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
      <Card title="Responses by Choice">
        <Pie data={pieChartData} options={options} />
      </Card>
      <Card title="Responses Over Time">
        <Bar data={barChartData} options={options} />
      </Card>
      <Card title="Response Trends" className="md:col-span-2">
        <Line data={lineChartData} options={options} />
      </Card>
    </div>
  )
}

