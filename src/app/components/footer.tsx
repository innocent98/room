import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-500 text-sm">© 2023 ROOM. All rights reserved.</span>
          </div>

          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

