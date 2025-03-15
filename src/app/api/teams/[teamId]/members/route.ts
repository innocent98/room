import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateTeamInviteEmail } from "@/lib/email";
import { logTeamActivity } from "@/lib/activity-logger";

const prisma = new PrismaClient();

// Get team members
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const session: any = await getServerSession(authOptions);
    const teamId = params.teamId;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get team members
    const members = await prisma.teamMember.findMany({
      where: {
        teamId,
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
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error(
      `Error fetching team members for team ${params.teamId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// Add a member to a team (invite)
export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const session: any = await getServerSession(authOptions);
    const teamId = params.teamId;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: ["ADMIN", "EDITOR"] },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get team information for the email
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      // Create an invitation
      const invitation = await prisma.teamInvitation.create({
        data: {
          email: data.email,
          teamId,
          role: data.role || "VIEWER",
          invitedById: session.user.id,
          token: crypto.randomUUID(), // Add this line to generate a token
        },
      });

      // Generate invitation link
      const inviteLink = `${process.env.NEXT_PUBLIC_URL}/dashboard/invitations/${invitation.token}`;

      // Send invitation email
      await generateTeamInviteEmail({
        teamName: team.name,
        inviterName: session.user.name || "A team member",
        inviteLink,
        email: data.email,
      });

      // Log the activity
      await logTeamActivity(teamId, session.user.id, "MEMBER_INVITED", {
        inviteeEmail: data.email,
        role: data.role || "VIEWER",
      });

      return NextResponse.json(invitation, { status: 201 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already a member of this team" },
        { status: 400 }
      );
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
    });

    // Log the activity
    await logTeamActivity(teamId, session.user.id, "MEMBER_JOINED", {
      newMemberId: user.id,
      newMemberEmail: user.email,
      role: data.role || "VIEWER",
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error(`Error adding member to team ${params.teamId}:`, error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
