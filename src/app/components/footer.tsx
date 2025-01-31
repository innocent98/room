import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white text-center p-4">
      <div className="flex justify-center space-x-4">
        <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
          Terms of Service
        </Link>
        <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900">
          Contact Support
        </Link>
      </div>
    </footer>
  )
}

