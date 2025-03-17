import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total forms created by the user
    const totalForms = await prisma.form.count({
      where: {
        userId: session.user.id,
      },
    })

    // Get active forms (not archived or deleted)
    const activeForms = await prisma.form.count({
      where: {
        userId: session.user.id,
        status: "published",
      },
    })

    // Get total responses across all forms
    const totalResponses = await prisma.response.count({
      where: {
        form: {
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({
      totalForms,
      activeForms,
      totalResponses,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

