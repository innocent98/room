"use client"

import { useState } from "react"
import Link from "next/link"
import {
  PlusCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { UserCircleIcon } from "@heroicons/react/24/solid"

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-2xl text-indigo-600">
              ROOM
            </Link>

            {/* <div className="hidden md:block ml-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search forms..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div> */}
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
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-2 px-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium">New response received</p>
                      <p className="text-xs text-gray-500">Customer Feedback Form • 2 hours ago</p>
                    </div>
                    <div className="py-2 px-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium">Form published successfully</p>
                      <p className="text-xs text-gray-500">Employee Survey 2023 • 1 day ago</p>
                    </div>
                  </div>
                  <div className="py-2 px-4">
                    <Link href="/notifications" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <button className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="ml-2 hidden md:block">Victor</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

