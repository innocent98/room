"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { Spin, message } from "antd"
import Layout from "@/components/layout"

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
    description?: string
  }
  invitedBy: {
    id: string
    name: string
    email: string
    image: string
  }
}

export default function InvitationPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    if (token) {
      fetchInvitation()
    }
  }, [token])

  const fetchInvitation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/invitations/${token}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError("This invitation link is invalid or has expired")
        } else {
          const data = await response.json()
          setError(data.error || "Failed to load invitation")
        }
        return
      }

      const data = await response.json()
      setInvitation(data)
    } catch (error) {
      console.error("Error fetching invitation:", error)
      setError("Failed to load invitation details")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvitation = async () => {
    setProcessing(true)

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

      // Redirect to the team page
      router.push(`/dashboard/team/${data.team.id}`)
    } catch (error) {
      console.error("Error accepting invitation:", error)
      message.error(error instanceof Error ? error.message : "Failed to accept invitation")
    } finally {
      setProcessing(false)
    }
  }

  const handleDeclineInvitation = async () => {
    setProcessing(true)

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

      // Redirect to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error declining invitation:", error)
      message.error(error instanceof Error ? error.message : "Failed to decline invitation")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
          <span className="ml-2">Loading invitation...</span>
        </div>
      </Layout>
    )
  }

  if (error || !invitation) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-xl p-8 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Invalid Invitation</h3>
            <p className="text-gray-500 mb-4">{error || "This invitation link is invalid or has expired."}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-md p-8 border border-gray-200"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Team Invitation</h1>
            <p className="text-gray-600">You've been invited to join a team on ROOM</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{invitation.team.name}</h2>
            {invitation.team.description && <p className="text-gray-600 mb-4">{invitation.team.description}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Invited by:</span>{" "}
                  {invitation.invitedBy.name || invitation.invitedBy.email}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Role:</span> {invitation.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Invited on:</span> {new Date(invitation.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Expires on:</span> {new Date(invitation.expires).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleDeclineInvitation}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center"
              disabled={processing}
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Decline Invitation
            </button>
            <button
              onClick={handleAcceptInvitation}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center justify-center"
              disabled={processing}
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              {processing ? "Processing..." : "Accept Invitation"}
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

