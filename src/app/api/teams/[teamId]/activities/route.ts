import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTeamActivities } from "@/lib/activity-logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract teamId ID from the request URL
    const url = new URL(request.url);
    const teamId = url.pathname.split("/").at(-2); // Extracts the [id] from URL

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10);

    // Get team activities
    const activities = await getTeamActivities(teamId || "", limit, offset);

    // Get total count for pagination
    const totalCount = await prisma.teamActivity.count({
      where: {
        teamId,
      },
    });

    return NextResponse.json({
      activities,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    // console.error(
    //   `Error fetching team activities for team ${params.teamId}:`,
    //   error
    // );
    return NextResponse.json(
      { error: "Failed to fetch team activities" },
      { status: 500 }
    );
  }
}
