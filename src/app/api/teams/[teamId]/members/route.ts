import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Get all members of a team
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

    const members = await prisma.teamMember.findMany({
      where: { teamId },
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

    return NextResponse.json(members)
  } catch (error) {
    console.error(`Error fetching team members for team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}

// Add a member to a team (invite)
export async function POST(request: NextRequest, { params }: { params: { teamId: string } }) {
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
        role: { in: ["ADMIN", "EDITOR"] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      // Create an invitation
      const invitation = await prisma.teamInvitation.create({
        data: {
          email: data.email,
          teamId,
          role: data.role || "VIEWER",
          invitedById: session.user.id,
        },
      })

      // TODO: Send invitation email

      return NextResponse.json(invitation, { status: 201 })
    }

    // Check if user is already a member
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
    })

    if (existingMembership) {
      return NextResponse.json({ error: "User is already a member of this team" }, { status: 400 })
    }

    // Add user to team
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role: data.role || "VIEWER",
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

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error(`Error adding member to team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 })
  }
}

