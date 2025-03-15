import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Decline a team invitation
export async function POST(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.invitationId) {
      return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 })
    }

    // Find the invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: {
        id: data.invitationId,
        email: session.user.email,
        status: "PENDING",
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or already processed" }, { status: 404 })
    }

    // Update invitation status
    await prisma.teamInvitation.update({
      where: { id: invitation.id },
      data: { status: "DECLINED" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error declining invitation:", error)
    return NextResponse.json({ error: "Failed to decline invitation" }, { status: 500 })
  }
}

