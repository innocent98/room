import { type NextRequest, NextResponse } from "next/server";

// This would be replaced with a database in a real application
const drafts = new Map();

export async function POST(request: NextRequest) {
  try {
    const draftData = await request.json();

    // Validate required fields
    if (!draftData.title) {
      return NextResponse.json(
        { error: "Draft title is required" },
        { status: 400 }
      );
    }

    // Generate a unique ID if not provided
    const draftId =
      draftData.id ||
      `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Store the draft
    const newDraft = {
      id: draftId,
      title: draftData.title,
      description: draftData.description,
      fields: draftData.fields || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    drafts.set(draftId, newDraft);

    return NextResponse.json(newDraft, { status: 201 });
  } catch (error) {
    console.error("Error creating draft:", error);
    return NextResponse.json(
      { error: "Failed to create draft" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Convert Map to Array for response
    const allDrafts = Array.from(drafts.values());

    return NextResponse.json(allDrafts);
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}
