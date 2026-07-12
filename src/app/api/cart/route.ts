import { NextRequest, NextResponse } from "next/server";
import { commerce } from "@/lib/commerce";
import {
  CART_COOKIE,
  CART_COOKIE_MAX_AGE,
  addLine,
  parseCartCookie,
  serializeCartCookie,
  setLineQuantity,
} from "@/lib/cart-cookie";
import type { CartLineInput } from "@/lib/commerce";

async function cartResponse(lines: CartLineInput[]): Promise<NextResponse> {
  const cart = await commerce.resolveCart(lines);
  // Re-serialize from the resolved cart so unknown merchandise ids are pruned
  const validLines = cart.lines.map((line) => ({
    merchandiseId: line.merchandise.id,
    quantity: line.quantity,
  }));

  const response = NextResponse.json({ success: true, data: cart, error: null });
  response.cookies.set(CART_COOKIE, serializeCartCookie(validLines), {
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, data: null, error: message }, { status: 400 });
}

interface MutationBody {
  merchandiseId?: unknown;
  quantity?: unknown;
}

async function readMutation(request: NextRequest): Promise<{ merchandiseId: string; quantity: number } | null> {
  try {
    const body = (await request.json()) as MutationBody;
    if (typeof body.merchandiseId !== "string" || typeof body.quantity !== "number") {
      return null;
    }
    if (!Number.isInteger(body.quantity) || body.quantity < 0 || body.quantity > 99) {
      return null;
    }
    return { merchandiseId: body.merchandiseId, quantity: body.quantity };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const lines = parseCartCookie(request.cookies.get(CART_COOKIE)?.value);
  return cartResponse(lines);
}

export async function POST(request: NextRequest) {
  const mutation = await readMutation(request);
  if (!mutation || mutation.quantity < 1) {
    return badRequest("Expected { merchandiseId: string, quantity: 1-99 }");
  }

  const lines = parseCartCookie(request.cookies.get(CART_COOKIE)?.value);
  return cartResponse(addLine(lines, mutation.merchandiseId, mutation.quantity));
}

export async function PATCH(request: NextRequest) {
  const mutation = await readMutation(request);
  if (!mutation) {
    return badRequest("Expected { merchandiseId: string, quantity: 0-99 }");
  }

  const lines = parseCartCookie(request.cookies.get(CART_COOKIE)?.value);
  return cartResponse(setLineQuantity(lines, mutation.merchandiseId, mutation.quantity));
}
