import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Pie, Bar, Line } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function SummaryTab({ responses, loading }: any) {
  // Calculate summary statistics
  const totalResponses = responses.length;
  const latestResponse =
    responses.length > 0
      ? new Date(Math.max(...responses.map((r: any) => new Date(r.timestamp))))
      : null;

  // Prepare chart data (this is a simplified example)
  const pieChartData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        data: [
          responses.filter((r: any) => r.answers.q1 === "Yes").length,
          responses.filter((r: any) => r.answers.q1 === "No").length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const barChartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Ratings",
        data: [1, 2, 3, 4, 5].map(
          (rating) =>
            responses.filter((r: any) => r.answers.q3 === rating).length
        ),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Responses over time",
        data: [12, 19, 3, 5, 2],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Responses"
              value={totalResponses}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Latest Response"
              value={latestResponse ? latestResponse.toLocaleString() : "N/A"}
              prefix={<ClockCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} className="mt-4">
        <Col span={8}>
          <Card title="Question 1: Yes/No">
            <Pie data={pieChartData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Question 3: Ratings">
            <Bar data={barChartData} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Responses Over Time">
            <Line data={lineChartData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
