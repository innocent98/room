import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// Get current user's subscription
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
      include: {
        plan: true,
      },
    })

    if (!subscription) {
      return NextResponse.json({ plan: "free" })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}

// Create or update subscription
export async function POST(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: data.planId },
    })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
    })

    if (existingSubscription) {
      // Update existing subscription
      const updatedSubscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId: data.planId,
          // Add payment processing logic here
          updatedAt: new Date(),
        },
        include: {
          plan: true,
        },
      })

      return NextResponse.json(updatedSubscription)
    }

    // Create new subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId: data.planId,
        status: "active",
        // Add payment processing logic here
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json(newSubscription, { status: 201 })
  } catch (error) {
    console.error("Error creating/updating subscription:", error)
    return NextResponse.json({ error: "Failed to process subscription" }, { status: 500 })
  }
}

