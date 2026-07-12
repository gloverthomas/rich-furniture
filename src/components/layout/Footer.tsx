import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/collection", label: "All pieces" },
      { href: "/collection?category=dining", label: "Dining tables" },
      { href: "/collection?category=coffee", label: "Coffee tables" },
      { href: "/collection?category=side", label: "Side tables" },
    ],
  },
  {
    heading: "Atelier",
    links: [
      { href: "/about", label: "Our craft" },
      { href: "/about#materials", label: "Materials" },
      { href: "/about#workshop", label: "The workshop" },
    ],
  },
] as const;

const FEATURE_LINKS = [
  { href: "/collection", label: "See our tables" },
  { href: "/about#workshop", label: "Commission your own" },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer} data-site-footer>
      <div className={`container ${styles.feature}`}>
        <div className={styles.featureText}>
          <p className="type-eyebrow">Bespoke</p>
          <h2 className={`type-display ${styles.featureHeading}`}>
            Every table can be <em>made to order.</em>
          </h2>
          <div className={styles.featureLinks}>
            {FEATURE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={`${styles.featureLink} text-link`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.featureImage}>
          <Image
            src="/products/duo-coffee-table-1.jpg"
            alt="A Duo coffee table styled with a small ceramic vase"
            width={1600}
            height={2000}
            sizes="(max-width: 820px) 100vw, 38vw"
          />
        </div>
      </div>

      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <p className={styles.statement}>
            Furniture is not bought.
            <br />
            <em>It is inherited.</em>
          </p>
          <p className={`type-small ${styles.address}`}>
            Snedkeri ARV · Værkstedsvej 14
            <br />
            1432 København K, Danmark
          </p>
        </div>

        <div className={styles.columns}>
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className={styles.column}>
              <h3 className="type-eyebrow">{column.heading}</h3>
              <ul role="list" className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={`${styles.link} text-link`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span className={styles.mark} aria-hidden="true">
          ARV
        </span>
        <p className={`type-small ${styles.legal}`}>
          © {new Date().getFullYear()} Snedkeri ARV. Est. 1962.
        </p>
      </div>
    </footer>
  );
}
