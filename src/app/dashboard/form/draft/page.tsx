"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { Dropdown, Menu, Button, Tooltip, Modal, Input, message, Spin } from "antd"
import Layout from "@/components/layout"

interface Draft {
  id: string
  title: string
  lastEdited: string
  fields: any[]
  thumbnail?: string
}

export default function DraftsPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("lastEdited")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [draftToRename, setDraftToRename] = useState<string | null>(null)
  const [newDraftName, setNewDraftName] = useState("")
  const [loading, setLoading] = useState(true)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/forms/drafts")
      if (!response.ok) {
        throw new Error("Failed to fetch drafts")
      }

      const data = await response.json()

      // Transform the data to match our UI structure
      const transformedDrafts = data.map((draft: any) => ({
        id: draft.id,
        title: draft.title,
        lastEdited: draft.updatedAt,
        fields: draft.fields,
        thumbnail: "/placeholder.svg?height=160&width=280",
      }))

      setDrafts(transformedDrafts)
    } catch (error) {
      console.error("Error fetching drafts:", error)
      message.error("Failed to load drafts")
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort drafts
  const filteredDrafts = drafts
    .filter((draft) => draft.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "lastEdited") {
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "fields") {
        return b.fields.length - a.fields.length
      }
      return 0
    })

  const handleEditDraft = (draftId: string) => {
    router.push(`/create?draft=${draftId}`)
  }

  const handleDeleteDraft = (draftId: string) => {
    setDraftToDelete(draftId)
    setShowDeleteModal(true)
  }

  const confirmDeleteDraft = async () => {
    if (draftToDelete) {
      try {
        const response = await fetch(`/api/forms/${draftToDelete}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete draft")
        }

        setDrafts(drafts.filter((draft) => draft.id !== draftToDelete))
        message.success("Draft deleted successfully")
      } catch (error) {
        console.error("Error deleting draft:", error)
        message.error("Failed to delete draft")
      } finally {
        setShowDeleteModal(false)
        setDraftToDelete(null)
      }
    }
  }

  const handleDuplicateDraft = async (draftId: string) => {
    try {
      const draftToDuplicate = drafts.find((draft) => draft.id === draftId)

      if (!draftToDuplicate) {
        throw new Error("Draft not found")
      }

      const response = await fetch("/api/forms/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${draftToDuplicate.title} (Copy)`,
          fields: draftToDuplicate.fields,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to duplicate draft")
      }

      const newDraft = await response.json()

      // Transform the new draft to match our UI structure
      const transformedDraft = {
        id: newDraft.id,
        title: newDraft.title,
        lastEdited: newDraft.updatedAt,
        fields: newDraft.fields,
        thumbnail: "/placeholder.svg?height=160&width=280",
      }

      setDrafts([transformedDraft, ...drafts])
      message.success("Draft duplicated successfully")
    } catch (error) {
      console.error("Error duplicating draft:", error)
      message.error("Failed to duplicate draft")
    }
  }

  const handleRenameDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId)
    if (draft) {
      setDraftToRename(draftId)
      setNewDraftName(draft.title)
      setShowRenameModal(true)
    }
  }

  const confirmRenameDraft = async () => {
    if (draftToRename && newDraftName.trim()) {
      try {
        const response = await fetch(`/api/forms/${draftToRename}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newDraftName.trim(),
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to rename draft")
        }

        setDrafts(
          drafts.map((draft) => (draft.id === draftToRename ? { ...draft, title: newDraftName.trim() } : draft)),
        )

        message.success("Draft renamed successfully")
      } catch (error) {
        console.error("Error renaming draft:", error)
        message.error("Failed to rename draft")
      } finally {
        setShowRenameModal(false)
        setDraftToRename(null)
        setNewDraftName("")
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Layout>
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Form Drafts</h1>
            <p className="text-gray-600">Continue working on your saved forms or create a new one.</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircleIcon className="h-5 w-5 mr-2" />}
            onClick={() => router.push("/create")}
            className="flex items-center"
          >
            Create New Form
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative w-full md:w-auto flex-grow md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search drafts..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            className="border border-gray-300 rounded-md text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="lastEdited">Last Edited</option>
            <option value="title">Title</option>
            <option value="fields">Number of Fields</option>
          </select>
          <Button icon={<ArrowPathIcon className="h-5 w-5" />} onClick={fetchDrafts} className="flex items-center">
            Refresh
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
          <span className="ml-2">Loading drafts...</span>
        </div>
      ) : filteredDrafts.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl p-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No drafts found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "We couldn't find any drafts matching your search criteria."
              : "You haven't created any drafts yet. Start by creating a new form."}
          </p>
          <Button type="primary" onClick={() => router.push("/create")}>
            Create New Form
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredDrafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={draft.thumbnail || "/placeholder.svg"}
                  alt={draft.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex items-center">
                    {draft.fields.length} fields
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold truncate" title={draft.title}>
                    {draft.title}
                  </h3>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="rename" onClick={() => handleRenameDraft(draft.id)}>
                          Rename
                        </Menu.Item>
                        <Menu.Item key="duplicate" onClick={() => handleDuplicateDraft(draft.id)}>
                          Duplicate
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="delete" danger onClick={() => handleDeleteDraft(draft.id)}>
                          Delete
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                  >
                    <Button type="text" size="small">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </Button>
                  </Dropdown>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Last edited {formatDate(draft.lastEdited)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="primary"
                    icon={<PencilIcon className="h-4 w-4 mr-1" />}
                    onClick={() => handleEditDraft(draft.id)}
                    className="flex-grow flex items-center justify-center"
                  >
                    Edit
                  </Button>
                  <Tooltip title="Duplicate">
                    <Button
                      icon={<DocumentDuplicateIcon className="h-4 w-4" />}
                      onClick={() => handleDuplicateDraft(draft.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      danger
                      icon={<TrashIcon className="h-4 w-4" />}
                      onClick={() => handleDeleteDraft(draft.id)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Draft"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={confirmDeleteDraft}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this draft? This action cannot be undone.</p>
      </Modal>

      {/* Rename Modal */}
      <Modal
        title="Rename Draft"
        open={showRenameModal}
        onCancel={() => setShowRenameModal(false)}
        onOk={confirmRenameDraft}
        okText="Rename"
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Draft Name</label>
          <Input
            value={newDraftName}
            onChange={(e) => setNewDraftName(e.target.value)}
            placeholder="Enter draft name"
          />
        </div>
      </Modal>
    </Layout>
  )
}

