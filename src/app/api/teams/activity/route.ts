import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Get activity logs for a team
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
    }

    // Check if user is a member of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real application, you would have an ActivityLog model
    // For now, we'll return mock data
    const activityLogs = [
      {
        id: 1,
        user: "Victor Smith",
        action: "created a new form",
        target: "Customer Feedback Survey",
        time: "2 hours ago",
      },
      {
        id: 2,
        user: "Jane Cooper",
        action: "edited",
        target: "Product Evaluation Form",
        time: "Yesterday at 3:45 PM",
      },
      {
        id: 3,
        user: "Victor Smith",
        action: "invited",
        target: "alex.morgan@example.com",
        time: "Sep 10, 2023",
      },
      {
        id: 4,
        user: "Robert Johnson",
        action: "viewed responses for",
        target: "Employee Satisfaction Survey",
        time: "Sep 8, 2023",
      },
    ]

    return NextResponse.json(activityLogs)
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 })
  }
}

