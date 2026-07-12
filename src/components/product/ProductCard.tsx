import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce";
import { formatMoney } from "@/lib/format";
import styles from "./product-card.module.css";

interface ProductCardProps {
  product: Product;
  /** Larger editorial framing for feature slots */
  size?: "standard" | "feature";
  priority?: boolean;
}

export function ProductCard({ product, size = "standard", priority = false }: ProductCardProps) {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const hasRange = minVariantPrice.amount !== maxVariantPrice.amount;

  return (
    <Link
      href={`/product/${product.handle}`}
      className={`${styles.card} ${size === "feature" ? styles.feature : ""}`}
      data-reveal
    >
      <div className={styles.frame}>
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          width={product.featuredImage.width}
          height={product.featuredImage.height}
          sizes={size === "feature" ? "(max-width: 820px) 100vw, 55vw" : "(max-width: 820px) 100vw, 33vw"}
          priority={priority}
          className={styles.image}
        />
      </div>
      <div className={styles.meta}>
        <div>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={`type-eyebrow ${styles.category}`}>{product.category}</p>
        </div>
        <p className={`type-price ${styles.price}`}>
          {hasRange && <span className={styles.from}>from </span>}
          {formatMoney(minVariantPrice)}
        </p>
      </div>
    </Link>
  );
}
