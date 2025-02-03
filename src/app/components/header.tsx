import Link from "next/link"
import { PlusCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, UserIcon } from "@heroicons/react/24/outline"

export default function Header() {
  return (
    <header className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl">
              ROOM
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/create" className="flex items-center">
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Create Form
            </Link>
            {/* <Link href="/settings" className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-1" />
              Settings
            </Link> */}
            <Link href="/help" className="flex items-center">
              <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
              Help Center
            </Link>
            <button className="flex items-center">
              <UserIcon className="h-5 w-5 mr-1" />
              Victor
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

