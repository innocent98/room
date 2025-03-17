import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/user/integrations/[integrationId] - Get a specific integration
export async function GET(request: NextRequest, { params }: { params: { integrationId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integrationId = params.integrationId

    // Get the integration
    const integration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId: session.user.id,
      },
    })

    if (!integration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 })
    }

    return NextResponse.json(integration)
  } catch (error) {
    console.error(`Error fetching integration ${params.integrationId}:`, error)
    return NextResponse.json({ error: "Failed to fetch integration" }, { status: 500 })
  }
}

// PUT /api/user/integrations/[integrationId] - Update an integration
export async function PUT(request: NextRequest, { params }: { params: { integrationId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integrationId = params.integrationId
    const data = await request.json()

    // For non-connected integrations, create a new one
    if (!integrationId.match(/^[0-9a-f]{24}$/i)) {
      // This is a default integration ID (like "google-drive"), not a database ID
      // Create a new integration
      const newIntegration = await prisma.integration.create({
        data: {
          userId: session.user.id,
          type: integrationId,
          name: data.name || integrationId,
          config: data.config || {},
          enabled: data.enabled !== undefined ? data.enabled : true,
        },
      })

      return NextResponse.json(newIntegration)
    }

    // Check if the integration exists and belongs to the user
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId: session.user.id,
      },
    })

    if (!existingIntegration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 })
    }

    // Update the integration
    const updatedIntegration = await prisma.integration.update({
      where: { id: integrationId },
      data: {
        name: data.name,
        config: data.config,
        enabled: data.enabled,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedIntegration)
  } catch (error) {
    console.error(`Error updating integration ${params.integrationId}:`, error)
    return NextResponse.json({ error: "Failed to update integration" }, { status: 500 })
  }
}

// DELETE /api/user/integrations/[integrationId] - Delete an integration
export async function DELETE(request: NextRequest, { params }: { params: { integrationId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integrationId = params.integrationId

    // Check if the integration exists and belongs to the user
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        id: integrationId,
        userId: session.user.id,
      },
    })

    if (!existingIntegration) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 })
    }

    // Delete the integration
    await prisma.integration.delete({
      where: { id: integrationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting integration ${params.integrationId}:`, error)
    return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 })
  }
}

