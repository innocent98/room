import { type NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = {
      from: `ROOM <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM || "support@roomforms.com",
      subject: `Support Request: ${body.subject || "No Subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Support Request</h2>
          <p><strong>From:</strong> ${body.name} (${body.email})</p>
          <p><strong>Category:</strong> ${body.category || "Not specified"}</p>
          <p><strong>Subject:</strong> ${body.subject || "No Subject"}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p>${body.message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            This message was sent from the ROOM Help Center contact form.
          </p>
        </div>
      `,
    };

    // Send the email
    await sendEmail({mailOptions: emailContent});

    // Return success response
    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
