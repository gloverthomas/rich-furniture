"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import { getLenis } from "@/lib/lenis-store";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASE } from "@/lib/animation";
import styles from "./cart-drawer.module.css";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateLine, error } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Pause page scroll while the drawer is open
  useEffect(() => {
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // Staggered line-item entrance, GSAP-choreographed
  useEffect(() => {
    if (!isOpen || prefersReducedMotion()) return;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll("[data-cart-item], [data-cart-foot]");
      if (items.length === 0) return;
      gsap.from(items, {
        x: 42,
        opacity: 0,
        duration: DURATION.slow,
        ease: EASE.outExpo,
        stagger: 0.06,
        delay: 0.18,
        clearProps: "all",
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, cart?.lines.length]);

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <div className={styles.root} data-open={isOpen || undefined} aria-hidden={!isOpen}>
      <button
        type="button"
        className={styles.scrim}
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close cart"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={styles.panel}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            Cart{" "}
            <span className={styles.count}>
              {cart?.totalQuantity ?? 0} {cart?.totalQuantity === 1 ? "piece" : "pieces"}
            </span>
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            className={`${styles.close} text-link`}
            tabIndex={isOpen ? 0 : -1}
          >
            Close
          </button>
        </header>

        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        {isEmpty ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Nothing here yet. <em>Heirlooms take a moment to choose.</em>
            </p>
            <Link
              href="/collection"
              className="text-link"
              onClick={closeCart}
              tabIndex={isOpen ? 0 : -1}
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <ul role="list" className={styles.lines}>
              {cart.lines.map((line) => (
                <li key={line.id} className={styles.line} data-cart-item>
                  <Link
                    href={`/product/${line.merchandise.product.handle}`}
                    onClick={closeCart}
                    className={styles.lineImage}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <Image
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.featuredImage.altText}
                      width={220}
                      height={275}
                      sizes="110px"
                    />
                  </Link>
                  <div className={styles.lineBody}>
                    <p className={styles.lineTitle}>{line.merchandise.product.title}</p>
                    <p className={styles.lineVariant}>{line.merchandise.title}</p>
                    <div className={styles.lineControls}>
                      <div className={styles.quantity}>
                        <button
                          type="button"
                          onClick={() => updateLine(line.merchandise.id, line.quantity - 1)}
                          aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          −
                        </button>
                        <span aria-live="polite">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateLine(line.merchandise.id, line.quantity + 1)}
                          aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          +
                        </button>
                      </div>
                      <p className="type-price">{formatMoney(line.cost.totalAmount)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className={styles.foot} data-cart-foot>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className="type-price">{formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
              <p className={styles.note}>
                Shipping and taxes calculated at checkout. Every piece built to order — 6–10
                weeks.
              </p>
              <Button href={cart.checkoutUrl}>Continue to checkout</Button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
