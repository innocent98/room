import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // Anyone can view plans, but we'll include user-specific data if logged in
    const plans = await prisma.plan.findMany({
      orderBy: [{ priority: "asc" }, { price: "asc" }],
    });

    // If user is logged in, get their current subscription
    let currentPlan = null;
    if (session?.user) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          status: "active",
          OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
        },
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (subscription) {
        currentPlan = subscription.plan.id;
      }
    }

    return NextResponse.json({
      plans,
      currentPlan,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
