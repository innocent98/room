import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-2); // Extracts the [id] from URL
    const responseData = await request.json();

    // Check if form exists and is published
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
        status: "published",
      },
      include: {
        fields: true,
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or not published" },
        { status: 404 }
      );
    }

    // Create the response with answers in a transaction
    const newResponse = await prisma.$transaction(async (tx) => {
      // Create the response
      const response = await tx.response.create({
        data: {
          formId: formId || "",
        },
      });

      // Create answers for each field
      const answers = [];
      for (const field of form.fields) {
        const value = responseData[field.id];

        // Skip if no value provided and field is not required
        if (value === undefined && !field.required) {
          continue;
        }

        // Validate required fields
        if (
          field.required &&
          (value === undefined || value === null || value === "")
        ) {
          throw new Error(`Field ${field.label} is required`);
        }

        // Format the value based on field type
        let formattedValue = value;

        if (field.type === "checkbox" && Array.isArray(value)) {
          formattedValue = JSON.stringify(value);
        } else if (value === undefined || value === null) {
          formattedValue = "";
        } else if (typeof value !== "string") {
          formattedValue = String(value);
        }

        // Create the answer
        const answer = await tx.answer.create({
          data: {
            fieldId: field.id,
            responseId: response.id,
            value: formattedValue,
          },
        });

        answers.push(answer);
      }

      return {
        response,
        answers,
      };
    });

    return NextResponse.json(
      {
        success: true,
        responseId: newResponse.response.id,
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error(`Error submitting response for form ${params.formId}:`, error)

    // Handle validation errors
    if (error instanceof Error && error.message.includes("is required")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to submit form response" },
      { status: 500 }
    );
  }
}
