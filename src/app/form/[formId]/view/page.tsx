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
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import FormField from "@/components/form-view/FormField";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function FormView() {
  const path = usePathname();
  const formId = path.split("/")[2];

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<any>(null);
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
        // console.log("Form data:", data) // Debug log
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
    console.log(values);
    try {
      setSubmitting(true);
      // console.log("Form values:", values) // Debug log

      // Process signature fields if any
      const processedValues = { ...values };

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

      message.success("Form submitted successfully!");
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
    // if (!formData?.fields || !formData.settings?.showProgressBar) {
    //   return formData?.fields || [];
    // }

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

  if (loading) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center py-12">
              <Spin size="large" />
              <div className="mt-4">Loading form...</div>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !formData) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="404"
              title="Form Not Found"
              subTitle={
                error || "Sorry, the form you are looking for does not exist."
              }
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard")}
                >
                  Back Home
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    );
  }

  if (submissionBlocked) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="info"
              title="You've Already Submitted This Form"
              subTitle="Multiple submissions are not allowed for this form."
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push("/dashboard")}
                >
                  Back Home
                </Button>
              }
            />
          </div>
        </Content>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <div className="max-w-3xl mx-auto">
            <Result
              status="success"
              title="Form Submitted Successfully!"
              subTitle={
                formData.settings?.successMessage ||
                "Thank you for your submission. Your response has been recorded."
              }
              extra={[
                <Button key="home" onClick={() => router.push("/dashboard")}>
                  Back Home
                </Button>,
                formData.settings?.allowMultipleSubmissions !== false && (
                  <Button
                    key="another"
                    type="primary"
                    onClick={() => {
                      setSubmitted(false);
                      form.resetFields();
                      setCurrentStep(0);
                      signatureDataRef.current = {};
                    }}
                  >
                    Submit Another Response
                  </Button>
                ),
              ]}
            />
            {redirectCountdown !== null && (
              <div className="text-center mt-4">
                <p>Redirecting in {redirectCountdown} seconds...</p>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center">
        <div className="max-w-3xl mx-auto w-full">
          <Title level={4} className="m-0">
            {formData.title}
          </Title>
        </div>
      </Header>

      {formData.settings?.bannerImage && (
        <div className="w-full">
          <img
            src={formData.settings.bannerImage || "/placeholder.svg"}
            alt="Form Banner"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <Content className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <Paragraph>{formData.description}</Paragraph>
            {formData.createdBy && (
              <Paragraph className="text-gray-500">
                Created by: {formData.createdBy}
              </Paragraph>
            )}
          </div>

          {formData.settings?.showProgressBar && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <Progress percent={getProgressPercentage()} status="active" />
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              onValuesChange={handleValuesChange}
            >
              {formData.settings?.showProgressBar
                ? getFieldsForCurrentStep().map((field: any) => (
                    <div key={field.id}>
                      {visibleFields[field.id] && <FormField field={field} />}
                    </div>
                  ))
                : formData.fields.map((field: any) => (
                    <div key={field.id}>
                      {visibleFields[field.id] && <FormField field={field} />}
                    </div>
                  ))}

              <Form.Item>
                <div className="flex justify-between">
                  {formData.settings?.showProgressBar && currentStep > 0 && (
                    <Button onClick={() => setCurrentStep(currentStep - 1)}>
                      Previous
                    </Button>
                  )}

                  <div className="ml-auto">
                    {formData.settings?.showProgressBar && currentStep < 2 ? (
                      <Button
                        type="primary"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={submitting}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
      <Footer className="text-center">
        <div className="text-gray-500">
          {formData.settings?.footerText || "Powered by ROOM Form Builder"}
        </div>
      </Footer>
    </Layout>
  );
}
