"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { message } from "antd"

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "/placeholder.svg?height=128&width=128",
  })
  const [isChanged, setIsChanged] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/profile")

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar: data.avatar || "/placeholder.svg?height=128&width=128",
      })
      setPreviewUrl(data.avatar || "/placeholder.svg?height=128&width=128")
    } catch (error) {
      console.error("Error fetching profile:", error)
      message.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
    setIsChanged(true)
  }

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      message.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image size should be less than 5MB")
      return
    }

    setAvatarFile(file)
    setIsChanged(true)

    // Create a preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      // Create FormData object to handle file upload
      const formData = new FormData()
      formData.append("firstName", profile.firstName)
      formData.append("lastName", profile.lastName)
      formData.append("email", profile.email)
      formData.append("bio", profile.bio)

      // Add current avatar URL if we have one
      if (profile.avatar && !avatarFile) {
        formData.append("currentAvatarUrl", profile.avatar)
      }

      // Add the avatar file if one was selected
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()

      // Update profile with returned data
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar: data.avatar || "/placeholder.svg?height=128&width=128",
      })

      setAvatarFile(null)
      message.success("Profile updated successfully")
      setIsChanged(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      message.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4 relative group">
            <img
              src={previewUrl || profile.avatar || "/placeholder.svg?height=128&width=128"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 cursor-pointer"
              onClick={handlePhotoClick}
            >
              <span className="text-white opacity-0 group-hover:opacity-100 font-medium">Change</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
          />
          <button className="text-indigo-600 text-sm font-medium" onClick={handlePhotoClick}>
            Change Photo
          </button>
          {avatarFile && <p className="text-xs text-gray-500 mt-1">Selected: {avatarFile.name}</p>}
        </div>

        <div className="md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={profile.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={profile.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={profile.bio}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <button
          className={`${
            isChanged ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"
          } text-white px-4 py-2 rounded-md font-medium`}
          onClick={handleSave}
          disabled={!isChanged || loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

