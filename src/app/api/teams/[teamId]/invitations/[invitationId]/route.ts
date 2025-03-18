import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateTeamInviteEmail } from "@/lib/email";
import { logTeamActivity } from "@/lib/activity-logger";

const prisma = new PrismaClient();

// Resend an invitation
export async function POST(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract teamId ID from the request URL
    const url = new URL(request.url);
    const teamId = url.pathname.split("/").at(-3); // Extracts the [id] from URL
    const invitationId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.teamId !== teamId) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Get team information for the email
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Generate invitation link
    const inviteLink = `${process.env.NEXT_PUBLIC_URL}/dashboard/invitations/${invitation.token}`;

    // Send invitation email
    await generateTeamInviteEmail({
      teamName: team.name,
      inviterName: session.user.name || "A team member",
      inviteLink,
      email: invitation.email,
    });

    // Log the activity
    await logTeamActivity(teamId, session.user.id, "MEMBER_INVITED", {
      inviteeEmail: invitation.email,
      role: invitation.role || "VIEWER",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error(`Error resending invitation ${params.invitationId}:`, error);
    return NextResponse.json(
      { error: "Failed to resend invitation" },
      { status: 500 }
    );
  }
}

// Cancel an invitation
export async function DELETE(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract teamId ID from the request URL
    const url = new URL(request.url);
    const teamId = url.pathname.split("/").at(-3); // Extracts the [id] from URL
    const invitationId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin of the team
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the invitation
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.teamId !== teamId) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Delete the invitation
    await prisma.teamInvitation.delete({
      where: { id: invitationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error(`Error cancelling invitation ${params.invitationId}:`, error);
    return NextResponse.json(
      { error: "Failed to cancel invitation" },
      { status: 500 }
    );
  }
}
