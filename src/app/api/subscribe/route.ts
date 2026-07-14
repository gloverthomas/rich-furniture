import { NextRequest, NextResponse } from "next/server";
import { AUDIENCE_ID, getResend, isRateLimited, isValidEmail } from "@/lib/email";

interface SubscribeBody {
  email?: unknown;
  /** Honeypot — real users never fill this. */
  website?: unknown;
}

function ok(): NextResponse {
  return NextResponse.json({ success: true, data: { subscribed: true }, error: null });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(`subscribe:${ip}`)) {
    return NextResponse.json(
      { success: false, data: null, error: "Too many requests — please try again in a minute." },
      { status: 429 },
    );
  }

  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (typeof body.website === "string" && body.website.length > 0) {
    return ok();
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { success: false, data: null, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const resend = getResend();
  if (!resend || !AUDIENCE_ID) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, data: null, error: "Signups are temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
    // Local development without a key/audience: simulate success
    return ok();
  }

  const { error } = await resend.contacts.create({
    email: body.email,
    audienceId: AUDIENCE_ID,
    unsubscribed: false,
  });

  // A duplicate signup is a success from the visitor's point of view
  if (error && !/already exists/i.test(error.message ?? "")) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  return ok();
}
