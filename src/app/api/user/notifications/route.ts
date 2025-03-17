import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/user/notifications - Get the current user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch notification preferences from the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        notificationPreferences: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse notification preferences or use defaults
    let preferences = []

    try {
      if (user.notificationPreferences) {
        preferences = JSON.parse(user.notificationPreferences as string)
      }
    } catch (e) {
      console.error("Error parsing notification preferences:", e)
    }

    // If no preferences are set, use defaults
    if (!preferences || !preferences.length) {
      preferences = [
        {
          id: "1",
          type: "Form Submissions",
          channel: "email",
          enabled: true,
          description: "Receive an email when someone submits a response to your form.",
        },
        {
          id: "2",
          type: "Form Comments",
          channel: "email",
          enabled: true,
          description: "Receive an email when someone comments on your form.",
        },
        {
          id: "3",
          type: "Marketing Updates",
          channel: "email",
          enabled: false,
          description: "Receive emails about new features and improvements.",
        },
        {
          id: "4",
          type: "Form Submissions",
          channel: "app",
          enabled: true,
          description: "Receive a notification when someone submits a response to your form.",
        },
        {
          id: "5",
          type: "Form Comments",
          channel: "app",
          enabled: true,
          description: "Receive a notification when someone comments on your form.",
        },
        {
          id: "6",
          type: "Team Activity",
          channel: "app",
          enabled: true,
          description: "Receive notifications about team member actions.",
        },
      ]
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)
    return NextResponse.json({ error: "Failed to fetch notification preferences" }, { status: 500 })
  }
}

// PUT /api/user/notifications - Update the current user's notification preferences
export async function PUT(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { preferences } = await request.json()

    if (!preferences || !Array.isArray(preferences)) {
      return NextResponse.json({ error: "Invalid preferences format" }, { status: 400 })
    }

    // Update the user's notification preferences
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notificationPreferences: JSON.stringify(preferences),
      },
    })

    return NextResponse.json({ success: true, preferences })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    return NextResponse.json({ error: "Failed to update notification preferences" }, { status: 500 })
  }
}

