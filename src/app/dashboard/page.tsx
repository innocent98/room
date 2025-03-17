"use client";

import { useState, useEffect } from "react";
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
import Layout from "@/components/layout";

interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  activeForms: number;
}

interface FormActivity {
  id: string;
  title: string;
  lastUpdated: string;
  status: "active" | "draft" | "completed" | "archived";
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    totalResponses: 0,
    activeForms: 0,
  });
  const [recentActivity, setRecentActivity] = useState<FormActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const profileResponse = await fetch("/api/user/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser({
            firstName: profileData.firstName || "User",
            lastName: profileData.lastName || "",
          });
        }

        // Fetch dashboard stats
        const statsResponse = await fetch("/api/dashboard/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        // Fetch recent activity
        const activityResponse = await fetch("/api/dashboard/activity");
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData.activities || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <DocumentCheckIcon className="h-5 w-5 text-green-600" />;
      case "draft":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "completed":
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case "archived":
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBgClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100";
      case "draft":
        return "bg-yellow-100";
      case "completed":
        return "bg-blue-100";
      case "archived":
        return "bg-gray-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div>
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
                <h1 className="text-4xl font-bold mb-3">
                  Welcome back, {loading ? "..." : user.firstName}!
                </h1>
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
              {/* <div className="hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Form illustration"
                  width={300}
                  height={200}
                  className="ml-6 rounded-lg shadow-lg object-cover"
                  priority
                />
              </div> */}
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
                  <h3 className="text-2xl font-bold">
                    {loading ? "..." : stats.totalForms}
                  </h3>
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
                  <h3 className="text-2xl font-bold">
                    {loading ? "..." : stats.totalResponses}
                  </h3>
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
                  <h3 className="text-2xl font-bold">
                    {loading ? "..." : stats.activeForms}
                  </h3>
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
                {/* <button
                  onClick={() => router.push("/dashboard/activity")}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View All
                </button> */}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center p-4 rounded-lg"
                    >
                      <div className="bg-gray-200 h-10 w-10 rounded-lg"></div>
                      <div className="ml-4 flex-grow">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No recent activity
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        // onClick={() =>
                        //   router.push(`/dashboard/form/${activity.id}`)
                        // }
                      >
                        <div
                          className={`${getStatusBgClass(
                            activity.status
                          )} p-2 rounded-lg`}
                        >
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-gray-500">
                            Last updated {activity.lastUpdated}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 ${getStatusBadgeClass(
                            activity.status
                          )} text-xs font-medium rounded-full`}
                        >
                          {activity.status.charAt(0).toUpperCase() +
                            activity.status.slice(1)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                  onClick={() => router.push("/dashboard/form/create")}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors p-4 rounded-xl flex items-center"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Create a New Form</span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/form/responses")}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 transition-colors p-4 rounded-xl flex items-center"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">View All Responses</span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/form-templates")}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors p-4 rounded-xl flex items-center"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Explore Templates</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl">
                  <h3 className="font-medium text-indigo-800 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-sm text-indigo-700 mb-3">
                    Check out our documentation and tutorials to get started.
                  </p>
                  <button
                    onClick={() => router.push("/help")}
                    className="text-sm text-indigo-700 font-medium hover:text-indigo-900"
                  >
                    View Help Center →
                  </button>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </Layout>
    </div>
  );
}
