import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import styles from "./header.module.css";

const NAV_LINKS = [
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "Craft" },
] as const;

export function Header() {
  return (
    <header className={styles.header} data-site-header>
      <div className={styles.inner}>
        <nav aria-label="Main navigation" className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`${styles.navLink} text-link`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className={styles.wordmark} aria-label="ARV — home">
          ARV
        </Link>

        <div className={styles.actions}>
          <CartButton className={styles.navLink} />
        </div>
      </div>
    </header>
  );
}
