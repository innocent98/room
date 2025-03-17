import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { uploadImageToFirebase } from "@/lib/upload"

// GET /api/user/profile - Get the current user's profile
export async function GET(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Split name into first and last name if available
    let firstName = ""
    let lastName = ""

    if (user.name) {
      const nameParts = user.name.split(" ")
      firstName = nameParts[0] || ""
      lastName = nameParts.slice(1).join(" ") || ""
    }

    return NextResponse.json({
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      bio: user.bio || "",
      avatar: user.image || "/placeholder.svg?height=128&width=128",
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

// PUT /api/user/profile - Update the current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session:any = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()

    // Extract text fields
    const firstName = (formData.get("firstName") as string) || ""
    const lastName = (formData.get("lastName") as string) || ""
    const email = (formData.get("email") as string) || ""
    const bio = (formData.get("bio") as string) || ""

    // Combine first and last name
    const name = `${firstName} ${lastName}`.trim()

    // Handle avatar upload
    const avatarFile = formData.get("avatar") as File | null
    let imageUrl = (formData.get("currentAvatarUrl") as string) || null

    // If a new avatar file was uploaded, process it
    if (avatarFile && avatarFile.size > 0) {
      try {
        imageUrl = await uploadImageToFirebase(avatarFile)
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError)
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        bio,
        image: imageUrl,
      },
    })

    return NextResponse.json({
      id: updatedUser.id,
      firstName,
      lastName,
      email: updatedUser.email,
      bio: updatedUser.bio || "",
      avatar: updatedUser.image || "/placeholder.svg?height=128&width=128",
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}

