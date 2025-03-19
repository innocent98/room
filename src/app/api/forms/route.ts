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

    // Create the form with fields and settings in a transaction
    const newForm = await prisma.$transaction(async (tx) => {
      // Create the form first
      const form = await tx.form.create({
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
              description: field.description || null,
              conditionalLogic: field.conditionalLogic
                ? JSON.stringify(field.conditionalLogic)
                : null,
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

      // Create default settings for the form
      if (formData.settings) {
        await tx.formSettings.create({
          data: {
            formId: form.id,
            showProgressBar: formData.settings.showProgressBar || false,
            allowMultipleSubmissions:
              formData.settings.allowMultipleSubmissions || false,
            confirmationMessage: formData.settings.confirmationMessage || "",
            redirectUrl: formData.settings.redirectUrl || "",
            emailNotifications: formData.settings.emailNotifications || false,
            notificationEmails: formData.settings.notificationEmails
              ? JSON.stringify(formData.settings.notificationEmails)
              : null,
            customTheme: formData.settings.customTheme
              ? JSON.stringify(formData.settings.customTheme)
              : null,
            bannerImage: formData.settings.bannerImage || null,
          },
        });
      } else {
        // Create default settings if none provided
        await tx.formSettings.create({
          data: {
            formId: form.id,
            showProgressBar: false,
            allowMultipleSubmissions: false,
          },
        });
      }

      // Return the form with settings
      return tx.form.findUnique({
        where: { id: form.id },
        include: {
          fields: {
            orderBy: {
              order: "asc",
            },
          },
          settings: true,
        },
      });
    });

    if (!newForm) {
      throw new Error("Failed to create form");
    }

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
        description: field.description || "",
        conditionalLogic: field.conditionalLogic
          ? JSON.parse(field.conditionalLogic as string)
          : null,
      })),
      createdAt: newForm.createdAt.toISOString(),
      updatedAt: newForm.updatedAt.toISOString(),
      published: newForm.status === "published",
      isDraft: newForm.status === "draft",
      settings: {
        showProgressBar: newForm.settings?.showProgressBar || false,
        allowMultipleSubmissions:
          newForm.settings?.allowMultipleSubmissions || false,
        confirmationMessage: newForm.settings?.confirmationMessage || "",
        redirectUrl: newForm.settings?.redirectUrl || "",
        emailNotifications: newForm.settings?.emailNotifications || false,
        notificationEmails: newForm.settings?.notificationEmails
          ? JSON.parse(newForm.settings.notificationEmails as string)
          : [],
        customTheme: newForm.settings?.customTheme
          ? JSON.parse(newForm.settings.customTheme as string)
          : null,
        bannerImage: newForm.settings?.bannerImage || null,
      },
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

    // Fetch forms with settings
    const forms = await prisma.form.findMany({
      where,
      include: {
        fields: {
          orderBy: {
            order: "asc",
          },
        },
        settings: true,
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
        description: field.description || "",
        conditionalLogic: field.conditionalLogic
          ? JSON.parse(field.conditionalLogic as string)
          : null,
      })),
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      published: form.status === "published",
      isDraft: form.status === "draft",
      settings: {
        showProgressBar: form.settings?.showProgressBar || false,
        allowMultipleSubmissions:
          form.settings?.allowMultipleSubmissions || false,
        confirmationMessage: form.settings?.confirmationMessage || "",
        redirectUrl: form.settings?.redirectUrl || "",
        emailNotifications: form.settings?.emailNotifications || false,
        notificationEmails: form.settings?.notificationEmails
          ? JSON.parse(form.settings.notificationEmails as string)
          : [],
        customTheme: form.settings?.customTheme
          ? JSON.parse(form.settings.customTheme as string)
          : null,
        bannerImage: form.settings?.bannerImage || null,
      },
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
