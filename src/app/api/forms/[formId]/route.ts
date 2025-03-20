import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

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
        settings: true,
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
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    // console.error(`Error fetching form ${params.formId}:`, error)
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
      include: {
        fields: true,
        settings: true,
      },
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
        // Get existing fields to preserve IDs
        const existingFields = await tx.field.findMany({
          where: { formId },
        });

        // Create a map of existing fields by their original client-side ID
        const existingFieldsMap = new Map();
        existingFields.forEach((field) => {
          // Try to find a matching field in the updates by label and type
          // This is a best-effort approach to match fields
          const matchingField = updates.fields.find((f: any) =>
            f.id && f.id.startsWith("field-") ? false : f.id === field.id
          );
          if (matchingField) {
            existingFieldsMap.set(matchingField.id, field);
          }
        });

        // Process each field in the updates
        for (const [index, field] of updates.fields.entries()) {
          const existingField = existingFieldsMap.get(field.id);

          if (existingField) {
            // Update existing field
            await tx.field.update({
              where: { id: existingField.id },
              data: {
                label: field.label,
                type: field.type,
                required: field.required || false,
                order: index,
                options: field.options ? JSON.stringify(field.options) : null,
                description: field.description || null,
                conditionalLogic: field.conditionalLogic
                  ? JSON.stringify(field.conditionalLogic)
                  : null,
              },
            });
          } else {
            // Create new field
            await tx.field.create({
              data: {
                formId: formId || "",
                label: field.label,
                type: field.type,
                required: field.required || false,
                order: index,
                options: field.options ? JSON.stringify(field.options) : null,
                description: field.description || null,
                conditionalLogic: field.conditionalLogic
                  ? JSON.stringify(field.conditionalLogic)
                  : null,
              },
            });
          }
        }

        // Find fields that are no longer in the updates and should be removed
        const updatedFieldIds = updates.fields
          .map((f: any) => f.id)
          .filter((id: string) => !id.startsWith("field-")); // Filter out temporary IDs

        const fieldsToDelete = existingFields.filter(
          (field) => !updatedFieldIds.includes(field.id)
        );

        // Check if any fields to be deleted have responses
        for (const field of fieldsToDelete) {
          const hasResponses = await tx.response.findFirst({
            where: {
              formId,
              answers: {
                some: {
                  fieldId: field.id,
                },
              },
            },
          });

          if (!hasResponses) {
            // Only delete fields that don't have responses
            await tx.field.delete({
              where: { id: field.id },
            });
          } else {
            // For fields with responses, mark them as hidden instead of deleting
            await tx.field.update({
              where: { id: field.id },
              data: {
                hidden: true,
                order: 9999, // Move to end
              },
            });
          }
        }
      }

      // Update settings if provided
      if (updates.settings) {
        const settingsData = {
          showProgressBar: updates.settings.showProgressBar,
          allowMultipleSubmissions: updates.settings.allowMultipleSubmissions,
          confirmationMessage: updates.settings.confirmationMessage,
          redirectUrl: updates.settings.redirectUrl,
          emailNotifications: updates.settings.emailNotifications,
          notificationEmails: updates.settings.notificationEmails
            ? JSON.stringify(updates.settings.notificationEmails)
            : null,
          customTheme: updates.settings.customTheme
            ? JSON.stringify(updates.settings.customTheme)
            : null,
          bannerImage: updates.settings.bannerImage,
        };

        if (existingForm.settings) {
          // Update existing settings
          await tx.formSettings.update({
            where: { formId },
            data: settingsData,
          });
        } else {
          // Create new settings
          await tx.formSettings.create({
            data: {
              formId: formId || "",
              ...settingsData,
            },
          });
        }
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
          settings: true,
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
        description: field.description || "",
        conditionalLogic: field.conditionalLogic
          ? JSON.parse(field.conditionalLogic as string)
          : null,
      })),
      createdAt: updatedForm.createdAt.toISOString(),
      updatedAt: updatedForm.updatedAt.toISOString(),
      published: updatedForm.status === "published",
      isDraft: updatedForm.status === "draft",
      settings: {
        showProgressBar: updatedForm.settings?.showProgressBar || false,
        allowMultipleSubmissions:
          updatedForm.settings?.allowMultipleSubmissions || false,
        confirmationMessage: updatedForm.settings?.confirmationMessage || "",
        redirectUrl: updatedForm.settings?.redirectUrl || "",
        emailNotifications: updatedForm.settings?.emailNotifications || false,
        notificationEmails: updatedForm.settings?.notificationEmails
          ? JSON.parse(updatedForm.settings.notificationEmails as string)
          : [],
        customTheme: updatedForm.settings?.customTheme
          ? JSON.parse(updatedForm.settings.customTheme as string)
          : null,
        bannerImage: updatedForm.settings?.bannerImage || null,
      },
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    // console.error(`Error updating form ${params.formId}:`, error)
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

    // Delete form (cascade will delete fields and settings)
    await prisma.form.delete({
      where: { id: formId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error(`Error deleting form ${params.formId}:`, error)
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}
