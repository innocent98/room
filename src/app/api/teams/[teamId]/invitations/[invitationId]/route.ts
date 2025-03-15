import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Resend an invitation
export async function POST(request: NextRequest, { params }: { params: { teamId: string; invitationId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const { teamId, invitationId } = params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
    })

    if (!invitation || invitation.teamId !== teamId) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Update the invitation with a new token and expiration date
    const updatedInvitation = await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: {
        updatedAt: new Date(),
      },
    })

    // TODO: Send invitation email

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error resending invitation ${params.invitationId}:`, error)
    return NextResponse.json({ error: "Failed to resend invitation" }, { status: 500 })
  }
}

// Cancel an invitation
export async function DELETE(request: NextRequest, { params }: { params: { teamId: string; invitationId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const { teamId, invitationId } = params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
    })

    if (!invitation || invitation.teamId !== teamId) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Delete the invitation
    await prisma.teamInvitation.delete({
      where: { id: invitationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error cancelling invitation ${params.invitationId}:`, error)
    return NextResponse.json({ error: "Failed to cancel invitation" }, { status: 500 })
  }
}

