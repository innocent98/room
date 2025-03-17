"use client"

import { useState, useEffect } from "react"
import { Switch, message, Modal } from "antd"
import ApiKeyManager from "./ApiKeyManager"

interface Integration {
  id: string
  name: string
  description: string
  enabled: boolean
  connected: boolean
  icon: string
  bgColor: string
  type: string
}

export default function IntegrationSettings() {
  const [loading, setLoading] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••")
  const [showApiKey, setShowApiKey] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

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

  const handleConfigureIntegration = (integration: Integration) => {
    message.info(`Configure ${integration.name} integration - Coming soon`)
  }

  const handleConnectIntegration = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowConnectModal(true)
  }

  const handleConnect = async () => {
    if (!selectedIntegration) return

    try {
      setLoading(true)
      const response = await fetch(`/api/user/integrations/${selectedIntegration.type}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedIntegration.name,
          enabled: true,
          config: {},
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to connect integration")
      }

      // Refresh integrations
      await fetchIntegrations()

      message.success(`Connected to ${selectedIntegration.name} successfully`)
      setShowConnectModal(false)
    } catch (error) {
      console.error("Error connecting integration:", error)
      message.error("Failed to connect integration")
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
                disabled={loading || !integration.connected}
              />
            </div>
            {integration.connected ? (
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={() => handleConfigureIntegration(integration)}
              >
                Configure
              </button>
            ) : (
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                onClick={() => handleConnectIntegration(integration)}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6 mb-8">
        <ApiKeyManager />
      </div>

      {/* Connect Integration Modal */}
      <Modal
        title={`Connect to ${selectedIntegration?.name}`}
        open={showConnectModal}
        onCancel={() => setShowConnectModal(false)}
        footer={[
          <button
            key="cancel"
            onClick={() => setShowConnectModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
          >
            Cancel
          </button>,
          <button
            key="connect"
            onClick={handleConnect}
            disabled={loading}
            className={`px-4 py-2 rounded-md ${
              loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? "Connecting..." : "Connect"}
          </button>,
        ]}
      >
        <div className="py-4">
          <p className="mb-4">You're about to connect your account to {selectedIntegration?.name}. This will allow:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Automatic data synchronization</li>
            <li>Access to your form responses</li>
            <li>Integration with your workflow</li>
          </ul>
          <p className="text-sm text-gray-500">You can disconnect this integration at any time from your settings.</p>
        </div>
      </Modal>
    </div>
  )
}

