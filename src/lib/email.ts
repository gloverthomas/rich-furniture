import { Resend } from "resend";

/**
 * Resend integration. All senders degrade gracefully when RESEND_API_KEY is
 * absent: in development the routes simulate success so the forms are fully
 * testable locally; in production they return a clear 503 instead.
 *
 * Env vars (see .env.example):
 *   RESEND_API_KEY      — required in production
 *   ENQUIRY_TO_EMAIL    — studio inbox that receives enquiries
 *   ENQUIRY_FROM_EMAIL  — verified sender (defaults to Resend's test sender)
 *   RESEND_AUDIENCE_ID  — audience that collects newsletter signups
 */

let client: Resend | null | undefined;

export function getResend(): Resend | null {
  if (client !== undefined) return client;
  const apiKey = process.env.RESEND_API_KEY;
  client = apiKey ? new Resend(apiKey) : null;
  return client;
}

export const ENQUIRY_TO = process.env.ENQUIRY_TO_EMAIL ?? "hello@tomglover.com.au";
export const ENQUIRY_FROM = process.env.ENQUIRY_FROM_EMAIL ?? "ARV Studio <onboarding@resend.dev>";
export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

/**
 * Minimal per-instance rate limit — enough to blunt naive form spam without
 * external infrastructure. Serverless instances each keep their own window,
 * which is an accepted limitation at this scale.
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  hits.set(key, [...recent, now]);
  return false;
}
