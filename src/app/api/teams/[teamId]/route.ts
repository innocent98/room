import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logTeamActivity } from "@/lib/activity-logger"

const prisma = new PrismaClient()

// Get a specific team
export async function GET(request: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const teamId = params.teamId

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Get the team with member count
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        _count: {
          select: {
            members: true,
            forms: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Get user's role in the team
    const userRole = membership.role

    return NextResponse.json({
      ...team,
      userRole,
    })
  } catch (error) {
    console.error(`Error fetching team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 })
  }
}

// Update a team
export async function PATCH(request: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const teamId = params.teamId

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

    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    // Get the current team data for activity logging
    const currentTeam = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    })

    if (!currentTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Update the team
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    })

    // Log the activity
    await logTeamActivity(teamId, session.user.id, "TEAM_UPDATED", {
      oldName: currentTeam.name,
      newName: data.name,
      oldDescription: currentTeam.description,
      newDescription: data.description,
    })

    return NextResponse.json(updatedTeam)
  } catch (error) {
    console.error(`Error updating team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 })
  }
}

// Delete a team
export async function DELETE(request: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const teamId = params.teamId

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

    // Get team info for logging
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Delete the team (cascade will delete members, invitations, and activities)
    await prisma.team.delete({
      where: {
        id: teamId,
      },
    })

    // No need to log the activity here since the team and all its activities are deleted

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 })
  }
}

