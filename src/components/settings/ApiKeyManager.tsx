"use client"

import { useState, useEffect } from "react"
import { message, Modal, Popconfirm } from "antd"
import { EyeIcon, EyeSlashIcon, ClipboardIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"

interface ApiKey {
  id: string
  name: string
  createdAt: string
  lastUsed?: string
  expiresAt?: string
}

export default function ApiKeyManager() {
  const [loading, setLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [showNewKey, setShowNewKey] = useState(true)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/api-key")

      if (!response.ok) {
        throw new Error("Failed to fetch API keys")
      }

      const data = await response.json()
      setApiKeys(data.apiKeys || [])
    } catch (error) {
      console.error("Error fetching API keys:", error)
      message.error("Failed to load API keys")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      message.error("Please enter a name for your API key")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/user/api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create API key")
      }

      const data = await response.json()
      setNewKey(data.key)

      // Refresh the list of API keys
      fetchApiKeys()

      message.success("API key created successfully")
    } catch (error) {
      console.error("Error creating API key:", error)
      message.error("Failed to create API key")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/api-key/${keyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      // Remove the deleted key from the state
      setApiKeys(apiKeys.filter((key) => key.id !== keyId))
      message.success("API key deleted successfully")
    } catch (error) {
      console.error("Error deleting API key:", error)
      message.error("Failed to delete API key")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        message.success("API key copied to clipboard")
      })
      .catch(() => {
        message.error("Failed to copy API key")
      })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">API Keys</h3>
        <button
          onClick={() => {
            setShowCreateModal(true)
            setNewKeyName("")
            setNewKey(null)
          }}
          className="flex items-center text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Create New Key
        </button>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">No API keys found</p>
          <button
            onClick={() => {
              setShowCreateModal(true)
              setNewKeyName("")
              setNewKey(null)
            }}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Create your first API key
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(key.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.lastUsed ? formatDate(key.lastUsed) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.expiresAt ? formatDate(key.expiresAt) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Popconfirm
                      title="Delete API Key"
                      description="Are you sure you want to delete this API key? This action cannot be undone."
                      onConfirm={() => handleDeleteApiKey(key.id)}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create API Key Modal */}
      <Modal
        title={newKey ? "API Key Created" : "Create New API Key"}
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false)
          setNewKey(null)
        }}
        footer={
          newKey
            ? [
                <button
                  key="close"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewKey(null)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>,
              ]
            : [
                <button
                  key="cancel"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>,
                <button
                  key="create"
                  onClick={handleCreateApiKey}
                  disabled={loading || !newKeyName.trim()}
                  className={`px-4 py-2 rounded-md ${
                    loading || !newKeyName.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Creating..." : "Create API Key"}
                </button>,
              ]
        }
      >
        {newKey ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your API key has been created. Please copy it now as you won't be able to see it again.
            </p>
            <div className="flex items-center">
              <input
                type={showNewKey ? "text" : "password"}
                value={newKey}
                readOnly
                className="flex-grow bg-gray-50 px-3 py-2 border border-gray-300 rounded-md mr-2 font-mono text-sm"
              />
              <button
                onClick={() => setShowNewKey(!showNewKey)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title={showNewKey ? "Hide" : "Show"}
              >
                {showNewKey ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => handleCopyApiKey(newKey)}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Copy to clipboard"
              >
                <ClipboardIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This key will not be shown again. Make sure to store it securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              API keys allow external applications to access your account. Be careful who you share them with.
            </p>
            <div>
              <label htmlFor="key-name" className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                type="text"
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Development, Production, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

