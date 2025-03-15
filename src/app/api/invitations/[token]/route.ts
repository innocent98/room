import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logTeamActivity } from "@/lib/activity-logger"

const prisma = new PrismaClient()

// Get invitation details
export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const token = params.token

    // Find the invitation
    const invitation = await prisma.teamInvitation.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        team: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or expired" }, { status: 404 })
    }

    return NextResponse.json(invitation)
  } catch (error) {
    console.error(`Error fetching invitation ${params.token}:`, error)
    return NextResponse.json({ error: "Failed to fetch invitation" }, { status: 500 })
  }
}

// Accept an invitation
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const token = params.token

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the invitation
    const invitation = await prisma.teamInvitation.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        team: true,
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found or expired" }, { status: 404 })
    }

    // Check if the invitation email matches the user's email
    if (invitation.email.toLowerCase() !== session.user.email?.toLowerCase()) {
      return NextResponse.json({ error: "This invitation is for a different email address" }, { status: 403 })
    }

    // Check if user is already a member
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        teamId: invitation.teamId,
        userId: session.user.id,
      },
    })

    if (existingMembership) {
      // Delete the invitation since the user is already a member
      await prisma.teamInvitation.delete({
        where: {
          id: invitation.id,
        },
      })

      return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 })
    }

    // Add user to team and delete the invitation
    const newMember = await prisma.$transaction(async (tx) => {
      // Add user to team
      const member = await tx.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId: session.user.id,
          role: invitation.role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })

      // Delete the invitation
      await tx.teamInvitation.delete({
        where: {
          id: invitation.id,
        },
      })

      return member
    })

    // Log the activity
    await logTeamActivity(invitation.teamId, session.user.id, "MEMBER_JOINED", {
      role: invitation.role,
      invitedBy: invitation.invitedById,
    })

    return NextResponse.json({
      success: true,
      member: newMember,
      team: invitation.team,
    })
  } catch (error) {
    console.error(`Error accepting invitation ${params.token}:`, error)
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 })
  }
}

