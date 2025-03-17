"use client"

import { useState, useEffect } from "react"
import { Switch, message, Modal } from "antd"

interface PrivacySettings {
  profileVisibility: string
  dataCollection: boolean
  twoFactorEnabled: boolean
}

interface LoginHistoryEntry {
  id: string
  device: string
  location: string
  time: string
  status: string
}

interface SessionEntry {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
}

export default function PrivacySettings() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: "Public",
    dataCollection: true,
    twoFactorEnabled: false,
  })
  const [isChanged, setIsChanged] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([])
  const [sessions, setSessions] = useState<SessionEntry[]>([])

  useEffect(() => {
    fetchPrivacySettings()
  }, [])

  const fetchPrivacySettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/privacy")

      if (!response.ok) {
        throw new Error("Failed to fetch privacy settings")
      }

      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching privacy settings:", error)
      message.error("Failed to load privacy settings")
    } finally {
      setLoading(false)
    }
  }

  const handleVisibilityChange = (value: string) => {
    setSettings({ ...settings, profileVisibility: value })
    setIsChanged(true)
  }

  const handleDataCollectionToggle = (checked: boolean) => {
    setSettings({ ...settings, dataCollection: checked })
    setIsChanged(true)
  }

  const handleTwoFactorToggle = async (checked: boolean) => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/two-factor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: checked,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update two-factor authentication")
      }

      setSettings({ ...settings, twoFactorEnabled: checked })
      message.success(`Two-factor authentication ${checked ? "enabled" : "disabled"}`)
    } catch (error) {
      console.error("Error updating two-factor authentication:", error)
      message.error("Failed to update two-factor authentication")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to update privacy settings")
      }

      message.success("Privacy settings saved successfully")
      setIsChanged(false)
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      message.error("Failed to update privacy settings")
    } finally {
      setLoading(false)
    }
  }

  const handleViewLoginHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/login-history")

      if (!response.ok) {
        throw new Error("Failed to fetch login history")
      }

      const data = await response.json()
      setLoginHistory(data.history || [])
      setShowLoginHistoryModal(true)
    } catch (error) {
      console.error("Error fetching login history:", error)
      message.error("Failed to fetch login history")

      // Set mock data if API fails
      setLoginHistory([
        { id: "1", device: "Chrome on Windows", location: "New York, USA", time: "Today, 10:30 AM", status: "Success" },
        { id: "2", device: "Safari on iPhone", location: "Boston, USA", time: "Yesterday, 3:45 PM", status: "Success" },
        { id: "3", device: "Firefox on Mac", location: "Unknown", time: "Sep 15, 2023", status: "Failed" },
      ])
      setShowLoginHistoryModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/sessions")

      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }

      const data = await response.json()
      setSessions(data.sessions || [])
      setShowSessionsModal(true)
    } catch (error) {
      console.error("Error fetching sessions:", error)
      message.error("Failed to fetch sessions")

      // Set mock data if API fails
      setSessions([
        { id: "1", device: "Chrome on Windows", location: "New York, USA", lastActive: "Active now", current: true },
        { id: "2", device: "Safari on iPhone", location: "Boston, USA", lastActive: "1 hour ago", current: false },
        { id: "3", device: "Firefox on Mac", location: "San Francisco, USA", lastActive: "2 days ago", current: false },
      ])
      setShowSessionsModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to revoke session")
      }

      // Update the sessions list
      setSessions(sessions.filter((session) => session.id !== sessionId))
      message.success("Session revoked successfully")
    } catch (error) {
      console.error("Error revoking session:", error)
      message.error("Failed to revoke session")
    } finally {
      setLoading(false)
    }
  }

  const handleManageCookies = () => {
    setShowCookieModal(true)
  }

  return (
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
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              value={settings.profileVisibility}
              onChange={(e) => handleVisibilityChange(e.target.value)}
              disabled={loading}
            >
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
            <Switch checked={settings.dataCollection} onChange={handleDataCollectionToggle} disabled={loading} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium">Cookie Preferences</p>
              <p className="text-sm text-gray-500">Manage your cookie preferences.</p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={handleManageCookies}>
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
            <Switch checked={settings.twoFactorEnabled} onChange={handleTwoFactorToggle} disabled={loading} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium">Login History</p>
              <p className="text-sm text-gray-500">View your recent login activity.</p>
            </div>
            <button
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={handleViewLoginHistory}
            >
              View History
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium">Session Management</p>
              <p className="text-sm text-gray-500">Manage your active sessions.</p>
            </div>
            <button
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={handleManageSessions}
            >
              Manage Sessions
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <button
          className={`${
            isChanged ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"
          } text-white px-4 py-2 rounded-md font-medium`}
          onClick={handleSaveChanges}
          disabled={!isChanged || loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Cookie Preferences Modal */}
      <Modal
        title="Cookie Preferences"
        open={showCookieModal}
        onCancel={() => setShowCookieModal(false)}
        footer={[
          <button
            key="save"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
            onClick={() => setShowCookieModal(false)}
          >
            Save Preferences
          </button>,
        ]}
        width={600}
      >
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Essential Cookies</p>
              <p className="text-sm text-gray-500">Required for the website to function properly.</p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Performance Cookies</p>
              <p className="text-sm text-gray-500">Help us understand how visitors interact with our website.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Functional Cookies</p>
              <p className="text-sm text-gray-500">Enable enhanced functionality and personalization.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Cookies</p>
              <p className="text-sm text-gray-500">Used to deliver relevant ads and track their effectiveness.</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </div>
      </Modal>

      {/* Login History Modal */}
      <Modal
        title="Login History"
        open={showLoginHistoryModal}
        onCancel={() => setShowLoginHistoryModal(false)}
        footer={null}
        width={700}
      >
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loginHistory.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.device}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        entry.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Sessions Modal */}
      <Modal
        title="Active Sessions"
        open={showSessionsModal}
        onCancel={() => setShowSessionsModal(false)}
        footer={null}
        width={700}
      >
        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!session.current && (
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}

