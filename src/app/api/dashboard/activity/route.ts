import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent form activity
    const recentForms = await prisma.form.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    })

    // Format the data for the frontend
    const activities = recentForms.map((form) => {
      // Format the status
      let status: "active" | "draft" | "completed" | "archived"
      switch (form.status) {
        case "published":
          status = "active"
          break
        case "draft":
          status = "draft"
          break
        case "closed":
          status = "completed"
          break
        case "archived":
          status = "archived"
          break
        default:
          status = "draft"
      }

      // Format the last updated time
      const lastUpdated = formatTimeAgo(form.updatedAt)

      return {
        id: form.id,
        title: form.title,
        status,
        lastUpdated,
      }
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching dashboard activity:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard activity" }, { status: 500 })
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) {
    return "just now"
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString()
  }
}

