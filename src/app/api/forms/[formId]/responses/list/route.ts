import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    // ✅ Extract form ID from the request URL
    const url = new URL(request.url);
    const formId = url.pathname.split("/").at(-3); // Extracts the [id] from URL

    // Check if form exists and belongs to the user
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { userId: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const answerType = searchParams.get("answerType") || "";

    const skip = (page - 1) * limit;

    // Build the where clause for responses
    const where: any = { formId };

    // Add date range filter if provided
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Fetch responses with pagination and filtering
    const [responses, totalCount] = await Promise.all([
      prisma.response.findMany({
        where,
        include: {
          answers: {
            include: {
              field: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.response.count({
        where,
      }),
    ]);

    // Get form fields to determine required fields
    const formWithFields = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          where: {
            required: true,
          },
        },
      },
    });

    if (!formWithFields) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const requiredFieldIds = formWithFields.fields.map((field) => field.id);

    // Transform and filter responses
    let filteredResponses = responses.map((response) => {
      const formattedAnswers: Record<string, any> = {};

      response.answers.forEach((answer) => {
        // Format the value based on field type
        let value = answer.value;

        if (answer.field.type === "checkbox" && value.startsWith("[")) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // If parsing fails, keep the original value
          }
        }

        formattedAnswers[answer.field.id] = {
          fieldId: answer.field.id,
          label: answer.field.label,
          type: answer.field.type,
          value,
        };
      });

      // Check if response is complete (all required fields answered)
      const answeredFieldIds = response.answers.map((answer) => answer.fieldId);
      const isComplete = requiredFieldIds.every((fieldId) =>
        answeredFieldIds.includes(fieldId)
      );

      return {
        id: response.id,
        createdAt: response.createdAt.toISOString(),
        answers: formattedAnswers,
        isComplete,
      };
    });

    // Apply search filter if provided
    if (search) {
      filteredResponses = filteredResponses.filter((response) => {
        // Search in answer values
        return Object.values(response.answers).some((answer) => {
          const value = (answer as any).value;
          if (typeof value === "string") {
            return value.toLowerCase().includes(search.toLowerCase());
          } else if (Array.isArray(value)) {
            return value.some(
              (v) =>
                typeof v === "string" &&
                v.toLowerCase().includes(search.toLowerCase())
            );
          }
          return false;
        });
      });
    }

    // Apply answer type filter if provided
    if (answerType) {
      switch (answerType) {
        case "complete":
          filteredResponses = filteredResponses.filter(
            (response) => response.isComplete
          );
          break;
        case "incomplete":
          filteredResponses = filteredResponses.filter(
            (response) => !response.isComplete
          );
          break;
        // Add more filter types as needed
      }
    }

    // Adjust total count based on filtered results
    const filteredCount =
      search || answerType ? filteredResponses.length : totalCount;

    return NextResponse.json({
      responses: filteredResponses,
      pagination: {
        total: filteredCount,
        page,
        limit,
        pages: Math.ceil(filteredCount / limit),
      },
    });
  } catch (error) {
    // console.error(`Error fetching responses for form:`, error)
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}
