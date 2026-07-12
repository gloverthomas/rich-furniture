import type { Metadata } from "next";
import Link from "next/link";
import { commerce, CATEGORIES, type Category } from "@/lib/commerce";
import { ProductCard } from "@/components/product/ProductCard";
import styles from "./collection.module.css";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Every piece in the ARV catalogue — seating, tables, lighting and storage, hand-built in Copenhagen from slow-dried hardwood.",
};

const FILTERS: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "dining", label: "Dining tables" },
  { value: "coffee", label: "Coffee tables" },
  { value: "side", label: "Side tables" },
];

interface CollectionPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const params = await searchParams;
  const active = CATEGORIES.includes(params.category as Category)
    ? (params.category as Category)
    : "all";

  const products = await commerce.getProducts(active === "all" ? undefined : { category: active });

  return (
    <div className={styles.page}>
      <header className={`container ${styles.header}`}>
        <p className="type-eyebrow">The catalogue</p>
        <h1 className={`type-hero ${styles.heading}`}>
          <span className="reveal-line">
            <span>The Collection</span>
          </span>
        </h1>
        <p className={`type-lede ${styles.lede}`}>
          {products.length} pieces, each built to order in Christianshavn. Lead time six to ten
          weeks — a piece of furniture should take longer than a season.
        </p>
      </header>

      <nav aria-label="Filter by category" className={`container ${styles.filters}`}>
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "all" ? "/collection" : `/collection?category=${filter.value}`}
            className={styles.filter}
            aria-current={active === filter.value ? "page" : undefined}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <section aria-label="Products" className={`container ${styles.grid}`}>
        {products.map((product, i) => (
          <div key={product.handle} className={styles.cell}>
            <ProductCard product={product} priority={i < 3} />
          </div>
        ))}
      </section>
    </div>
  );
}
