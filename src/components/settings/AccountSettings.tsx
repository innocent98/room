"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Switch, Modal, message } from "antd"

export default function AccountSettings() {
  const [loading, setLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    // fetchAccountSettings()
  }, [])

  const fetchAccountSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/account")

      if (!response.ok) {
        throw new Error("Failed to fetch account settings")
      }

      const data = await response.json()
      setTwoFactorEnabled(data.twoFactorEnabled || false)
    } catch (error) {
      console.error("Error fetching account settings:", error)
      message.error("Failed to load account settings")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword) {
      message.error("Please enter your current password")
      return
    }

    if (!passwordData.newPassword) {
      message.error("Please enter a new password")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error("New passwords do not match")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update password")
      }

      message.success("Password updated successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      message.error(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTwoFactor = async (checked: boolean) => {
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

      setTwoFactorEnabled(checked)
      message.success(`Two-factor authentication ${checked ? "enabled" : "disabled"}`)
    } catch (error) {
      console.error("Error updating two-factor authentication:", error)
      message.error("Failed to update two-factor authentication")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/account", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete account")
      }

      message.success("Account deleted successfully")
      // Redirect to sign-in page or home page
      window.location.href = "/signin"
    } catch (error) {
      console.error("Error deleting account:", error)
      message.error("Failed to delete account")
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Account Settings</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
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
          <Switch checked={twoFactorEnabled} onChange={handleToggleTwoFactor} disabled={loading} />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium mb-2">Delete Account</h4>
          <p className="text-red-700 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50 font-medium"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      <Modal
        title="Delete Account"
        open={showDeleteModal}
        onOk={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        okText="Yes, Delete My Account"
        okButtonProps={{ danger: true, loading }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete your account? This action cannot be undone and all your data will be
          permanently deleted.
        </p>
      </Modal>
    </div>
  )
}

