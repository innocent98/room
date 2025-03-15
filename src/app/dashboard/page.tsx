"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  DocumentCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Layout from "../../components/layout";

export default function Dashboard() {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="p-4">
        {/* Hero Section */}
        <motion.section
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-white shadow-lg"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Welcome back, Victor!</h1>
              <p className="text-lg opacity-90 mb-6">
                Create, manage, and analyze your forms all in one place.
              </p>
              <button
                onClick={() => router.push("/dashboard/form/create")}
                className="bg-white text-indigo-600 hover:bg-opacity-90 transition-all px-6 py-3 rounded-full font-semibold flex items-center shadow-md"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Create New Form
              </button>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://via.placeholder.com/150?height=200&width=200"
                alt="Form illustration"
                width={200}
                height={200}
                className="ml-6"
              />
            </div>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Forms</p>
                <h3 className="text-2xl font-bold">15</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Responses</p>
                <h3 className="text-2xl font-bold">256</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Active Forms</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.section
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DocumentCheckIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">Customer Feedback Form</h3>
                  <p className="text-sm text-gray-500">
                    Last updated 2 days ago
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">Employee Survey 2023</h3>
                  <p className="text-sm text-gray-500">
                    Last updated 5 days ago
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Draft
                </span>
              </div>

              <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">Product Launch Questionnaire</h3>
                  <p className="text-sm text-gray-500">
                    Last updated 1 week ago
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Completed
                </span>
              </div>
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>

            <div className="space-y-4">
              <button
                onClick={() => router.push("/create")}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors p-4 rounded-xl flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Create a New Form</span>
              </button>

              <button
                onClick={() => router.push("/responses")}
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 transition-colors p-4 rounded-xl flex items-center"
              >
                <DocumentTextIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">View All Responses</span>
              </button>

              <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors p-4 rounded-xl flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Explore Templates</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl">
                <h3 className="font-medium text-indigo-800 mb-2">Need Help?</h3>
                <p className="text-sm text-indigo-700 mb-3">
                  Check out our documentation and tutorials to get started.
                </p>
                <button className="text-sm text-indigo-700 font-medium hover:text-indigo-900">
                  View Help Center →
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
}
