import { describe, expect, test } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  test("formats AUD in Australian style without decimals", () => {
    const formatted = formatMoney({ amount: "5890.00", currencyCode: "AUD" });

    // en-AU: "$5,890"
    expect(formatted).toBe("$5,890");
  });

  test("rounds fractional amounts to whole units", () => {
    const formatted = formatMoney({ amount: "999.99", currencyCode: "AUD" });

    expect(formatted).toBe("$1,000");
  });

  test("supports other currencies via currencyCode", () => {
    const formatted = formatMoney({ amount: "1200.00", currencyCode: "EUR" });

    expect(formatted).toContain("1,200");
  });
});
