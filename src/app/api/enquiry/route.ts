import { NextRequest, NextResponse } from "next/server";
import {
  ENQUIRY_FROM,
  ENQUIRY_TO,
  getResend,
  isNonEmptyString,
  isRateLimited,
  isValidEmail,
} from "@/lib/email";

interface EnquiryBody {
  name?: unknown;
  email?: unknown;
  location?: unknown;
  piece?: unknown;
  message?: unknown;
  /** Honeypot — real users never fill this. */
  website?: unknown;
}

function ok(): NextResponse {
  return NextResponse.json({ success: true, data: { sent: true }, error: null });
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, data: null, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`enquiry:${ip}`)) {
    return NextResponse.json(
      { success: false, data: null, error: "Too many requests — please try again in a minute." },
      { status: 429 },
    );
  }

  let body: EnquiryBody;
  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return badRequest("Invalid request body.");
  }

  // Honeypot tripped: pretend success, send nothing
  if (typeof body.website === "string" && body.website.length > 0) {
    return ok();
  }

  if (!isNonEmptyString(body.name, 120)) return badRequest("Please tell us your name.");
  if (!isValidEmail(body.email)) return badRequest("Please enter a valid email address.");
  if (!isNonEmptyString(body.message, 5000)) {
    return badRequest("Please tell us a little about what you're imagining.");
  }

  const location = isNonEmptyString(body.location, 160) ? body.location.trim() : "Not given";
  const piece = isNonEmptyString(body.piece, 120) ? body.piece.trim() : "Not specified";

  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, data: null, error: "Enquiries are temporarily unavailable. Please email us directly." },
        { status: 503 },
      );
    }
    // Local development without a key: simulate success so the flow is testable
    return ok();
  }

  const { error } = await resend.emails.send({
    from: ENQUIRY_FROM,
    to: ENQUIRY_TO,
    replyTo: body.email,
    subject: `Bespoke enquiry — ${body.name.trim()}`,
    text: [
      `Name: ${body.name.trim()}`,
      `Email: ${body.email}`,
      `Location: ${location}`,
      `Piece of interest: ${piece}`,
      "",
      body.message.trim(),
    ].join("\n"),
  });

  if (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong sending your enquiry. Please try again." },
      { status: 502 },
    );
  }

  return ok();
}
