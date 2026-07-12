"use client";

import { useCart } from "./CartContext";
import styles from "./cart-button.module.css";

export function CartButton({ className }: { className?: string }) {
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <button type="button" onClick={openCart} className={`${className ?? ""} ${styles.button}`}>
      Cart
      <span className={styles.count} data-empty={count === 0 || undefined}>
        {count}
      </span>
    </button>
  );
}
