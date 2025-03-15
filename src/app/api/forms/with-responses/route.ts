import { type NextRequest, NextResponse } from "next/server";
import { prisma,  } from "@/lib/db";
import {Prisma} from "@prisma/client"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for search and filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where = {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
      ...(status && status !== "all" ? { status: status } : {}),
    };

    // Fetch forms with response counts
    const [forms, totalCount] = await Promise.all([
      prisma.form.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              responses: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.form.count({ where }),
    ]);

    // Transform the data to match the expected format
    const transformedForms = forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description || "",
      status:
        form.status === "published"
          ? "Active"
          : form.status === "draft"
          ? "Draft"
          : "Archived",
      creationDate: form.createdAt.toISOString().split("T")[0],
      lastUpdated: form.updatedAt.toISOString(),
      responseCount: form._count.responses,
    }));

    return NextResponse.json({
      forms: transformedForms,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    // console.error("Error fetching forms with responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}
