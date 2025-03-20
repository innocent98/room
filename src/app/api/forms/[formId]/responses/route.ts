import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canReceiveResponses } from "@/lib/subscription";

export async function POST(request: NextRequest) {
  try {
    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-2); // Extracts the [id] from URL
    const formData = await request.json();

    // Check if the form can receive more responses based on subscription
    const canReceive = await canReceiveResponses(formId || "");
    if (!canReceive) {
      return NextResponse.json(
        {
          error:
            "This form has reached its response limit. The form owner needs to upgrade their plan to receive more responses.",
          code: "RESPONSE_LIMIT_REACHED",
        },
        { status: 403 }
      );
    }

    // Check if the form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: formId, status: "published", disabled: false },
      include: {
        settings: true,
        fields: {
          where: {
            hidden: false, // Only include visible fields
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found, not published, or disabled" },
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
        const value = formData[field.id];

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

    // Update usage statistics
    await prisma.usageStats.upsert({
      where: { userId: form.userId },
      update: {
        totalResponses: { increment: 1 },
      },
      create: {
        userId: form.userId,
        totalResponses: 1,
      },
    });

    return NextResponse.json(
      {
        message: "Response submitted successfully",
        responseId: newResponse.response.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting form response:", error);
    return NextResponse.json(
      { error: "Failed to submit form response" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-2); // Extracts the [id] from URL

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Check if the form exists
    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get the total count of responses
    const totalCount = await prisma.response.count({
      where: { formId },
    });

    // Fetch the responses with pagination
    const responses = await prisma.response.findMany({
      where: { formId },
      include: {
        answers: {
          include: {
            field: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Transform the responses
    const transformedResponses = responses.map((response) => ({
      id: response.id,
      formId: response.formId,
      answers: response.answers,
      createdAt: response.createdAt.toISOString(),
    }));

    return NextResponse.json({
      responses: transformedResponses,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch form responses" },
      { status: 500 }
    );
  }
}
