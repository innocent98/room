"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Layout, Tabs, Button, message, TabsProps } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import GeneralSettings from "../../components/form-settings/GeneralSettings";
import Notifications from "../../components/form-settings/Notifications";
import PrivacyPermissions from "../../components/form-settings/PrivacyPermissions";
import ResponseCollection from "../../components/form-settings/ResponseCollection";
import WebhookModal from "../../components/form-settings/WebhookModal";
import { Settings } from "@/constants/types";
import { useSearchParams } from "next/navigation";

const { Header, Content, Footer } = Layout;

export default function FormSettingsPage() {
  const param = useSearchParams();

  const [formTitle, setFormTitle] = useState<string | null>("Untitled Form");
  const [settings, setSettings] = useState<Settings>({
    general: {
      title: "",
      description: "",
      customUrl: "",
      theme: "",
    },
    responseCollection: {
      isOpen: false,
      responseLimit: undefined,
      startDate: undefined,
      endDate: undefined,
    },
    privacyPermissions: {
      whoCanSubmit: "",
      allowMultipleSubmissions: false,
      enableCaptcha: false,
    },
    notifications: { webhookUrl: "", emailNotifications: false },
  });
  const [isWebhookModalVisible, setIsWebhookModalVisible] = useState(false);

  useEffect(() => {
    // TODO: Fetch form settings from API
    // For now, we'll use mock data
    const formTitle = param.get("form");
    setFormTitle(formTitle);

    setSettings({
      general: {
        title: "Untitled Form",
        description: "",
        customUrl: "",
        theme: "light",
      },
      responseCollection: {
        isOpen: true,
        responseLimit: null,
        startDate: null,
        endDate: null,
      },
      privacyPermissions: {
        whoCanSubmit: "anyone",
        allowMultipleSubmissions: false,
        enableCaptcha: false,
      },
      notifications: {
        emailNotifications: false,
        webhookUrl: "",
      },
    });
  }, []);

  const handleSettingsChange = (section: keyof Settings, newSettings: {}) => {
    setSettings((prevSettings: Settings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        ...newSettings,
      },
    }));
  };

  const handleSaveAndClose = () => {
    // TODO: Implement API call to save settings
    message.success("Settings saved successfully");
    // Redirect to dashboard or form editor
  };

  const handleWebhookSetup = (webhookUrl: string) => {
    handleSettingsChange("notifications", { webhookUrl });
    setIsWebhookModalVisible(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "general",
      label: "General",
      children: (
        <GeneralSettings
          settings={settings.general}
          onChange={(newSettings: Settings) =>
            handleSettingsChange("general", newSettings)
          }
        />
      ),
    },
    {
      key: "responseCollection",
      label: "Response Collection",
      children: (
        <ResponseCollection
          settings={settings.responseCollection}
          onChange={(newSettings: Settings) =>
            handleSettingsChange("responseCollection", newSettings)
          }
        />
      ),
    },
    {
      key: "privacyPermissions",
      label: "Privacy & Permissions",
      children: (
        <PrivacyPermissions
          settings={settings.privacyPermissions}
          onChange={(newSettings: Settings) =>
            handleSettingsChange("privacyPermissions", newSettings)
          }
        />
      ),
    },
    {
      key: "notifications",
      label: "Notifications",
      children: (
        <Notifications
          settings={settings.notifications}
          onChange={(newSettings: Settings) =>
            handleSettingsChange("notifications", newSettings)
          }
          onWebhookSetup={() => setIsWebhookModalVisible(true)}
        />
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/create">
            <Button icon={<ArrowLeftOutlined />} className="mr-4">
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{formTitle} Settings</h1>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveAndClose}
        >
          Save & Close
        </Button>
      </Header>
      <Content className="p-6">
        <Tabs defaultActiveKey="general" items={items} />
      </Content>
      <Footer className="text-center">
        <Button type="link">Help Center</Button>
        <Button type="link">Support</Button>
      </Footer>
      <WebhookModal
        visible={isWebhookModalVisible}
        onCancel={() => setIsWebhookModalVisible(false)}
        onSave={handleWebhookSetup}
        initialUrl={settings.notifications.webhookUrl}
      />
    </Layout>
  );
}
