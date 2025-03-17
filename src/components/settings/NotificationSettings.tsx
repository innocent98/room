"use client"

import { useState, useEffect } from "react"
import { Switch, message } from "antd"

interface NotificationPreference {
  id: string
  type: string
  channel: string
  enabled: boolean
  description: string
}

export default function NotificationSettings() {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [isChanged, setIsChanged] = useState(false)

  useEffect(() => {
    fetchNotificationPreferences()
  }, [])

  const fetchNotificationPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/notifications")

      if (!response.ok) {
        throw new Error("Failed to fetch notification preferences")
      }

      const data = await response.json()
      setPreferences(data.preferences || [])
    } catch (error) {
      console.error("Error fetching notification preferences:", error)
      message.error("Failed to load notification preferences")

      // Set default preferences if API fails
      setPreferences([
        {
          id: "1",
          type: "Form Submissions",
          channel: "email",
          enabled: true,
          description: "Receive an email when someone submits a response to your form.",
        },
        {
          id: "2",
          type: "Form Comments",
          channel: "email",
          enabled: true,
          description: "Receive an email when someone comments on your form.",
        },
        {
          id: "3",
          type: "Marketing Updates",
          channel: "email",
          enabled: false,
          description: "Receive emails about new features and improvements.",
        },
        {
          id: "4",
          type: "Form Submissions",
          channel: "app",
          enabled: true,
          description: "Receive a notification when someone submits a response to your form.",
        },
        {
          id: "5",
          type: "Form Comments",
          channel: "app",
          enabled: true,
          description: "Receive a notification when someone comments on your form.",
        },
        {
          id: "6",
          type: "Team Activity",
          channel: "app",
          enabled: true,
          description: "Receive notifications about team member actions.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePreference = (id: string, enabled: boolean) => {
    setPreferences((prev) => prev.map((pref) => (pref.id === id ? { ...pref, enabled } : pref)))
    setIsChanged(true)
  }

  const handleSavePreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      })

      if (!response.ok) {
        throw new Error("Failed to update notification preferences")
      }

      message.success("Notification preferences saved successfully")
      setIsChanged(false)
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      message.error("Failed to update notification preferences")
    } finally {
      setLoading(false)
    }
  }

  const emailPreferences = preferences.filter((pref) => pref.channel === "email")
  const appPreferences = preferences.filter((pref) => pref.channel === "app")

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {emailPreferences.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">{pref.type}</p>
                  <p className="text-sm text-gray-500">{pref.description}</p>
                </div>
                <Switch
                  checked={pref.enabled}
                  onChange={(checked) => handleTogglePreference(pref.id, checked)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
          <div className="space-y-4">
            {appPreferences.map((pref) => (
              <div key={pref.id} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">{pref.type}</p>
                  <p className="text-sm text-gray-500">{pref.description}</p>
                </div>
                <Switch
                  checked={pref.enabled}
                  onChange={(checked) => handleTogglePreference(pref.id, checked)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            className={`${
              isChanged ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"
            } text-white px-4 py-2 rounded-md font-medium`}
            onClick={handleSavePreferences}
            disabled={!isChanged || loading}
          >
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  )
}

