import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// PUT /api/user/two-factor - Enable or disable two-factor authentication
export async function PUT(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enabled } = await request.json()

    if (typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Enabled status must be a boolean" }, { status: 400 })
    }

    // Update the user's two-factor authentication status
    // Note: This is a simplified implementation. In a real application,
    // enabling 2FA would involve generating and verifying a TOTP secret
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: enabled,
      },
    })

    return NextResponse.json({ success: true, enabled })
  } catch (error) {
    console.error("Error updating two-factor authentication:", error)
    return NextResponse.json({ error: "Failed to update two-factor authentication" }, { status: 500 })
  }
}

