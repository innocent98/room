import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-2); // Extracts the [id] from URL
    // const responseData = await request.json();
    const formData = await request.json();

    // Check if the form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        settings: true,
        fields: true
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status !== "published") {
      return NextResponse.json(
        { error: "This form is not published" },
        { status: 403 }
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

    // Create the form response
    // const response = await prisma.response.create({
    //   data: {
    //     formId: formId || "",
    //     data: JSON.stringify(formData),
    //     answers: formData,
    //   },
    // });

    return NextResponse.json(
      { message: "Response submitted successfully", responseId: newResponse.response.id },
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

export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const formId = params.formId;
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
