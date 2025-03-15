import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type TeamActivityAction =
  | "TEAM_CREATED"
  | "TEAM_UPDATED"
  | "TEAM_DELETED"
  | "MEMBER_INVITED"
  | "MEMBER_JOINED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_UPDATED"
  | "FORM_CREATED"
  | "FORM_UPDATED"
  | "FORM_DELETED"
  | "FORM_PUBLISHED"
  | "FORM_ARCHIVED"
  | "FORM_SHARED"

export interface TeamActivityDetails {
  [key: string]: any
}

export async function logTeamActivity(
  teamId: string,
  userId: string,
  action: TeamActivityAction,
  details?: TeamActivityDetails,
) {
  try {
    const activity = await prisma.teamActivity.create({
      data: {
        teamId,
        userId,
        action,
        details: details || {},
      },
    })

    return activity
  } catch (error) {
    console.error("Failed to log team activity:", error)
    // Don't throw error to prevent disrupting the main operation
    return null
  }
}

export async function getTeamActivities(teamId: string, limit = 50, offset = 0) {
  try {
    const activities = await prisma.teamActivity.findMany({
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
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    return activities
  } catch (error) {
    console.error("Failed to get team activities:", error)
    throw error
  }
}

