import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getUserUsageStats, getUserPlan } from "@/lib/subscription"

export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get usage statistics
    const usageStats = await getUserUsageStats(userId)

    // Get current plan
    const plan = await getUserPlan(userId)

    // Get subscription details
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate limits and usage percentages
    const formLimit = plan.maxForms === -1 ? "Unlimited" : plan.maxForms
    const responseLimit = plan.maxResponses === -1 ? "Unlimited" : plan.maxResponses
    const teamLimit = plan.maxTeams === -1 ? "Unlimited" : plan.maxTeams
    const apiKeyLimit = plan.maxApiKeys === -1 ? "Unlimited" : plan.maxApiKeys

    const formPercentage =
      plan.maxForms === -1 ? 0 : Math.min(100, Math.round((usageStats.formsCount / plan.maxForms) * 100))
    const responsePercentage =
      plan.maxResponses === -1 ? 0 : Math.min(100, Math.round((usageStats.responsesCount / plan.maxResponses) * 100))
    const teamPercentage =
      plan.maxTeams === -1 ? 0 : Math.min(100, Math.round((usageStats.teamsCount / plan.maxTeams) * 100))
    const apiKeyPercentage =
      plan.maxApiKeys === -1 ? 0 : Math.min(100, Math.round((usageStats.apiKeysCount / plan.maxApiKeys) * 100))

    // Get monthly form count
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { monthlyFormCount: true, lastFormCountReset: true },
    })

    return NextResponse.json({
      plan: {
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: plan.features,
      },
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
      usage: {
        forms: {
          used: usageStats.formsCount,
          limit: formLimit,
          percentage: formPercentage,
          monthlyCount: user?.monthlyFormCount || 0,
          monthlyLimit: plan.maxForms,
          monthlyPercentage:
            plan.maxForms === -1 ? 0 : Math.min(100, Math.round(((user?.monthlyFormCount || 0) / plan.maxForms) * 100)),
        },
        responses: {
          used: usageStats.responsesCount,
          limit: responseLimit,
          percentage: responsePercentage,
        },
        teams: {
          used: usageStats.teamsCount,
          limit: teamLimit,
          percentage: teamPercentage,
        },
        apiKeys: {
          used: usageStats.apiKeysCount,
          limit: apiKeyLimit,
          percentage: apiKeyPercentage,
          allowed: plan.allowApiAccess,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching usage stats:", error)
    return NextResponse.json({ error: "Failed to fetch usage statistics" }, { status: 500 })
  }
}

