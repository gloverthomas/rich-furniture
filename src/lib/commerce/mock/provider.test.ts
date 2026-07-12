import { describe, expect, test } from "vitest";
import { MockProvider } from "./provider";

const provider = new MockProvider();

describe("MockProvider catalog", () => {
  test("returns the full catalog of 7 pieces", async () => {
    const products = await provider.getProducts();

    expect(products).toHaveLength(7);
  });

  test("filters by category", async () => {
    const dining = await provider.getProducts({ category: "dining" });

    expect(dining.length).toBeGreaterThan(0);
    expect(dining.every((product) => product.category === "dining")).toBe(true);
  });

  test("filters by featured flag", async () => {
    const featured = await provider.getProducts({ featured: true });

    expect(featured).toHaveLength(5);
    expect(featured.every((product) => product.featured)).toBe(true);
  });

  test("finds a product by handle with expanded variants", async () => {
    const product = await provider.getProduct("iggy-dining-table");

    expect(product).not.toBeNull();
    // 2 finishes x 2 lengths
    expect(product!.variants).toHaveLength(4);
    expect(product!.options.map((option) => option.name)).toEqual(["Finish", "Length"]);
  });

  test("applies price modifiers per selected option", async () => {
    const product = await provider.getProduct("iggy-dining-table");
    const base = product!.variants.find((v) => v.title === "Natural Oil / 200 cm");
    const smokedLong = product!.variants.find((v) => v.title === "Smoked Oak / 240 cm");

    expect(Number(base!.price.amount)).toBe(29800);
    expect(Number(smokedLong!.price.amount)).toBe(29800 + 2400 + 4800);
  });

  test("price range spans min and max variant prices", async () => {
    const product = await provider.getProduct("rollo-dining-table");
    const prices = product!.variants.map((variant) => Number(variant.price.amount));

    expect(Number(product!.priceRange.minVariantPrice.amount)).toBe(Math.min(...prices));
    expect(Number(product!.priceRange.maxVariantPrice.amount)).toBe(Math.max(...prices));
  });

  test("returns null for an unknown handle", async () => {
    expect(await provider.getProduct("does-not-exist")).toBeNull();
  });
});

describe("MockProvider cart", () => {
  test("resolves an empty cart", async () => {
    const cart = await provider.resolveCart([]);

    expect(cart.lines).toHaveLength(0);
    expect(cart.totalQuantity).toBe(0);
    expect(Number(cart.cost.totalAmount.amount)).toBe(0);
  });

  test("computes line and cart totals", async () => {
    const product = await provider.getProduct("sam-side-table");
    const variant = product!.variants[0];

    const cart = await provider.resolveCart([{ merchandiseId: variant.id, quantity: 2 }]);

    expect(cart.totalQuantity).toBe(2);
    expect(Number(cart.lines[0].cost.totalAmount.amount)).toBe(Number(variant.price.amount) * 2);
    expect(cart.cost.subtotalAmount.amount).toBe(cart.lines[0].cost.totalAmount.amount);
  });

  test("sums multiple lines", async () => {
    const [table, set] = await Promise.all([
      provider.getProduct("steve-coffee-table"),
      provider.getProduct("rollo-coffee-set"),
    ]);

    const cart = await provider.resolveCart([
      { merchandiseId: table!.variants[0].id, quantity: 1 },
      { merchandiseId: set!.variants[0].id, quantity: 3 },
    ]);

    const expected =
      Number(table!.variants[0].price.amount) + Number(set!.variants[0].price.amount) * 3;

    expect(cart.totalQuantity).toBe(4);
    expect(Number(cart.cost.totalAmount.amount)).toBe(expected);
  });

  test("drops unknown merchandise and non-positive quantities", async () => {
    const product = await provider.getProduct("duo-coffee-table");

    const cart = await provider.resolveCart([
      { merchandiseId: "gid://arv/ProductVariant/nope", quantity: 1 },
      { merchandiseId: product!.variants[0].id, quantity: 0 },
    ]);

    expect(cart.lines).toHaveLength(0);
  });

  test("cart line carries product context for rendering", async () => {
    const product = await provider.getProduct("otto-pedestal-table");
    const cart = await provider.resolveCart([{ merchandiseId: product!.variants[0].id, quantity: 1 }]);

    const line = cart.lines[0];
    expect(line.merchandise.product.handle).toBe("otto-pedestal-table");
    expect(line.merchandise.product.featuredImage.url).toContain("/products/otto-pedestal-table");
    expect(line.merchandise.selectedOptions[0].name).toBe("Finish");
  });
});
