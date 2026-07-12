import type { CartLineInput } from "./commerce/types";

export const CART_COOKIE = "arv_cart";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * The mock provider keeps cart state client-side in a cookie as compact
 * line inputs. A ShopifyProvider swaps this for a cookie holding the
 * Shopify cart id, with state living in Shopify.
 */
export function parseCartCookie(raw: string | undefined): CartLineInput[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry): entry is { m: string; q: number } =>
          typeof entry === "object" &&
          entry !== null &&
          typeof (entry as { m?: unknown }).m === "string" &&
          typeof (entry as { q?: unknown }).q === "number",
      )
      .map((entry) => ({ merchandiseId: entry.m, quantity: Math.floor(entry.q) }))
      .filter((line) => line.quantity > 0);
  } catch {
    return [];
  }
}

export function serializeCartCookie(lines: CartLineInput[]): string {
  return JSON.stringify(lines.map((line) => ({ m: line.merchandiseId, q: line.quantity })));
}

export function addLine(lines: CartLineInput[], merchandiseId: string, quantity: number): CartLineInput[] {
  const existing = lines.find((line) => line.merchandiseId === merchandiseId);
  if (!existing) {
    return [...lines, { merchandiseId, quantity }];
  }

  return lines.map((line) =>
    line.merchandiseId === merchandiseId ? { ...line, quantity: line.quantity + quantity } : line,
  );
}

export function setLineQuantity(
  lines: CartLineInput[],
  merchandiseId: string,
  quantity: number,
): CartLineInput[] {
  if (quantity < 1) {
    return lines.filter((line) => line.merchandiseId !== merchandiseId);
  }

  return lines.map((line) =>
    line.merchandiseId === merchandiseId ? { ...line, quantity } : line,
  );
}
