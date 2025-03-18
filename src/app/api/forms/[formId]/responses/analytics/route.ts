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

    // Fetch form with fields
    const formWithFields = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fields: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!formWithFields) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Fetch all responses for this form
    const responses = await prisma.response.findMany({
      where: { formId },
      include: {
        answers: {
          include: {
            field: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Calculate total responses
    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return NextResponse.json({
        totalResponses: 0,
        completionRate: 0,
        averageCompletionTime: 0,
        responsesByDay: [],
        responsesByHour: [],
        questionStats: {
          totalAnswered: 0,
          questions: [],
        },
      });
    }

    // Calculate completion rate (responses with all required fields answered)
    const requiredFieldIds = formWithFields.fields
      .filter((field) => field.required)
      .map((field) => field.id);

    const completeResponses = responses.filter((response) => {
      const answeredFieldIds = response.answers.map((answer) => answer.fieldId);
      return requiredFieldIds.every((fieldId) =>
        answeredFieldIds.includes(fieldId)
      );
    });

    const completionRate = Math.round(
      (completeResponses.length / totalResponses) * 100
    );

    // Calculate average completion time (mock data for now)
    // In a real implementation, you would track start and end times
    const averageCompletionTime = Math.round(Math.random() * 120 + 60); // 1-3 minutes

    // Calculate responses by day
    const responsesByDay = calculateResponsesByDay(responses);

    // Calculate responses by hour
    const responsesByHour = calculateResponsesByHour(responses);

    // Calculate question stats
    const questionStats = calculateQuestionStats(
      formWithFields.fields,
      responses
    );

    return NextResponse.json({
      totalResponses,
      completionRate,
      averageCompletionTime,
      responsesByDay,
      responsesByHour,
      questionStats,
    });
  } catch (error) {
    // console.error(`Error fetching analytics for form ${params.formId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// Helper function to calculate responses by day
function calculateResponsesByDay(responses: any[]) {
  const dayMap = new Map();

  // Get date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Initialize all days with 0 responses
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    dayMap.set(dateStr, 0);
  }

  // Count responses by day
  responses.forEach((response) => {
    const dateStr = response.createdAt.toISOString().split("T")[0];
    if (dayMap.has(dateStr)) {
      dayMap.set(dateStr, dayMap.get(dateStr) + 1);
    }
  });

  // Convert map to array
  return Array.from(dayMap, ([date, count]) => ({ date, count }));
}

// Helper function to calculate responses by hour
function calculateResponsesByHour(responses: any[]) {
  const hourMap = new Map();

  // Initialize all hours with 0 responses
  for (let i = 0; i < 24; i++) {
    hourMap.set(i, 0);
  }

  // Count responses by hour
  responses.forEach((response) => {
    const hour = response.createdAt.getHours();
    hourMap.set(hour, hourMap.get(hour) + 1);
  });

  // Convert map to array
  return Array.from(hourMap, ([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }));
}

// Helper function to calculate question stats
function calculateQuestionStats(fields: any[], responses: any[]) {
  const questions = fields.map((field) => {
    // Count how many times this field was answered
    const answers = responses.flatMap((response) =>
      response.answers.filter((answer: any) => answer.fieldId === field.id)
    );

    const answeredCount = answers.length;
    const completionRate = Math.round((answeredCount / responses.length) * 100);
    const skippedCount = responses.length - answeredCount;

    let answerDistribution: any = [];
    let mostCommonAnswer = null;

    // For multiple choice questions, calculate distribution
    if (
      field.type === "radio" ||
      field.type === "checkbox" ||
      field.type === "dropdown"
    ) {
      const options = field.options ? JSON.parse(field.options as string) : [];
      const optionCounts: any = new Map(
        options.map((option: any) => [option, 0])
      );

      answers.forEach((answer) => {
        try {
          // Handle checkbox (array) values
          if (answer.value.startsWith("[") && answer.value.endsWith("]")) {
            const values = JSON.parse(answer.value);
            values.forEach((value: any) => {
              if (optionCounts.has(value)) {
                optionCounts.set(value, optionCounts.get(value) + 1);
              }
            });
          } else {
            // Handle single values
            if (optionCounts.has(answer.value)) {
              optionCounts.set(
                answer.value,
                optionCounts.get(answer.value) + 1
              );
            }
          }
        } catch (e) {
          // Handle parsing errors
          console.error("Error parsing answer value:", e);
        }
      });

      answerDistribution = Array.from(optionCounts, ([option, count]) => ({
        option,
        count,
      }));

      // Find most common answer
      if (answerDistribution.length > 0) {
        const maxCount = Math.max(
          ...answerDistribution.map((item: any) => item.count)
        );
        const mostCommon = answerDistribution.find(
          (item: any) => item.count === maxCount
        );
        mostCommonAnswer = mostCommon ? mostCommon.option : null;
      }
    } else {
      // For text fields, find most common answer if possible
      const answerCounts = new Map();

      answers.forEach((answer) => {
        const value = answer.value;
        answerCounts.set(value, (answerCounts.get(value) || 0) + 1);
      });

      if (answerCounts.size > 0) {
        const maxCount = Math.max(...answerCounts.values());
        const entries = Array.from(answerCounts.entries());
        const mostCommon = entries.find(([_, count]) => count === maxCount);
        mostCommonAnswer = mostCommon ? mostCommon[0] : null;

        // Truncate long text answers
        if (mostCommonAnswer && mostCommonAnswer.length > 30) {
          mostCommonAnswer = mostCommonAnswer.substring(0, 30) + "...";
        }
      }
    }

    return {
      id: field.id,
      label: field.label,
      type: field.type,
      completionRate,
      answeredCount,
      skippedCount,
      answerDistribution,
      mostCommonAnswer,
    };
  });

  return {
    totalAnswered: responses.reduce(
      (sum, response) => sum + response.answers.length,
      0
    ),
    questions,
  };
}
