/**
 * Shared motion vocabulary for GSAP work — mirrors the CSS custom
 * properties in styles/tokens.css so JS and CSS motion feel related.
 */

export const DURATION = {
  fast: 0.18,
  normal: 0.4,
  slow: 0.8,
  reveal: 1.1,
} as const;

export const EASE = {
  outExpo: "expo.out",
  outQuart: "power4.out",
  inOutQuart: "power2.inOut",
} as const;

export const STAGGER = {
  lines: 0.09,
  cards: 0.08,
} as const;

/** Y-offset (in %) used for masked line reveals. */
export const LINE_OFFSET = 110;
