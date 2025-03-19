"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  DocumentPlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FolderIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      current: pathname === "/",
    },
    {
      name: "Form Creation",
      href: "/dashboard/form/create",
      icon: DocumentPlusIcon,
      current: pathname === "/dashboard/form/create",
    },
    {
      name: "Forms & Responses",
      href: "/dashboard/form/responses",
      icon: ChartBarIcon,
      current: pathname === "/responses",
    },
    // { name: "Analytics", href: "/analytics", icon: ChartPieIcon, current: pathname === "/analytics" },
    {
      name: "Templates",
      href: "/dashboard/form-templates",
      icon: FolderIcon,
      current: pathname === "/dashboard/templates",
    },
    {
      name: "Team",
      href: "/dashboard/team",
      icon: UsersIcon,
      current: pathname === "/dashboard/team",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Cog6ToothIcon,
      current: pathname === "/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", );

      if (response.ok) {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full flex flex-col justify-between py-4">
        <div>
          <div className="px-4 mb-6 flex justify-between items-center">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-gray-800">
                Navigation
              </h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {collapsed ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                )}
              </svg>
            </button>
          </div>

          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-3 text-sm font-medium rounded-md
                  ${
                    item.current
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  }
                `}
              >
                <item.icon
                  className={`
                    ${
                      item.current
                        ? "text-indigo-600"
                        : "text-gray-500 group-hover:text-indigo-600"
                    }
                    mr-3 h-5 w-5 flex-shrink-0
                  `}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-2">
          {!collapsed && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">
                Pro Plan
              </h3>
              <p className="text-xs text-indigo-700 mb-3">
                You're using the Pro plan with premium features.
              </p>
              <div className="w-full bg-white rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full w-3/4"></div>
              </div>
              <p className="text-xs text-indigo-700 mt-2">
                75% of your storage used
              </p>
            </div>
          )}

          <button
            onClick={() => signOut()}
            className={`
            flex items-center w-full px-2 py-3 text-sm font-medium rounded-md
            text-gray-700 hover:bg-gray-50 hover:text-red-600
          `}
          >
            <ArrowLeftOnRectangleIcon className="text-gray-500 mr-3 h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
