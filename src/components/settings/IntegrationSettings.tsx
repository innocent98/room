"use client"

import { useState, useEffect } from "react"
import { Switch, message } from "antd"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import ApiKeyManager from "./ApiKeyManager"

interface Integration {
  id: string
  name: string
  description: string
  enabled: boolean
  connected: boolean
  icon: string
  bgColor: string
}

export default function IntegrationSettings() {
  const [loading, setLoading] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••")
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/integrations")

      if (!response.ok) {
        throw new Error("Failed to fetch integrations")
      }

      const data = await response.json()
      setIntegrations(data.integrations || [])

      // Get API key if available
      if (data.apiKey) {
        setApiKey(data.apiKey)
      }
    } catch (error) {
      console.error("Error fetching integrations:", error)
      message.error("Failed to load integrations")

      // Set mock data if API fails
      setIntegrations([
        {
          id: "google-drive",
          name: "Google Drive",
          description: "Connect to store form responses",
          enabled: true,
          connected: true,
          icon: "/placeholder.svg?height=32&width=32",
          bgColor: "bg-blue-100",
        },
        {
          id: "slack",
          name: "Slack",
          description: "Get notifications in your channels",
          enabled: false,
          connected: false,
          icon: "/placeholder.svg?height=32&width=32",
          bgColor: "bg-green-100",
        },
        {
          id: "zapier",
          name: "Zapier",
          description: "Connect with 3,000+ apps",
          enabled: true,
          connected: true,
          icon: "/placeholder.svg?height=32&width=32",
          bgColor: "bg-blue-100",
        },
        {
          id: "mailchimp",
          name: "Mailchimp",
          description: "Add form respondents to your lists",
          enabled: false,
          connected: false,
          icon: "/placeholder.svg?height=32&width=32",
          bgColor: "bg-purple-100",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleIntegration = async (id: string, enabled: boolean) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/integrations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      })

      if (!response.ok) {
        throw new Error("Failed to update integration")
      }

      // Update the integrations list
      setIntegrations(
        integrations.map((integration) => (integration.id === id ? { ...integration, enabled } : integration)),
      )

      message.success(`${enabled ? "Enabled" : "Disabled"} integration successfully`)
    } catch (error) {
      console.error("Error updating integration:", error)
      message.error("Failed to update integration")
    } finally {
      setLoading(false)
    }
  }

  const handleConfigureIntegration = (id: string) => {
    message.info(`Configure ${id} integration - Coming soon`)
  }

  const handleConnectIntegration = (id: string) => {
    message.info(`Connect to ${id} - Coming soon`)
  }

  const handleRegenerateApiKey = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/api-key", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to regenerate API key")
      }

      const data = await response.json()
      setApiKey(data.apiKey)
      setShowApiKey(true)
      message.success("API key regenerated successfully")
    } catch (error) {
      console.error("Error regenerating API key:", error)
      message.error("Failed to regenerate API key")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyApiKey = () => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        message.success("API key copied to clipboard")
      })
      .catch(() => {
        message.error("Failed to copy API key")
      })
  }

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Integrations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {integrations.map((integration) => (
          <div key={integration.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${integration.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                  <img src={integration.icon || "/placeholder.svg"} alt={integration.name} className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
              <Switch
                checked={integration.enabled}
                onChange={(checked) => handleToggleIntegration(integration.id, checked)}
                disabled={loading}
              />
            </div>
            {integration.connected ? (
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={() => handleConfigureIntegration(integration.id)}
              >
                Configure
              </button>
            ) : (
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={() => handleConnectIntegration(integration.id)}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        {/* <h3 className="text-lg font-medium mb-4">API Access</h3> */}
        {/* <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">API Key</h4>
            <button
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={handleRegenerateApiKey}
              disabled={loading}
            >
              <ArrowPathIcon className="h-4 w-4 inline mr-1" />
              Regenerate
            </button>
          </div>
          <div className="flex items-center">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              readOnly
              className="flex-grow bg-white px-3 py-2 border border-gray-300 rounded-md mr-2"
            />
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-medium mr-2"
              onClick={toggleShowApiKey}
            >
              {showApiKey ? "Hide" : "Show"}
            </button>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
              onClick={handleCopyApiKey}
            >
              Copy
            </button>
          </div>
        </div> */}
        {/* <p className="text-sm text-gray-500">
          Your API key provides full access to your account. Keep it secure and never share it publicly.
        </p> */}
        <ApiKeyManager />
      </div>
    </div>
  )
}

