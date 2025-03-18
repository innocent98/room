import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    // Check if form exists
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if user owns the form or if the form is published
    if (form.userId !== session?.user?.id && form.status !== "published") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Transform the data to match the expected format
    const transformedForm = {
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
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    console.error(`Error fetching form:`, error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    const updates = await request.json();

    // Check if form exists and belongs to the user
    const existingForm = await prisma.form.findUnique({
      where: { id: formId },
      include: { fields: true },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Start a transaction to update the form and its fields
    const updatedForm = await prisma.$transaction(async (tx) => {
      // Update form status if provided
      if (updates.published !== undefined || updates.isDraft !== undefined) {
        let status = existingForm.status;

        if (updates.published === true) {
          status = "published";
        } else if (updates.isDraft === true) {
          status = "draft";
        }

        await tx.form.update({
          where: { id: formId },
          data: { status },
        });
      }

      // Update form title and description if provided
      if (updates.title || updates.description !== undefined) {
        await tx.form.update({
          where: { id: formId },
          data: {
            title: updates.title || existingForm.title,
            description:
              updates.description !== undefined
                ? updates.description
                : existingForm.description,
          },
        });
      }

      // Update fields if provided
      if (updates.fields) {
        // Delete existing fields
        await tx.field.deleteMany({
          where: { formId },
        });

        // Create new fields
        await tx.field.createMany({
          data: updates.fields.map((field: any, index: number) => ({
            formId,
            label: field.label,
            type: field.type,
            required: field.required || false,
            order: index,
            options: field.options ? JSON.stringify(field.options) : null,
          })),
        });
      }

      // Return the updated form
      return tx.form.findUnique({
        where: { id: formId },
        include: {
          fields: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });

    if (!updatedForm) {
      throw new Error("Failed to update form");
    }

    // Transform the data to match the expected format
    const transformedForm = {
      id: updatedForm.id,
      title: updatedForm.title,
      description: updatedForm.description,
      fields: updatedForm.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options ? JSON.parse(field.options as string) : [],
      })),
      createdAt: updatedForm.createdAt.toISOString(),
      updatedAt: updatedForm.updatedAt.toISOString(),
      published: updatedForm.status === "published",
      isDraft: updatedForm.status === "draft",
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    // console.error(`Error updating form`, error);
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-1); // Extracts the [id] from URL

    // Check if form exists and belongs to the user
    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete form (cascade will delete fields)
    await prisma.form.delete({
      where: { id: formId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error(`Error deleting form:`, error);
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}
