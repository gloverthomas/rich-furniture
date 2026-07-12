import type { Metadata } from "next";
import { cookies } from "next/headers";
import { commerce } from "@/lib/commerce";
import { CART_COOKIE, parseCartCookie } from "@/lib/cart-cookie";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import styles from "./checkout.module.css";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const lines = parseCartCookie(cookieStore.get(CART_COOKIE)?.value);
  const cart = await commerce.resolveCart(lines);

  return (
    <div className={`container ${styles.page}`}>
      <p className="type-eyebrow">Checkout</p>
      <h1 className={`type-display ${styles.heading}`}>
        This is where <em>Shopify takes over.</em>
      </h1>
      <p className={`type-body ${styles.body}`}>
        In production this page is never seen: the cart&apos;s <code>checkoutUrl</code> sends
        buyers straight to Shopify&apos;s hosted checkout, with payments, taxes and shipping
        handled there. The mock provider stops here instead.
      </p>

      {cart.lines.length > 0 && (
        <dl className={styles.summary}>
          {cart.lines.map((line) => (
            <div key={line.id} className={styles.row}>
              <dt>
                {line.quantity} × {line.merchandise.product.title}
                <span className={styles.variant}> — {line.merchandise.title}</span>
              </dt>
              <dd className="type-price">{formatMoney(line.cost.totalAmount)}</dd>
            </div>
          ))}
          <div className={`${styles.row} ${styles.total}`}>
            <dt>Total</dt>
            <dd className="type-price">{formatMoney(cart.cost.totalAmount)}</dd>
          </div>
        </dl>
      )}

      <div className={styles.action}>
        <Button href="/collection" variant="outline">
          Back to the collection
        </Button>
      </div>
    </div>
  );
}
