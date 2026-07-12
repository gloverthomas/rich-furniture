import type Lenis from "lenis";

/**
 * Module-scoped handle to the active Lenis instance so distant client
 * components (cart drawer, dialogs) can pause and resume page scroll.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
