/**
 * Commerce domain types, shaped to mirror the Shopify Storefront API
 * (MoneyV2, Image, ProductVariant, Cart, etc.) so a ShopifyProvider can
 * return the same structures straight from GraphQL.
 *
 * Editorial fields (story, details, dimensions) map to Shopify metafields.
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface CommerceImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
}

export type Category = "dining" | "coffee" | "side";

export const CATEGORIES: readonly Category[] = ["dining", "coffee", "side"];

export interface Product {
  id: string;
  handle: string;
  title: string;
  category: Category;
  description: string;
  story: string;
  details: string[];
  dimensions: string;
  featured: boolean;
  featuredImage: CommerceImage;
  images: CommerceImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface CartLineMerchandise {
  id: string;
  title: string;
  selectedOptions: SelectedOption[];
  price: Money;
  product: {
    handle: string;
    title: string;
    featuredImage: CommerceImage;
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
  cost: {
    totalAmount: Money;
  };
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  checkoutUrl: string;
}
