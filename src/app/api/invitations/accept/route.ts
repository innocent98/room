import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Accept a team invitation
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
      include: {
        team: true,
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or already processed" }, { status: 404 })
    }

    // Check if user is already a member of the team
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: invitation.teamId,
        userId: session.user.id,
      },
    })

    if (existingMembership) {
      // Update invitation status
      await prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      })

      return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 })
    }

    // Create team membership and update invitation status in a transaction
    const result = await prisma.$transaction([
      prisma.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId: session.user.id,
          role: invitation.role,
        },
      }),
      prisma.teamInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      }),
    ])

    return NextResponse.json({
      success: true,
      teamId: invitation.teamId,
      teamName: invitation.team.name,
    })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 })
  }
}

