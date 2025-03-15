"use client"

import '@ant-design/v5-patch-for-react-19';
import { useState } from "react"
import { motion } from "framer-motion"
import {
  UserCircleIcon,
  BellIcon,
  KeyIcon,
  CreditCardIcon,
  UsersIcon,
  CubeIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"
import { Switch } from "antd"
import Layout from '@/components/layout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const tabs = [
    { id: "profile", name: "Profile", icon: UserCircleIcon },
    { id: "account", name: "Account", icon: KeyIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "billing", name: "Billing", icon: CreditCardIcon },
    { id: "team", name: "Team Members", icon: UsersIcon },
    { id: "integrations", name: "Integrations", icon: CubeIcon },
    { id: "privacy", name: "Privacy & Security", icon: ShieldCheckIcon },
  ]

  return (
    <Layout>
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences.</p>
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
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <img
                        src="/placeholder.svg?height=128&width=128"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="text-indigo-600 text-sm font-medium">Change Photo</button>
                  </div>

                  <div className="md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          defaultValue="Victor"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          defaultValue="Smith"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue="victor.smith@example.com"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={4}
                        defaultValue="Form creator and survey enthusiast."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 mb-1">Enhance your account security</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h4 className="text-red-800 font-medium mb-2">Delete Account</h4>
                    <p className="text-red-700 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50 font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Form Submissions</p>
                          <p className="text-sm text-gray-500">
                            Receive an email when someone submits a response to your form.
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Form Comments</p>
                          <p className="text-sm text-gray-500">Receive an email when someone comments on your form.</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Marketing Updates</p>
                          <p className="text-sm text-gray-500">Receive emails about new features and improvements.</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Form Submissions</p>
                          <p className="text-sm text-gray-500">
                            Receive a notification when someone submits a response to your form.
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Form Comments</p>
                          <p className="text-sm text-gray-500">
                            Receive a notification when someone comments on your form.
                          </p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-700 font-medium">Team Activity</p>
                          <p className="text-sm text-gray-500">Receive notifications about team member actions.</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Billing & Subscription</h2>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-indigo-800">Pro Plan</h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-indigo-700 mb-4">Your subscription renews on October 15, 2023</p>
                  <div className="flex space-x-4">
                    <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 font-medium">
                      Change Plan
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">Cancel Subscription</button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <div className="border border-gray-200 rounded-md p-4 mb-4 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md mr-4">
                      <CreditCardIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2024</p>
                    </div>
                    <button className="ml-auto text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    + Add Payment Method
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Billing History</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sep 15, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pro Plan - Monthly</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$29.99</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                            <a href="#">Download</a>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Aug 15, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pro Plan - Monthly</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$29.99</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                            <a href="#">Download</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Team Members</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                    Invite Member
                  </button>
                </div>

                <div className="mb-8">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0">
                                <img
                                  src="/placeholder.svg?height=40&width=40"
                                  alt="Profile"
                                  className="h-10 w-10 rounded-full"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Victor Smith</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            victor.smith@example.com
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-800 mr-3">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0">
                                <img
                                  src="/placeholder.svg?height=40&width=40"
                                  alt="Profile"
                                  className="h-10 w-10 rounded-full"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">Jane Cooper</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">jane.cooper@example.com</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Editor</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-800 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Remove</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
                  <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-4 flex items-center">
                    <div className="flex-grow">
                      <p className="font-medium">alex.morgan@example.com</p>
                      <p className="text-sm text-gray-500">Invited on Sep 10, 2023</p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-4">Resend</button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Integrations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <img src="/placeholder.svg?height=32&width=32" alt="Google" className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-medium">Google Drive</h3>
                          <p className="text-sm text-gray-500">Connect to store form responses</p>
                        </div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Configure</button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <img src="/placeholder.svg?height=32&width=32" alt="Slack" className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-medium">Slack</h3>
                          <p className="text-sm text-gray-500">Get notifications in your channels</p>
                        </div>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Connect</button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <img src="/placeholder.svg?height=32&width=32" alt="Zapier" className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-medium">Zapier</h3>
                          <p className="text-sm text-gray-500">Connect with 3,000+ apps</p>
                        </div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Configure</button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                          <img src="/placeholder.svg?height=32&width=32" alt="Mailchimp" className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-medium">Mailchimp</h3>
                          <p className="text-sm text-gray-500">Add form respondents to your lists</p>
                        </div>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Connect</button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">API Access</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">API Key</h4>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        <ArrowPathIcon className="h-4 w-4 inline mr-1" />
                        Regenerate
                      </button>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        readOnly
                        className="flex-grow bg-white px-3 py-2 border border-gray-300 rounded-md mr-2"
                      />
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Your API key provides full access to your account. Keep it secure and never share it publicly.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Privacy & Security</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Control who can see your profile information.</p>
                      </div>
                      <select className="bg-white border border-gray-300 rounded-md px-3 py-2">
                        <option>Public</option>
                        <option>Team Only</option>
                        <option>Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Data Collection</p>
                        <p className="text-sm text-gray-500">Allow us to collect usage data to improve our services.</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Cookie Preferences</p>
                        <p className="text-sm text-gray-500">Manage your cookie preferences.</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Manage Cookies
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Login History</p>
                        <p className="text-sm text-gray-500">View your recent login activity.</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View History
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 font-medium">Session Management</p>
                        <p className="text-sm text-gray-500">Manage your active sessions.</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Manage Sessions
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

