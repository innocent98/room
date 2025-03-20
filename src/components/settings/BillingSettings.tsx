"use client"

import { useState, useEffect } from "react"
import {
  Card,
  Typography,
  Button,
  Divider,
  Badge,
  Progress,
  Tabs,
  Spin,
  Alert,
  Table,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  Modal,
  Empty,
} from "antd"
import {
  CreditCardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  KeyOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { confirm } = Modal

export default function BillingSettings() {
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<any[]>([])
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [usageStats, setUsageStats] = useState<any>(null)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "true") {
      toast.success("Subscription updated successfully!")
    }

    fetchPlans()
    fetchUsageStats()
  }, [searchParams])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/subscription/plans")
      const data = await response.json()
      setPlans(data.plans)
      setCurrentPlan(data.currentPlan)
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast.error("Failed to load subscription plans")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsageStats = async () => {
    try {
      const response = await fetch("/api/subscription/usage")
      const data = await response.json()
      setUsageStats(data.usage)
      setSubscription(data.subscription)
    } catch (error) {
      console.error("Error fetching usage stats:", error)
      toast.error("Failed to load usage statistics")
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/subscription/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create subscription")
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error)
      toast.error("Failed to subscribe to plan")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    confirm({
      title: "Are you sure you want to cancel your subscription?",
      icon: <ExclamationCircleOutlined />,
      content: "You'll still have access until the end of your billing period.",
      onOk: async () => {
        try {
          setLoading(true)
          const response = await fetch("/api/subscription/cancel", {
            method: "POST",
          })

          if (response.ok) {
            toast.success("Subscription canceled successfully")
            fetchUsageStats() // Refresh subscription data
          } else {
            const data = await response.json()
            throw new Error(data.error || "Failed to cancel subscription")
          }
        } catch (error) {
          console.error("Error canceling subscription:", error)
          toast.error("Failed to cancel subscription")
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const paymentColumns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "succeeded" ? "success" : "error"}>
          {status === "succeeded" ? (
            <Space>
              <CheckCircleOutlined />
              Succeeded
            </Space>
          ) : (
            <Space>
              <CloseCircleOutlined />
              Failed
            </Space>
          )}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <Title level={2} style={{ marginBottom: 24 }}>
        Billing & Subscription
      </Title>

      <Tabs defaultActiveKey="subscription">
        <TabPane tab="Subscription" key="subscription">
          {/* Current Subscription */}
          {subscription && (
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  Current Subscription
                </Title>
                <Badge
                  status={subscription.status === "active" ? "success" : "error"}
                  text={subscription.status === "active" ? "Active" : "Canceled"}
                />
              </div>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Text strong>Plan</Text>
                  <Paragraph>{plans.find((p) => p.id === currentPlan)?.name || "Loading..."}</Paragraph>
                </Col>

                <Col xs={24} md={12}>
                  <Text strong>Price</Text>
                  <Paragraph>
                    {plans.find((p) => p.id === currentPlan)?.price
                      ? formatCurrency(plans.find((p) => p.id === currentPlan)?.price)
                      : "Loading..."}{" "}
                    / {plans.find((p) => p.id === currentPlan)?.interval || "month"}
                  </Paragraph>
                </Col>

                <Col xs={24} md={12}>
                  <Text strong>Start Date</Text>
                  <Paragraph>{formatDate(subscription.startDate)}</Paragraph>
                </Col>

                <Col xs={24} md={12}>
                  <Text strong>Current Period Ends</Text>
                  <Paragraph>{formatDate(subscription.currentPeriodEnd)}</Paragraph>
                </Col>
              </Row>

              {subscription.cancelAtPeriodEnd && (
                <Alert
                  message="Subscription Scheduled to Cancel"
                  description={`Your subscription will end on ${formatDate(subscription.currentPeriodEnd)}. You'll still have access until then.`}
                  type="warning"
                  showIcon
                  icon={<ClockCircleOutlined />}
                  style={{ marginTop: 16, marginBottom: 16 }}
                />
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
                  <Button danger onClick={handleCancelSubscription} disabled={loading}>
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Available Plans */}
          <Title level={4} style={{ marginBottom: 16 }}>
            Available Plans
          </Title>

          <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            {plans.map((plan) => (
              <Col xs={24} md={8} key={plan.id}>
                <Card
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                  title={
                    <div style={{ position: "relative" }}>
                      {plan.name}
                      {plan.isPopular && (
                        <Tag color="blue" style={{ position: "absolute", right: 0, top: 0 }}>
                          Popular
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <Statistic
                    value={plan.price}
                    precision={2}
                    valueStyle={{ fontSize: 28 }}
                    prefix="$"
                    suffix={`/${plan.interval}`}
                  />
                  <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                    {plan.description}
                  </Paragraph>
                  <Divider />
                  <div style={{ marginBottom: 24 }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Space>
                        <FileTextOutlined />
                        <Text>{plan.maxForms === -1 ? "Unlimited" : plan.maxForms} Forms</Text>
                      </Space>
                      <Space>
                        <BarChartOutlined />
                        <Text>{plan.maxResponses === -1 ? "Unlimited" : plan.maxResponses} Responses per Form</Text>
                      </Space>
                      <Space>
                        <TeamOutlined />
                        <Text>{plan.maxTeams === -1 ? "Unlimited" : plan.maxTeams} Teams</Text>
                      </Space>
                      <Space>
                        <KeyOutlined />
                        <Text>{plan.allowApiAccess ? "API Access" : "No API Access"}</Text>
                      </Space>
                    </Space>
                  </div>
                  <div style={{ marginTop: "auto" }}>
                    <Button
                      type={currentPlan === plan.id ? "default" : "primary"}
                      block
                      disabled={loading || currentPlan === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {currentPlan === plan.id ? "Current Plan" : "Subscribe"}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab="Usage" key="usage">
          <Card>
            <Title level={4} style={{ marginBottom: 16 }}>
              Usage Statistics
            </Title>

            {usageStats ? (
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text strong>Forms</Text>
                    <Text>
                      {usageStats.forms.used} / {usageStats.forms.limit}
                    </Text>
                  </div>
                  <Progress
                    percent={usageStats.forms.percentage}
                    status={usageStats.forms.percentage > 80 ? "exception" : "normal"}
                    showInfo={false}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text strong>Monthly Form Creation</Text>
                    <Text>
                      {usageStats.forms.monthlyCount} / {usageStats.forms.monthlyLimit}
                    </Text>
                  </div>
                  <Progress
                    percent={usageStats.forms.monthlyPercentage}
                    status={usageStats.forms.monthlyPercentage > 80 ? "exception" : "normal"}
                    showInfo={false}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text strong>Responses</Text>
                    <Text>
                      {usageStats.responses.used} / {usageStats.responses.limit}
                    </Text>
                  </div>
                  <Progress
                    percent={usageStats.responses.percentage}
                    status={usageStats.responses.percentage > 80 ? "exception" : "normal"}
                    showInfo={false}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text strong>Teams</Text>
                    <Text>
                      {usageStats.teams.used} / {usageStats.teams.limit}
                    </Text>
                  </div>
                  <Progress
                    percent={usageStats.teams.percentage}
                    status={usageStats.teams.percentage > 80 ? "exception" : "normal"}
                    showInfo={false}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text strong>API Keys</Text>
                    <Text>
                      {usageStats.apiKeys.used} / {usageStats.apiKeys.limit}
                    </Text>
                  </div>
                  <Progress
                    percent={usageStats.apiKeys.percentage}
                    status={usageStats.apiKeys.percentage > 80 ? "exception" : "normal"}
                    showInfo={false}
                  />
                  {!usageStats.apiKeys.allowed && (
                    <Text type="danger" style={{ display: "block", marginTop: 8 }}>
                      API access not available on your current plan
                    </Text>
                  )}
                </div>
              </Space>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Spin size="large" indicator={<ReloadOutlined spin />} />
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Payment History" key="payment-history">
          <Card>
            <Title level={4} style={{ marginBottom: 16 }}>
              Payment History
            </Title>

            {paymentHistory.length > 0 ? (
              <Table dataSource={paymentHistory} columns={paymentColumns} rowKey="id" pagination={{ pageSize: 10 }} />
            ) : (
              <Empty
                image={<CreditCardOutlined style={{ fontSize: 48 }} />}
                description={
                  <Space direction="vertical" align="center">
                    <Text strong>No payment history yet</Text>
                    <Text type="secondary">Your payment history will appear here once you subscribe to a plan.</Text>
                  </Space>
                }
                style={{ padding: 48 }}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

