import Link from "next/link"
import { HomeIcon, DocumentPlusIcon, ChartBarIcon, ChartPieIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"

export default function Sidebar() {
  return (
    <aside className="bg-white w-64 p-6 hidden md:block">
      <nav className="space-y-4">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/create" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
          <DocumentPlusIcon className="h-5 w-5" />
          <span>Form Creation</span>
        </Link>
        <Link href="/responses" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
          <ChartBarIcon className="h-5 w-5" />
          <span>Responses</span>
        </Link>
        {/* <Link href="/analytics" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
          <ChartPieIcon className="h-5 w-5" />
          <span>Analytics</span>
        </Link>
        <Link href="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
          <Cog6ToothIcon className="h-5 w-5" />
          <span>Settings</span>
        </Link> */}
      </nav>
    </aside>
  )
}

