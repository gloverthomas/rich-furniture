"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASE, LINE_OFFSET, STAGGER } from "@/lib/animation";

/**
 * Single owner of all scroll-driven and entrance motion. Reads data
 * attributes from the rendered route and choreographs GSAP around them:
 *
 *   [data-hero-line]      masked line rise on load
 *   [data-hero-media]     hero parallax drift
 *   [data-reveal]         staggered rise-in on scroll entry
 *   [data-reveal-lines]   SplitText masked line reveal
 *   [data-parallax]       slow image drift while scrolling past
 *   [data-craft-chapter]  crossfades the matching [data-craft-visual]
 *   [data-shrink-wrap]    pins and shrinks as [data-site-footer] rises beneath it
 *
 * Everything is skipped under prefers-reduced-motion; the DOM renders
 * fully visible without JS, so there is nothing to unhide.
 */
export function AnimationOrchestrator() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let revert: (() => void) | undefined;
    let cancelled = false;
    let shrinkWrapEl: HTMLElement | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger, SplitText);
      await document.fonts.ready;
      if (cancelled) return;

      const ctx = gsap.context(() => {
        // --- Hero entrance ---
        const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
        if (heroLines.length > 0) {
          gsap.from(heroLines, {
            yPercent: LINE_OFFSET,
            duration: DURATION.reveal,
            ease: EASE.outExpo,
            stagger: STAGGER.lines,
            delay: 0.15,
          });
          gsap.from("[data-hero-eyebrow], [data-hero-foot]", {
            opacity: 0,
            y: 18,
            duration: DURATION.slow,
            ease: EASE.outQuart,
            delay: 0.65,
            stagger: 0.12,
          });
        }

        // --- Hero parallax ---
        const heroMedia = document.querySelector("[data-hero-media]");
        if (heroMedia) {
          gsap.to(heroMedia, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // --- Generic rise-in reveals ---
        const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
        reveals.forEach((el) => {
          gsap.from(el, {
            y: 48,
            opacity: 0,
            duration: DURATION.reveal,
            ease: EASE.outExpo,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          });
        });

        // --- Masked line reveals for editorial statements ---
        const lineBlocks = gsap.utils.toArray<HTMLElement>("[data-reveal-lines]");
        lineBlocks.forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.from(split.lines, {
            yPercent: LINE_OFFSET,
            duration: DURATION.reveal,
            ease: EASE.outExpo,
            stagger: STAGGER.lines,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
            },
          });
        });

        // --- Slow image drift ---
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // --- Craft story: chapter-driven visual crossfade ---
        const chapters = gsap.utils.toArray<HTMLElement>("[data-craft-chapter]");
        const visuals = gsap.utils.toArray<HTMLElement>("[data-craft-visual]");
        if (chapters.length > 0 && visuals.length === chapters.length) {
          const activate = (index: number) => {
            visuals.forEach((visual, i) => {
              gsap.to(visual, {
                opacity: i === index ? 1 : 0,
                scale: i === index ? 1 : 1.04,
                duration: DURATION.slow,
                ease: EASE.outQuart,
                overwrite: "auto",
              });
            });
          };

          chapters.forEach((chapter, index) => {
            ScrollTrigger.create({
              trigger: chapter,
              start: "top 60%",
              end: "bottom 40%",
              onEnter: () => activate(index),
              onEnterBack: () => activate(index),
            });
          });
        }

        // --- Footer reveal: footer is a plain sibling right after the shrink wrap,
        // so it naturally appears in flow as the wrap scrolls past. GSAP just adds
        // the decorative scale + rounded-corner treatment over the last viewport
        // height of that scroll, timed to the wrap's own (non-sticky) bottom edge ---
        const shrinkWrap = document.querySelector<HTMLElement>("[data-shrink-wrap]");
        const footer = document.querySelector<HTMLElement>("[data-site-footer]");
        if (shrinkWrap && footer) {
          shrinkWrapEl = shrinkWrap;
          gsap.to(shrinkWrap, {
            scale: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: shrinkWrap,
              // start well before the wrap's bottom actually reaches the viewport —
              // scaling shrinks the wrap's own height, so its visible remnant
              // otherwise disappears before the animation would read as "complete"
              start: "bottom bottom+=600",
              end: "bottom top",
              scrub: true,
              onUpdate: (self) => {
                shrinkWrap.style.clipPath = `inset(0px round ${self.progress * 40}px)`;
              },
              onLeaveBack: () => {
                shrinkWrap.style.clipPath = "";
              },
            },
          });
        }

        // --- Header: solid after the fold, hides down, returns up ---
        const header = document.querySelector<HTMLElement>("[data-site-header]");
        if (header) {
          const showAfter = 64;
          ScrollTrigger.create({
            start: showAfter,
            end: "max",
            onUpdate: (self) => {
              const solid = self.scroll() > showAfter;
              const goingDown = self.direction === 1;
              const pastHero = self.scroll() > window.innerHeight * 0.9;
              header.dataset.state = goingDown && pastHero ? "hidden" : solid ? "solid" : "";
            },
            onLeaveBack: () => {
              header.dataset.state = "";
            },
          });
        }
      });

      revert = () => {
        ctx.revert();
        if (shrinkWrapEl) shrinkWrapEl.style.clipPath = "";
      };
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pathname]);

  return null;
}
