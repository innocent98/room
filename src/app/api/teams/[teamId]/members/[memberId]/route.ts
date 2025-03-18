import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logTeamActivity } from "@/lib/activity-logger";

const prisma = new PrismaClient();

// Get a specific team member
export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract teamId ID from the request URL
    const url = new URL(request.url);
    const teamId = url.pathname.split("/").at(-3); // Extracts the [id] from URL
    const memberId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member of the team
    const userMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!userMembership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the requested team member
    const member = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
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
    });

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    // console.error(`Error fetching team member ${params.memberId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

// Update a team member's role
export async function PATCH(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract teamId ID from the request URL
    const url = new URL(request.url);
    const teamId = url.pathname.split("/").at(-3); // Extracts the [id] from URL
    const memberId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin of the team
    const userMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!userMembership) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Validate role
    if (!["ADMIN", "EDITOR", "VIEWER"].includes(data.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get the member to update
    const memberToUpdate = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        teamId,
      },
      include: {
        user: true,
      },
    });

    if (!memberToUpdate) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Update the member's role
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: memberId,
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
    });

    // Log the activity
    await logTeamActivity(
      teamId || "",
      session.user.id,
      "MEMBER_ROLE_UPDATED",
      {
        memberId: memberToUpdate.userId,
        memberEmail: memberToUpdate.user.email,
        oldRole: memberToUpdate.role,
        newRole: data.role,
      }
    );

    return NextResponse.json(updatedMember);
  } catch (error) {
    // console.error(`Error updating team member ${params.memberId}:`, error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// Remove a member from a team
export async function DELETE(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract teamId ID from the request URL
    const url = new URL(request.url);
    const teamId = url.pathname.split("/").at(-3); // Extracts the [id] from URL
    const memberId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an admin of the team or removing themselves
    const memberToRemove = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        teamId,
      },
      include: {
        user: true,
      },
    });

    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const userMembership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    // User can remove themselves or admins can remove others
    const isSelfRemoval = memberToRemove.userId === session.user.id;
    const isAdmin = userMembership?.role === "ADMIN";

    if (!isSelfRemoval && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the team member
    await prisma.teamMember.delete({
      where: {
        id: memberId,
      },
    });

    // Log the activity
    await logTeamActivity(teamId || "", session.user.id, "MEMBER_REMOVED", {
      removedMemberId: memberToRemove.userId,
      removedMemberEmail: memberToRemove.user.email,
      removedMemberRole: memberToRemove.role,
      isSelfRemoval,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error(`Error removing team member ${params.memberId}:`, error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
