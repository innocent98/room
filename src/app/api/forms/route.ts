import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.json();

    // Validate required fields
    if (!formData.title) {
      return NextResponse.json(
        { error: "Form title is required" },
        { status: 400 }
      );
    }

    // Create the form with fields
    const newForm = await prisma.form.create({
      data: {
        title: formData.title,
        description: formData.description,
        status: formData.published ? "published" : "draft",
        userId: session.user.id,
        fields: {
          create: formData.fields.map((field: any, index: number) => ({
            label: field.label,
            type: field.type,
            required: field.required || false,
            order: index,
            options: field.options ? JSON.stringify(field.options) : null,
          })),
        },
      },
      include: {
        fields: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Transform the data to match the expected format
    const transformedForm = {
      id: newForm.id,
      title: newForm.title,
      description: newForm.description,
      fields: newForm.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options ? JSON.parse(field.options as string) : [],
      })),
      createdAt: newForm.createdAt.toISOString(),
      updatedAt: newForm.updatedAt.toISOString(),
      published: newForm.status === "published",
      isDraft: newForm.status === "draft",
    };

    return NextResponse.json(transformedForm, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Build the query
    const where = {
      userId: session.user.id,
      ...(status && { status }),
    };

    // Fetch forms
    const forms = await prisma.form.findMany({
      where,
      include: {
        fields: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform the data to match the expected format
    const transformedForms = forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      fields: form.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options ? JSON.parse(field.options as string) : [],
      })),
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      published: form.status === "published",
      isDraft: form.status === "draft",
    }));

    return NextResponse.json(transformedForms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}
