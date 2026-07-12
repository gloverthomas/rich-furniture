import rawCatalog from "@/data/products.json";
import type { CommerceProvider, ProductQuery } from "../provider";
import type {
  Cart,
  CartLine,
  CartLineInput,
  Category,
  CommerceImage,
  Money,
  Product,
  ProductOption,
  ProductVariant,
  SelectedOption,
} from "../types";

interface RawProduct {
  handle: string;
  title: string;
  category: string;
  featured: boolean;
  basePrice: number;
  description: string;
  story: string;
  details: string[];
  dimensions: string;
  options: ProductOption[];
}

const CURRENCY = rawCatalog.currencyCode;
const PRICE_MODIFIERS: Record<string, number> = rawCatalog.priceModifiers;

const money = (amount: number): Money => ({
  amount: amount.toFixed(2),
  currencyCode: CURRENCY,
});

function productImages(raw: RawProduct): CommerceImage[] {
  return [
    {
      url: `/products/${raw.handle}-1.jpg`,
      altText: `${raw.title} in a Sydney interior`,
      width: 1600,
      height: 2000,
    },
    {
      url: `/products/${raw.handle}-2.jpg`,
      altText: `${raw.title} — material and joinery detail`,
      width: 1600,
      height: 1200,
    },
  ];
}

function cartesian(optionValues: string[][]): string[][] {
  return optionValues.reduce<string[][]>(
    (combos, values) => combos.flatMap((combo) => values.map((value) => [...combo, value])),
    [[]],
  );
}

function variantPrice(raw: RawProduct, values: string[]): number {
  return values.reduce((total, value) => total + (PRICE_MODIFIERS[value] ?? 0), raw.basePrice);
}

function expandVariants(raw: RawProduct): ProductVariant[] {
  return cartesian(raw.options.map((option) => option.values)).map((values) => {
    const selectedOptions: SelectedOption[] = values.map((value, index) => ({
      name: raw.options[index].name,
      value,
    }));

    return {
      id: `gid://arv/ProductVariant/${raw.handle}::${values.join("::")}`,
      title: values.join(" / "),
      availableForSale: true,
      selectedOptions,
      price: money(variantPrice(raw, values)),
    };
  });
}

function toProduct(raw: RawProduct): Product {
  const variants = expandVariants(raw);
  const prices = variants.map((variant) => Number(variant.price.amount));
  const images = productImages(raw);

  return {
    id: `gid://arv/Product/${raw.handle}`,
    handle: raw.handle,
    title: raw.title,
    category: raw.category as Category,
    description: raw.description,
    story: raw.story,
    details: raw.details,
    dimensions: raw.dimensions,
    featured: raw.featured,
    featuredImage: images[0],
    images,
    options: raw.options,
    variants,
    priceRange: {
      minVariantPrice: money(Math.min(...prices)),
      maxVariantPrice: money(Math.max(...prices)),
    },
  };
}

const catalog: Product[] = (rawCatalog.products as RawProduct[]).map(toProduct);

const variantIndex = new Map<string, { product: Product; variant: ProductVariant }>(
  catalog.flatMap((product) => product.variants.map((variant) => [variant.id, { product, variant }])),
);

function toCartLine(input: CartLineInput): CartLine | null {
  const entry = variantIndex.get(input.merchandiseId);
  if (!entry || input.quantity < 1) return null;

  const { product, variant } = entry;
  const lineTotal = Number(variant.price.amount) * input.quantity;

  return {
    id: `line-${variant.id}`,
    quantity: input.quantity,
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      price: variant.price,
      product: {
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
    cost: { totalAmount: money(lineTotal) },
  };
}

export class MockProvider implements CommerceProvider {
  async getProducts(query?: ProductQuery): Promise<Product[]> {
    return catalog.filter(
      (product) =>
        (query?.category === undefined || product.category === query.category) &&
        (query?.featured === undefined || product.featured === query.featured),
    );
  }

  async getProduct(handle: string): Promise<Product | null> {
    return catalog.find((product) => product.handle === handle) ?? null;
  }

  async resolveCart(lines: CartLineInput[]): Promise<Cart> {
    const cartLines = lines
      .map(toCartLine)
      .filter((line): line is CartLine => line !== null);

    const subtotal = cartLines.reduce((total, line) => total + Number(line.cost.totalAmount.amount), 0);

    return {
      id: "mock-cart",
      lines: cartLines,
      totalQuantity: cartLines.reduce((total, line) => total + line.quantity, 0),
      cost: {
        subtotalAmount: money(subtotal),
        totalAmount: money(subtotal),
      },
      checkoutUrl: "/checkout",
    };
  }
}
