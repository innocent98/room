"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  BellIcon,
  KeyIcon,
  CreditCardIcon,
  UsersIcon,
  CubeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/layout";
import ProfileSettings from "@/components/settings/ProfileSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import TeamSettings from "@/components/settings/TeamSettings";
import IntegrationSettings from "@/components/settings/IntegrationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: UserCircleIcon },
    { id: "account", name: "Account", icon: KeyIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "billing", name: "Billing", icon: CreditCardIcon },
    // { id: "team", name: "Team Members", icon: UsersIcon },
    { id: "integrations", name: "Integrations", icon: CubeIcon },
    { id: "privacy", name: "Privacy & Security", icon: ShieldCheckIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "account":
        return <AccountSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "billing":
        return <BillingSettings />;
      case "team":
        return <TeamSettings />;
      case "integrations":
        return <IntegrationSettings />;
      case "privacy":
        return <PrivacySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            className="md:w-64 flex-shrink-0"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center px-4 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex-grow"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              {renderTabContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
