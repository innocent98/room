import { motion } from "framer-motion";
import React from "react";

interface Props {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TeamTab({ activeTab, setActiveTab }: Props) {
  return (
    <motion.div
      className="mb-6 border-b border-gray-200"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex space-x-8">
        <button
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === "members"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("members")}
        >
          Team Members
        </button>
        <button
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === "invitations"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("invitations")}
        >
          Pending Invitations
        </button>
        <button
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === "activity"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          Activity Log
        </button>
        <button
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Team Settings
        </button>
      </div>
    </motion.div>
  );
}
