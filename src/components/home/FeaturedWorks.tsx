import Link from "next/link";
import type { Product } from "@/lib/commerce";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./featured-works.module.css";

interface FeaturedWorksProps {
  products: Product[];
}

export function FeaturedWorks({ products }: FeaturedWorksProps) {
  const [first, second, third, fourth, fifth] = products;

  return (
    <section className={`container ${styles.section}`} aria-labelledby="featured-heading">
      <header className={styles.header}>
        <div>
          <p className="type-eyebrow">Selected works</p>
          <h2 id="featured-heading" className="type-display">
            Pieces of record
          </h2>
        </div>
        <Link href="/collection" className={`${styles.viewAll} text-link`}>
          All {""}pieces
        </Link>
      </header>

      <div className={styles.grid}>
        {first && (
          <div className={styles.slotA}>
            <ProductCard product={first} size="feature" />
          </div>
        )}
        {second && (
          <div className={styles.slotB}>
            <ProductCard product={second} />
          </div>
        )}
        {third && (
          <div className={styles.slotC}>
            <ProductCard product={third} />
          </div>
        )}
        {fourth && (
          <div className={styles.slotD}>
            <ProductCard product={fourth} size="feature" />
          </div>
        )}
        {fifth && (
          <div className={styles.slotE}>
            <ProductCard product={fifth} />
          </div>
        )}
      </div>
    </section>
  );
}
