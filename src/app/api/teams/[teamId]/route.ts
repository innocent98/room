import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

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

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
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
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error(`Error fetching team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 })
  }
}

// Update a team
export async function PUT(request: NextRequest, { params }: { params: { teamId: string } }) {
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

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: data.name,
        description: data.description,
        settings: data.settings,
      },
      include: {
        members: {
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
        },
      },
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

    // Check if user is the owner of the team
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    if (team.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Only the team owner can delete the team" }, { status: 403 })
    }

    // Delete the team
    await prisma.team.delete({
      where: { id: teamId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to delete team" }, { status: 500 })
  }
}

