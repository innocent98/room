import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import crypto from "crypto"

// Helper function to generate a secure API key
function generateApiKey() {
  return `room_${crypto.randomBytes(32).toString("hex")}`
}

// GET /api/user/api-key - Get the current user's API keys
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all API keys for the user
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

// POST /api/user/api-key - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const name = data.name || "Default API Key"

    // Generate a new API key
    const key = generateApiKey()

    // Set expiration date (optional)
    const expiresAt = data.expiresInDays ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000) : null

    // Create the API key in the database
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        key,
        expiresAt,
        permissions: data.permissions || {},
      },
    })

    // Return the full key only once
    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key,
      createdAt: apiKey.createdAt,
      expiresAt: apiKey.expiresAt,
    })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}

