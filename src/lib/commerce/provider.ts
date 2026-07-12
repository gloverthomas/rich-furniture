import type { Cart, CartLineInput, Category, Product } from "./types";

export interface ProductQuery {
  category?: Category;
  featured?: boolean;
}

/**
 * Storage-agnostic commerce interface.
 *
 * The mock provider resolves everything from a local catalog; a future
 * ShopifyProvider implements the same methods with Storefront API GraphQL
 * (products/productByHandle queries, cart built from cartCreate/cartLinesAdd
 * mutations, checkoutUrl from the Cart object).
 */
export interface CommerceProvider {
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  /** Materialize a full Cart (line costs, totals) from lightweight line inputs. */
  resolveCart(lines: CartLineInput[]): Promise<Cart>;
}
