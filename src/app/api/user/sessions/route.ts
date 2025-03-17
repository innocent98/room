import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/user/sessions - Get all active sessions for the current user
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all active sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        expires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        sessionToken: true,
        expires: true,
        lastActive: true,
        device: true,
        ipAddress: true,
        location: true,
      },
      orderBy: { lastActive: "desc" },
    })

    // Format sessions for the frontend
    const formattedSessions = sessions.map((s) => {
      // Determine if this is the current session
      const isCurrent = s.sessionToken === session.sessionToken

      return {
        id: s.id,
        device: s.device || "Unknown device",
        location: s.location || "Unknown location",
        lastActive: isCurrent ? "Active now" : formatLastActive(s.lastActive),
        expires: s.expires,
        current: isCurrent,
      }
    })

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

// Helper function to format last active time
function formatLastActive(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

  return date.toLocaleDateString()
}

