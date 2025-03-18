import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/user/api-key/[keyId] - Get a specific API key
export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract keyId ID from the request URL
    const url = new URL(request.url);
    const keyId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    // Get the API key
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
        expiresAt: true,
        permissions: true,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(apiKey);
  } catch (error) {
    // console.error(`Error fetching API key ${params.keyId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/api-key/[keyId] - Update an API key
export async function PATCH(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract keyId ID from the request URL
    const url = new URL(request.url);
    const keyId = url.pathname.split("/").at(-1); // Extracts the [id] from URL
    const data = await request.json();

    // Check if the API key exists and belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: session.user.id,
      },
    });

    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Update the API key
    const updatedKey = await prisma.apiKey.update({
      where: { id: keyId },
      data: {
        name: data.name,
        permissions: data.permissions,
        expiresAt: data.expiresAt,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        lastUsed: true,
        expiresAt: true,
        permissions: true,
      },
    });

    return NextResponse.json(updatedKey);
  } catch (error) {
    // console.error(`Error updating API key ${params.keyId}:`, error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/api-key/[keyId] - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract keyId ID from the request URL
    const url = new URL(request.url);
    const keyId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    // Check if the API key exists and belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: session.user.id,
      },
    });

    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Delete the API key
    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error(`Error deleting API key ${params.keyId}:`, error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
