import { describe, expect, test } from "vitest";
import { isNonEmptyString, isRateLimited, isValidEmail } from "./email";

describe("isValidEmail", () => {
  test("accepts ordinary addresses", () => {
    expect(isValidEmail("tom@example.com")).toBe(true);
    expect(isValidEmail("hello+tag@studio.com.au")).toBe(true);
  });

  test("rejects malformed input", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("two words@example.com")).toBe(false);
    expect(isValidEmail("no-domain@")).toBe(false);
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  test("rejects addresses beyond the RFC length cap", () => {
    expect(isValidEmail(`${"a".repeat(250)}@x.com`)).toBe(false);
  });
});

describe("isNonEmptyString", () => {
  test("accepts real content within the limit", () => {
    expect(isNonEmptyString("A round table, 130 cm", 100)).toBe(true);
  });

  test("rejects whitespace-only, overlong, and non-string values", () => {
    expect(isNonEmptyString("   ", 100)).toBe(false);
    expect(isNonEmptyString("a".repeat(101), 100)).toBe(false);
    expect(isNonEmptyString(undefined, 100)).toBe(false);
  });
});

describe("isRateLimited", () => {
  test("allows a burst then blocks within the window", () => {
    const key = `test-${Date.now()}`;
    for (let i = 0; i < 5; i += 1) {
      expect(isRateLimited(key)).toBe(false);
    }
    expect(isRateLimited(key)).toBe(true);
  });

  test("tracks keys independently", () => {
    const key = `other-${Date.now()}`;
    expect(isRateLimited(key)).toBe(false);
  });
});
