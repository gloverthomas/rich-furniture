import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { commerce } from "@/lib/commerce";
import { pageMetadata } from "@/lib/seo";
import { ProductForm } from "@/components/product/ProductForm";
import styles from "./product.module.css";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) return {};

  return pageMetadata({
    title: product.title,
    description: product.description,
    image: {
      url: product.featuredImage.url,
      width: product.featuredImage.width,
      height: product.featuredImage.height,
      alt: product.featuredImage.altText,
    },
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) notFound();

  const [primary, detail] = product.images;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.gallery}>
          <div className={styles.frame} data-reveal>
            <Image
              src={primary.url}
              alt={primary.altText}
              width={primary.width}
              height={primary.height}
              priority
              fetchPriority="high"
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </div>
          {detail && (
            <div className={`${styles.frame} ${styles.detailFrame}`} data-reveal>
              <Image
                src={detail.url}
                alt={detail.altText}
                width={detail.width}
                height={detail.height}
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
          )}
        </div>

        <aside className={styles.info}>
          <div className={styles.infoInner}>
            <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
              <Link href="/collection" className="text-link">
                Collection
              </Link>
              <span aria-hidden="true"> / </span>
              <Link href={`/collection?category=${product.category}`} className="text-link">
                {product.category}
              </Link>
            </nav>

            <h1 className={`type-title ${styles.title}`}>{product.title}</h1>
            <p className={`type-body ${styles.description}`}>{product.description}</p>

            <ProductForm product={product} />

            <dl className={styles.specs}>
              <div className={styles.specRow}>
                <dt className="type-eyebrow">Details</dt>
                <dd>
                  <ul role="list" className={styles.detailList}>
                    {product.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className={styles.specRow}>
                <dt className="type-eyebrow">Dimensions</dt>
                <dd className="type-small">{product.dimensions}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <section className={styles.provenance} aria-labelledby="provenance-heading">
        <div className={`container ${styles.provenanceInner}`}>
          <p className="type-eyebrow" id="provenance-heading">
            Provenance
          </p>
          <blockquote className={styles.story} data-reveal-lines>
            {product.story}
          </blockquote>
          <Link href="/about" className={`${styles.provenanceLink} text-link`}>
            More about the workshop
          </Link>
        </div>
      </section>
    </div>
  );
}
