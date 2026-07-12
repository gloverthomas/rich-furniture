import { describe, expect, test } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  test("formats DKK in Danish style without decimals", () => {
    const formatted = formatMoney({ amount: "24500.00", currencyCode: "DKK" });

    // da-DK: "24.500 kr." (thousands separator is a dot, NBSP before kr.)
    expect(formatted.replace(/ /g, " ")).toBe("24.500 kr.");
  });

  test("rounds fractional amounts to whole units", () => {
    const formatted = formatMoney({ amount: "999.99", currencyCode: "DKK" });

    expect(formatted.replace(/ /g, " ")).toBe("1.000 kr.");
  });

  test("supports other currencies via currencyCode", () => {
    const formatted = formatMoney({ amount: "1200.00", currencyCode: "EUR" });

    expect(formatted).toContain("1.200");
  });
});
