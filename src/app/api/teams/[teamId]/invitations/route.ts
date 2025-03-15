import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Get all pending invitations for a team
export async function GET(request: NextRequest, { params }: { params: { teamId: string } }) {
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

    const invitations = await prisma.teamInvitation.findMany({
      where: {
        teamId,
        status: "PENDING",
      },
      include: {
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error(`Error fetching invitations for team ${params.teamId}:`, error)
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 })
  }
}

