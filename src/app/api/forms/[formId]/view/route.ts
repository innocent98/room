import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-2); // Extracts the [id] from URL

    // Fetch the form with its fields and settings
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          where: {
            hidden: false, // Only include visible fields
          },
          orderBy: {
            order: "asc",
          },
        },
        settings: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if the form is published
    if (form.status !== "published") {
      return NextResponse.json(
        { error: "This form is not published" },
        { status: 403 }
      );
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
        placeholder: field.placeholder || "",
        description: field.description || "",
        options: field.options ? JSON.parse(field.options as string) : [],
        conditionalLogic: field.conditionalLogic
          ? JSON.parse(field.conditionalLogic as string)
          : [],
      })),
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      published: form.status === "published",
      // isDraft: form.status === "draft",
      createdBy: form.user?.name || "Anonymous",
      settings: {
        showProgressBar: form.settings?.showProgressBar || false,
        allowMultipleSubmissions:
          form.settings?.allowMultipleSubmissions !== false,
        successMessage:
          form.settings?.confirmationMessage ||
          "Thank you for your submission!",
        bannerImage: form.settings?.bannerImage || null,
        // footerText: form.settings?.footerText || null,
        theme: form.settings?.customTheme || "default",
      },
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}
