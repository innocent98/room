import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { formId: string; responseId: string } }) {
  try {
    const session:any = await getServerSession(authOptions)
    const { formId, responseId } = params

    // Check if form exists and belongs to the user
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { userId: true },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (form.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the response with its answers
    const response = await prisma.response.findUnique({
      where: {
        id: responseId,
        formId,
      },
      include: {
        answers: {
          include: {
            field: true,
          },
        },
      },
    })

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 })
    }

    // Transform the data to a more usable format
    const formattedAnswers: Record<string, any> = {}

    response.answers.forEach((answer) => {
      // Format the value based on field type
      let value = answer.value

      if (answer.field.type === "checkbox" && value.startsWith("[")) {
        try {
          value = JSON.parse(value)
        } catch (e) {
          // If parsing fails, keep the original value
        }
      }

      formattedAnswers[answer.field.id] = {
        fieldId: answer.field.id,
        label: answer.field.label,
        type: answer.field.type,
        value,
      }
    })

    const transformedResponse = {
      id: response.id,
      formId: response.formId,
      createdAt: response.createdAt.toISOString(),
      answers: formattedAnswers,
    }

    return NextResponse.json(transformedResponse)
  } catch (error) {
    console.error(`Error fetching response ${params.responseId}:`, error)
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 })
  }
}

