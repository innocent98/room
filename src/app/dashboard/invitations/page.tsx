"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Spin, message } from "antd"
import Layout from "@/components/layout"
import { useRouter } from "next/navigation"

interface Invitation {
  id: string
  teamId: string
  email: string
  role: string
  token: string
  expires: string
  createdAt: string
  team: {
    id: string
    name: string
  }
  invitedBy: {
    id: string
    name: string
    email: string
    image: string
  }
}

export default function InvitationsPage() {
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const fetchInvitations = async () => {
    try {
      setLoading(true)

      // Fetch pending invitations from the API
      const response = await fetch("/api/invitations")

      if (!response.ok) {
        throw new Error("Failed to fetch invitations")
      }

      const data = await response.json()
      setInvitations(data)
    } catch (error) {
      console.error("Error fetching invitations:", error)
      message.error("Failed to load invitations")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async (token: string) => {
    setProcessingId(token)

    try {
      const response = await fetch(`/api/invitations/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to accept invitation")
      }

      const data = await response.json()

      message.success(`You've joined ${data.team.name}!`)

      // Remove the invitation from the list
      setInvitations(invitations.filter((inv) => inv.token !== token))

      // Redirect to the team page
      router.push(`/dashboard/team/${data.team.id}`)
    } catch (error) {
      // console.log("Error accepting invitation:", error)
      message.error(error instanceof Error ? error.message : "Failed to accept invitation")
    } finally {
      setProcessingId(null)
    }
  }

  const handleDeclineInvitation = async (token: string) => {
    setProcessingId(token)

    try {
      const response = await fetch(`/api/invitations/${token}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to decline invitation")
      }

      message.success("Invitation declined")

      // Remove the invitation from the list
      setInvitations(invitations.filter((inv) => inv.token !== token))
    } catch (error) {
      console.error("Error declining invitation:", error)
      message.error(error instanceof Error ? error.message : "Failed to decline invitation")
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
          <span className="ml-2">Loading invitations...</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Team Invitations</h1>
          <p className="text-gray-600">Review and respond to your pending team invitations.</p>
        </motion.div>

        {invitations.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl p-8 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No pending invitations</h3>
            <p className="text-gray-500 mb-4">You don't have any pending team invitations at the moment.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation, index) => (
              <motion.div
                key={invitation.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{invitation.team.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You've been invited by {invitation.invitedBy.name || invitation.invitedBy.email} to join as a{" "}
                      <span className="font-medium">{invitation.role.toLowerCase()}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Invited on {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Expires on {new Date(invitation.expires).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <button
                      onClick={() => handleDeclineInvitation(invitation.token)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center"
                      disabled={processingId === invitation.token}
                    >
                      <XMarkIcon className="h-5 w-5 mr-1" />
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptInvitation(invitation.token)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center"
                      disabled={processingId === invitation.token}
                    >
                      <CheckIcon className="h-5 w-5 mr-1" />
                      {processingId === invitation.token ? "Processing..." : "Accept"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

