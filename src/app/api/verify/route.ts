import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/auth/error?error=missing_token", request.url))
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    })

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/auth/error?error=invalid_token", request.url))
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: {
          token,
        },
      })
      return NextResponse.redirect(new URL("/auth/error?error=token_expired", request.url))
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    })

    // Redirect to verification success page
    return NextResponse.redirect(new URL("/auth/verify-success", request.url))
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=server_error", request.url))
  }
}

