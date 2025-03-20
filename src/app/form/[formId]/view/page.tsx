"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect, useRef } from "react";
import {
  Layout,
  Typography,
  Form,
  Button,
  message,
  Result,
  Spin,
  Progress,
  Card,
  theme,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SendOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import FormField from "@/components/form-view/FormField";
import { motion, AnimatePresence } from "framer-motion";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function FormView() {
  const path = usePathname();
  const formId = path.split("/")[2];
  const { token } = theme.useToken();

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>(null);
  const [stepFormData, setStepFormData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submissionBlocked, setSubmissionBlocked] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null
  );
  const router = useRouter();

  // Reference to store signature data
  const signatureDataRef = useRef<Record<string, string>>({});
  // Reference to track animation direction
  const animationDirection = useRef<"forward" | "backward">("forward");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${formId}/view`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Form not found");
          } else if (response.status === 403) {
            setError("This form is not published");
          } else {
            throw new Error("Failed to fetch form");
          }
          return;
        }

        const data = await response.json();
        setFormData(data);

        // Initialize visible fields based on conditional logic
        const initialVisibility: Record<string, boolean> = {};
        data.fields.forEach((field: any) => {
          initialVisibility[field.id] =
            !field.conditionalLogic ||
            !field.conditionalLogic.enabled ||
            field.conditionalLogic.conditions?.length === 0;
        });
        setVisibleFields(initialVisibility);

        // Check if multiple submissions are allowed
        if (data.settings?.allowMultipleSubmissions === false) {
          const hasSubmitted = localStorage.getItem(`form_${formId}_submitted`);
          if (hasSubmitted) {
            setSubmissionBlocked(true);
          }
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        setError("Failed to load form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  // Handle form value changes to evaluate conditional logic
  const handleValuesChange = (changedValues: any, allValues: any) => {
    setFormValues(allValues);

    if (!formData?.fields) return;

    const newVisibility = { ...visibleFields };

    formData.fields.forEach((field: any) => {
      if (!field.conditionalLogic || !field.conditionalLogic.enabled) {
        newVisibility[field.id] = true;
        return;
      }

      // Evaluate each condition
      let shouldShow = false;

      if (
        field.conditionalLogic.conditions &&
        field.conditionalLogic.conditions.length > 0
      ) {
        field.conditionalLogic.conditions.forEach((condition: any) => {
          const { sourceField, operator, value } = condition;
          const sourceValue = allValues[sourceField];

          if (sourceValue === undefined) return;

          switch (operator) {
            case "equals":
              if (sourceValue === value) shouldShow = true;
              break;
            case "notEquals":
              if (sourceValue !== value) shouldShow = true;
              break;
            case "contains":
              if (Array.isArray(sourceValue) && sourceValue.includes(value))
                shouldShow = true;
              break;
            case "notContains":
              if (Array.isArray(sourceValue) && !sourceValue.includes(value))
                shouldShow = true;
              break;
            case "greaterThan":
              if (sourceValue > value) shouldShow = true;
              break;
            case "lessThan":
              if (sourceValue < value) shouldShow = true;
              break;
          }
        });
      }

      newVisibility[field.id] = shouldShow;
    });

    setVisibleFields(newVisibility);
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      // Process signature fields if any
      const processedValues = stepFormData
        ? { ...stepFormData, ...formValues }
        : { ...values, ...formValues };

      const response = await fetch(`/api/forms/${formId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      message.success({
        content: "Form submitted successfully!",
        icon: <CheckCircleOutlined style={{ color: token.colorSuccess }} />,
        className: "custom-success-message",
      });
      setSubmitted(true);

      // Mark as submitted in localStorage if multiple submissions are not allowed
      if (formData.settings?.allowMultipleSubmissions === false) {
        localStorage.setItem(`form_${formId}_submitted`, "true");
      }

      // Handle redirect if URL is provided
      if (formData.settings?.redirectUrl) {
        setRedirectCountdown(5); // Start 5 second countdown
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle redirect countdown
  useEffect(() => {
    if (redirectCountdown === null) return;

    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0 && formData?.settings?.redirectUrl) {
      window.location.href = formData.settings.redirectUrl;
    }
  }, [redirectCountdown, formData?.settings?.redirectUrl]);

  // Get visible fields for the current step
  const getFieldsForCurrentStep = () => {
    if (!formData?.fields || !formData.settings?.showProgressBar) {
      return formData?.fields || [];
    }

    const visibleFieldsList = formData.fields.filter(
      (field: any) => visibleFields[field.id]
    );
    const totalFields = visibleFieldsList.length;
    const fieldsPerStep = Math.ceil(totalFields / 3); // Divide into 3 steps

    return visibleFieldsList.slice(
      currentStep * fieldsPerStep,
      (currentStep + 1) * fieldsPerStep
    );
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!formData?.fields) return 0;

    const totalSteps = formData.settings?.showProgressBar ? 3 : 1;
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  };

  const handleNextStep = async () => {
    try {
      const values = await form.validateFields(); // Ensure fields are validated before moving
      setStepFormData((prev: any) => ({ ...prev, ...values }));
      animationDirection.current = "forward";
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePreviousStep = () => {
    animationDirection.current = "backward";
    setCurrentStep(currentStep - 1);
  };

  const isFinalStep = formData?.settings?.showProgressBar && currentStep === 2;

  // Animation variants
  const pageVariants = {
    initial: (direction: string) => ({
      x: direction === "forward" ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: string) => ({
      x: direction === "forward" ? -300 : 300,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  if (loading) {
    return (
      <Layout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 40, color: token.colorPrimary }}
                    spin
                  />
                }
              />
              <div className="mt-6 text-lg font-medium text-gray-600">
                Loading your form...
              </div>
              <div className="mt-2 text-gray-400">Please wait a moment</div>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !formData) {
    return (
      <Layout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="404"
              title={<span className="text-2xl font-bold">Form Not Found</span>}
              subTitle={
                <span className="text-gray-500">
                  {error ||
                    "Sorry, the form you are looking for does not exist."}
                </span>
              }
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Back Home
                </Button>
              }
              className="bg-white p-8 rounded-xl shadow-md"
            />
          </div>
        </Content>
      </Layout>
    );
  }

  if (submissionBlocked) {
    return (
      <Layout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="info"
              title={
                <span className="text-2xl font-bold">
                  You've Already Submitted This Form
                </span>
              }
              subTitle={
                <span className="text-gray-500">
                  Multiple submissions are not allowed for this form.
                </span>
              }
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Back Home
                </Button>
              }
              className="bg-white p-8 rounded-xl shadow-md"
            />
          </div>
        </Content>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Result
                status="success"
                title={
                  <span className="text-2xl font-bold">
                    Form Submitted Successfully!
                  </span>
                }
                subTitle={
                  <span className="text-gray-500">
                    {formData.settings?.successMessage ||
                      "Thank you for your submission. Your response has been recorded."}
                  </span>
                }
                extra={[
                  <Button
                    key="home"
                    size="large"
                    onClick={() => router.push("/dashboard")}
                    className="rounded-lg border-gray-200 hover:border-gray-300 transition-all"
                  >
                    Back Home
                  </Button>,
                  formData.settings?.allowMultipleSubmissions !== false && (
                    <Button
                      key="another"
                      type="primary"
                      size="large"
                      onClick={() => {
                        setSubmitted(false);
                        form.resetFields();
                        setCurrentStep(0);
                        signatureDataRef.current = {};
                      }}
                      className="rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Submit Another Response
                    </Button>
                  ),
                ]}
                className="bg-white p-8 rounded-xl shadow-md"
              />
              {redirectCountdown !== null && (
                <div className="text-center mt-6 bg-white p-4 rounded-lg shadow-sm">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: `${(redirectCountdown / 5) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-1 bg-blue-500 rounded-full mb-3 mx-auto"
                  />
                  <p className="text-gray-600">
                    Redirecting in{" "}
                    <span className="font-semibold">{redirectCountdown}</span>{" "}
                    seconds...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header className="bg-white px-6 flex items-center shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <Title level={4} className="m-0 text-gradient">
            {formData.title}
          </Title>
          {formData.settings?.showProgressBar && (
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step === currentStep
                        ? "bg-blue-500"
                        : step < currentStep
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Header>

      {formData.settings?.bannerImage && (
        <div
          className="w-full relative overflow-hidden"
          style={{ height: "240px" }}
        >
          <img
            src={formData.settings.bannerImage || "/placeholder.svg"}
            alt="Form Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30" />
        </div>
      )}

      <Content className="p-6">
        <div className="max-w-3xl mx-auto">
          <Card
            className="mb-6 border-0 rounded-xl shadow-md overflow-hidden"
            bodyStyle={{ padding: "1.5rem" }}
          >
            <Paragraph className="text-lg text-gray-700">
              {formData.description}
            </Paragraph>
            {formData.createdBy && (
              <Paragraph className="text-gray-500 mb-0">
                <Text type="secondary">Created by:</Text> {formData.createdBy}
              </Paragraph>
            )}
          </Card>

          {formData.settings?.showProgressBar && (
            <Card
              className="mb-6 border-0 rounded-xl shadow-sm overflow-hidden"
              bodyStyle={{ padding: "1.5rem" }}
            >
              <div className="mb-2 flex justify-between">
                <Text type="secondary">Progress</Text>
                <Text strong>{getProgressPercentage()}%</Text>
              </div>
              <Progress
                percent={getProgressPercentage()}
                status="active"
                strokeColor={{
                  "0%": token.colorPrimary,
                  "100%": token.colorPrimaryActive,
                }}
                showInfo={false}
                strokeWidth={8}
                className="custom-progress"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Step {currentStep + 1} of 3</span>
                <span>
                  {getFieldsForCurrentStep().length} fields in this step
                </span>
              </div>
            </Card>
          )}

          <Card
            className="border-0 rounded-xl shadow-lg overflow-hidden"
            bodyStyle={{ padding: "1.5rem" }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              onValuesChange={handleValuesChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent accidental form submission on Enter key
                }
              }}
              className="form-with-floating-labels"
            >
              <AnimatePresence mode="wait" custom={animationDirection.current}>
                <motion.div
                  key={currentStep}
                  custom={animationDirection.current}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  {formData.settings?.showProgressBar
                    ? getFieldsForCurrentStep().map((field: any) => (
                        <div key={field.id} className="mb-6">
                          {visibleFields[field.id] && (
                            <FormField field={field} />
                          )}
                        </div>
                      ))
                    : formData.fields.map((field: any) => (
                        <div key={field.id} className="mb-6">
                          {visibleFields[field.id] && (
                            <FormField field={field} />
                          )}
                        </div>
                      ))}
                </motion.div>
              </AnimatePresence>

              <Form.Item className="mb-0 mt-8">
                <div className="flex justify-between items-center">
                  {formData.settings?.showProgressBar && currentStep > 0 ? (
                    <Button
                      size="large"
                      icon={<ArrowLeftOutlined />}
                      onClick={handlePreviousStep}
                      className="rounded-lg border-gray-200 hover:border-gray-300 transition-all"
                    >
                      Previous
                    </Button>
                  ) : (
                    <div></div> // Empty div to maintain flex spacing
                  )}

                  <div className="ml-auto">
                    {formData.settings?.showProgressBar && !isFinalStep ? (
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleNextStep}
                        className="rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        Next <ArrowRightOutlined />
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        htmlType="button"
                        size="large"
                        icon={<SendOutlined />}
                        loading={submitting}
                        disabled={submitting}
                        onClick={() => form.submit()}
                        className="rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </div>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
      <Footer className="text-center bg-transparent">
        <div className="text-gray-500 py-2">
          {formData.settings?.footerText || "Powered by ROOM Form Builder"}
        </div>
      </Footer>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(
            90deg,
            ${token.colorPrimary},
            ${token.colorPrimaryActive}
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .custom-progress .ant-progress-bg {
          border-radius: 4px;
        }

        .form-with-floating-labels .ant-form-item-label {
          font-weight: 500;
        }

        .form-with-floating-labels .ant-input,
        .form-with-floating-labels .ant-select-selector,
        .form-with-floating-labels .ant-picker {
          border-radius: 8px;
          border-color: #e2e8f0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .form-with-floating-labels .ant-input:hover,
        .form-with-floating-labels .ant-select-selector:hover,
        .form-with-floating-labels .ant-picker:hover {
          border-color: #cbd5e1;
        }

        .form-with-floating-labels .ant-input:focus,
        .form-with-floating-labels .ant-select-selector:focus,
        .form-with-floating-labels .ant-picker:focus,
        .form-with-floating-labels .ant-input-focused,
        .form-with-floating-labels .ant-select-focused .ant-select-selector,
        .form-with-floating-labels .ant-picker-focused {
          border-color: ${token.colorPrimary};
          box-shadow: 0 0 0 2px
            rgba(
              ${Number.parseInt(token.colorPrimary.slice(1, 3), 16)},
              ${Number.parseInt(token.colorPrimary.slice(3, 5), 16)},
              ${Number.parseInt(token.colorPrimary.slice(5, 7), 16)},
              0.2
            );
        }

        .custom-success-message {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Layout>
  );
}
