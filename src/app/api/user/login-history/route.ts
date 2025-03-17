import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/user/login-history - Get login history for the current user
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get login history for the user
    const loginHistory = await prisma.loginHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "desc" },
      take: 20, // Limit to the most recent 20 entries
    })

    // Format login history for the frontend
    const formattedHistory = loginHistory.map((entry) => ({
      id: entry.id,
      device: entry.device || "Unknown device",
      location: entry.location || "Unknown location",
      time: formatTimestamp(entry.timestamp),
      status: entry.status,
    }))

    return NextResponse.json({ history: formattedHistory })
  } catch (error) {
    console.error("Error fetching login history:", error)
    return NextResponse.json({ error: "Failed to fetch login history" }, { status: 500 })
  }
}

// Helper function to format timestamp
function formatTimestamp(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date >= today) {
    return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  } else if (date >= yesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  } else {
    return date.toLocaleDateString()
  }
}

