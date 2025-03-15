import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { formId: string } }) {
  try {
    const formId = params.formId

    // Fetch the form with its fields
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
        status: "published", // Only return published forms
      },
      include: {
        fields: {
          orderBy: {
            order: "asc",
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedForm = {
      id: form.id,
      title: form.title,
      description: form.description,
      createdBy: form.user.name || "Anonymous",
      fields: form.fields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options ? JSON.parse(field.options as string) : [],
      })),
    }

    return NextResponse.json(transformedForm)
  } catch (error) {
    console.error(`Error fetching form ${params.formId}:`, error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
  }
}

