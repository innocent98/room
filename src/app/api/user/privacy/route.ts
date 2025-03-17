import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/user/privacy - Get the current user's privacy settings
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user with privacy settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        privacySettings: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse privacy settings or use defaults
    let privacySettings = {
      profileVisibility: "Public",
      dataCollection: true,
    }

    try {
      if (user.privacySettings) {
        privacySettings = {
          ...privacySettings,
          ...JSON.parse(user.privacySettings as string),
        }
      }
    } catch (e) {
      console.error("Error parsing privacy settings:", e)
    }

    return NextResponse.json({
      ...privacySettings,
      twoFactorEnabled: user.twoFactorEnabled,
    })
  } catch (error) {
    console.error("Error fetching privacy settings:", error)
    return NextResponse.json({ error: "Failed to fetch privacy settings" }, { status: 500 })
  }
}

// PUT /api/user/privacy - Update the current user's privacy settings
export async function PUT(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Extract two-factor authentication setting
    const { twoFactorEnabled, ...privacySettings } = data

    // Update the user's privacy settings
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        privacySettings: JSON.stringify(privacySettings),
      },
      select: {
        id: true,
        privacySettings: true,
        twoFactorEnabled: true,
      },
    })

    // Parse the updated privacy settings
    let parsedSettings = {
      profileVisibility: "Public",
      dataCollection: true,
    }

    try {
      if (updatedUser.privacySettings) {
        parsedSettings = {
          ...parsedSettings,
          ...JSON.parse(updatedUser.privacySettings as string),
        }
      }
    } catch (e) {
      console.error("Error parsing updated privacy settings:", e)
    }

    return NextResponse.json({
      ...parsedSettings,
      twoFactorEnabled: updatedUser.twoFactorEnabled,
    })
  } catch (error) {
    console.error("Error updating privacy settings:", error)
    return NextResponse.json({ error: "Failed to update privacy settings" }, { status: 500 })
  }
}

