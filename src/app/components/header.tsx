"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  PlusCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { signOut } from "next-auth/react"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

interface User {
  name: string
  email: string
  image: string | null
}

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser({
            name: `${userData.firstName} ${userData.lastName}`.trim(),
            email: userData.email,
            image: userData.avatar,
          })
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/user/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
          setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Set some mock data if API fails
        const mockNotifications = [
          {
            id: "1",
            title: "New response received",
            description: "Customer Feedback Form",
            time: "2 hours ago",
            read: false,
          },
          {
            id: "2",
            title: "Form published successfully",
            description: "Employee Survey 2023",
            time: "1 day ago",
            read: true,
          },
        ]
        setNotifications(mockNotifications)
        setUnreadCount(mockNotifications.filter((n) => !n.read).length)
      }
    }

    fetchUserProfile()
    fetchNotifications()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/signin")
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/user/notifications/${id}/read`, {
        method: "PUT",
      })

      if (response.ok) {
        // Update local state
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id)
    // Navigate or perform action based on notification type
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false)
      setShowUserMenu(false)
    }

    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  // Prevent closing when clicking inside the dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="font-bold text-2xl text-indigo-600">
              ROOM
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard/form/create"
              className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Create Form
            </Link>

            <Link
              href="/dashboard/settings"
              className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Cog6ToothIcon className="h-5 w-5 mr-1" />
              Settings
            </Link>

            <Link
              href="/help"
              className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
              Help
            </Link>

            <div className="relative">
              <button
                className="p-1 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNotifications(!showNotifications)
                  setShowUserMenu(false)
                }}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  onClick={handleDropdownClick}
                >
                  <div className="py-2 px-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 px-4 text-center text-gray-500 text-sm">No notifications</div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`py-2 px-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500">
                            {notification.description} • {notification.time}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="py-2 px-4">
                    <Link href="/notifications" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUserMenu(!showUserMenu)
                  setShowNotifications(false)
                }}
              >
                {user?.image ? (
                  <img
                    src={user.image || "/placeholder.svg"}
                    alt={user?.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
                <span className="ml-2 hidden md:block">{loading ? "Loading..." : user?.name || "User"}</span>
              </button>

              {showUserMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  onClick={handleDropdownClick}
                >
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

