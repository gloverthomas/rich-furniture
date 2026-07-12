import Image from "next/image";
import Link from "next/link";
import styles from "./category-index.module.css";

const CATEGORY_TILES = [
  { category: "dining", label: "Dining tables", image: "/products/iggy-dining-table-1.jpg" },
  { category: "coffee", label: "Coffee tables", image: "/products/steve-coffee-table-1.jpg" },
  { category: "side", label: "Side tables", image: "/products/sam-side-table-1.jpg" },
] as const;

export function CategoryIndex() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="categories-heading">
      <header className={styles.header}>
        <p className="type-eyebrow">The catalogue</p>
        <h2 id="categories-heading" className="type-display">
          By room, by need
        </h2>
      </header>

      <ul role="list" className={styles.tiles}>
        {CATEGORY_TILES.map((tile, i) => (
          <li key={tile.category} className={styles.tile} style={{ "--i": i } as React.CSSProperties}>
            <Link href={`/collection?category=${tile.category}`} className={styles.tileLink}>
              <span className={styles.frame}>
                <Image
                  src={tile.image}
                  alt=""
                  width={1600}
                  height={2000}
                  sizes="(max-width: 820px) 50vw, 25vw"
                  className={styles.image}
                />
              </span>
              <span className={styles.label}>
                <span className={styles.labelText}>{tile.label}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
