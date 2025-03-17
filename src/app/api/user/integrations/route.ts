import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET /api/user/integrations - Get all integrations for the current user
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all integrations for the user
    const integrations = await prisma.integration.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        type: true,
        name: true,
        enabled: true,
        createdAt: true,
        updatedAt: true,
        lastUsed: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Get API key for the user (most recent one)
    const apiKey = await prisma.apiKey.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        key: true,
      },
    })

    // Map integrations to a more user-friendly format with additional UI metadata
    const mappedIntegrations = integrations.map((integration) => {
      // Define UI metadata based on integration type
      const icon = "/placeholder.svg?height=32&width=32"
      let bgColor = "bg-blue-100"
      let description = "Connect to external service"

      switch (integration.type) {
        case "google-drive":
          description = "Connect to store form responses"
          bgColor = "bg-blue-100"
          break
        case "slack":
          description = "Get notifications in your channels"
          bgColor = "bg-green-100"
          break
        case "zapier":
          description = "Connect with 3,000+ apps"
          bgColor = "bg-blue-100"
          break
        case "mailchimp":
          description = "Add form respondents to your lists"
          bgColor = "bg-purple-100"
          break
      }

      return {
        ...integration,
        icon,
        bgColor,
        description,
        connected: true, // If it exists in the database, it's connected
      }
    })

    // Add default integrations that aren't connected yet
    const defaultIntegrations = [
      {
        id: "google-drive",
        type: "google-drive",
        name: "Google Drive",
        description: "Connect to store form responses",
        enabled: false,
        connected: false,
        icon: "/placeholder.svg?height=32&width=32",
        bgColor: "bg-blue-100",
      },
      {
        id: "slack",
        type: "slack",
        name: "Slack",
        description: "Get notifications in your channels",
        enabled: false,
        connected: false,
        icon: "/placeholder.svg?height=32&width=32",
        bgColor: "bg-green-100",
      },
      {
        id: "zapier",
        type: "zapier",
        name: "Zapier",
        description: "Connect with 3,000+ apps",
        enabled: false,
        connected: false,
        icon: "/placeholder.svg?height=32&width=32",
        bgColor: "bg-blue-100",
      },
      {
        id: "mailchimp",
        type: "mailchimp",
        name: "Mailchimp",
        description: "Add form respondents to your lists",
        enabled: false,
        connected: false,
        icon: "/placeholder.svg?height=32&width=32",
        bgColor: "bg-purple-100",
      },
    ]

    // Filter out default integrations that are already connected
    const connectedTypes = mappedIntegrations.map((i) => i.type)
    const unconnectedIntegrations = defaultIntegrations.filter((i) => !connectedTypes.includes(i.type))

    // Combine connected and default integrations
    const allIntegrations = [...mappedIntegrations, ...unconnectedIntegrations]

    return NextResponse.json({
      integrations: allIntegrations,
      apiKey: apiKey?.key || null,
    })
  } catch (error) {
    console.error("Error fetching integrations:", error)
    return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 })
  }
}

// POST /api/user/integrations - Create a new integration
export async function POST(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.type || !data.name) {
      return NextResponse.json({ error: "Type and name are required" }, { status: 400 })
    }

    // Check if integration already exists
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        type: data.type,
      },
    })

    if (existingIntegration) {
      return NextResponse.json({ error: "Integration already exists" }, { status: 400 })
    }

    // Create the integration
    const integration = await prisma.integration.create({
      data: {
        userId: session.user.id,
        type: data.type,
        name: data.name,
        config: data.config || {},
        enabled: data.enabled !== undefined ? data.enabled : true,
      },
    })

    return NextResponse.json(integration)
  } catch (error) {
    console.error("Error creating integration:", error)
    return NextResponse.json({ error: "Failed to create integration" }, { status: 500 })
  }
}

