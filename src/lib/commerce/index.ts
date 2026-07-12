import type { CommerceProvider } from "./provider";
import { MockProvider } from "./mock/provider";

export type * from "./types";
export { CATEGORIES } from "./types";
export type { CommerceProvider, ProductQuery } from "./provider";

/**
 * Provider selection. Set COMMERCE_PROVIDER=shopify (plus store domain +
 * Storefront API token env vars) once a ShopifyProvider exists; everything
 * upstream of this module is provider-agnostic.
 */
function createProvider(): CommerceProvider {
  const providerName = process.env.COMMERCE_PROVIDER ?? "mock";

  if (providerName !== "mock") {
    throw new Error(`Unknown COMMERCE_PROVIDER "${providerName}" — only "mock" is implemented`);
  }

  return new MockProvider();
}

export const commerce: CommerceProvider = createProvider();
