import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Update a team member's role
export async function PUT(request: NextRequest, { params }: { params: { teamId: string; memberId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const { teamId, memberId } = params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin of the team
    const adminMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    })

    if (!adminMembership) {
      return NextResponse.json({ error: "Only admins can update member roles" }, { status: 403 })
    }

    const data = await request.json()

    // Validate role
    if (!data.role || !["ADMIN", "EDITOR", "VIEWER"].includes(data.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update member role
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: memberId,
        teamId,
      },
      data: {
        role: data.role,
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

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error(`Error updating team member ${params.memberId}:`, error)
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 })
  }
}

// Remove a member from a team
export async function DELETE(request: NextRequest, { params }: { params: { teamId: string; memberId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const { teamId, memberId } = params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin of the team
    const adminMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    })

    if (!adminMembership) {
      return NextResponse.json({ error: "Only admins can remove members" }, { status: 403 })
    }

    // Get the member to be removed
    const memberToRemove = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { team: true },
    })

    if (!memberToRemove) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Prevent removing the team owner
    if (memberToRemove.userId === memberToRemove.team.ownerId) {
      return NextResponse.json({ error: "Cannot remove the team owner" }, { status: 403 })
    }

    // Remove the member
    await prisma.teamMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error removing team member ${params.memberId}:`, error)
    return NextResponse.json({ error: "Failed to remove team member" }, { status: 500 })
  }
}

