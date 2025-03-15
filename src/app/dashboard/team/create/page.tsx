"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import { message, Spin } from "antd"
import Layout from "@/components/layout"
import { useRouter } from "next/navigation"

export default function CreateTeamPage() {
  const router = useRouter()
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [creating, setCreating] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamName.trim()) {
      message.error("Team name is required")
      return
    }

    setCreating(true)

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teamName,
          description: teamDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create team")
      }

      const data = await response.json()

      message.success("Team created successfully!")
      router.push(`/dashboard/team?id=${data.id}`)
    } catch (error) {
      console.error("Error creating team:", error)
      message.error("Failed to create team")
    } finally {
      setCreating(false)
    }
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Create a New Team</h1>
          <p className="text-gray-600">Teams help you collaborate with others on forms and share responses.</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleCreateTeam}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Marketing Team"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What does your team do?"
                rows={3}
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">About Teams</h3>
                  <p className="text-sm text-gray-500">
                    Teams allow you to collaborate with others. You'll be the team owner with full control over members
                    and settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium mr-3"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Spin size="small" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Team"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  )
}

