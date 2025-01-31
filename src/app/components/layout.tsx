import type React from "react"
import Header from "./header"
import Sidebar from "./sidebar"
import Footer from "./footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-secondary">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

