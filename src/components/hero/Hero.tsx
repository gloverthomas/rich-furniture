import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading" data-hero>
      <div className={styles.media} data-hero-media>
        <Image
          src="/site/hero.jpg"
          alt="A calm Copenhagen living room furnished with ARV pieces in oak and wool"
          width={2400}
          height={1400}
          priority
          fetchPriority="high"
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      <div className={`container ${styles.content}`}>
        <p className={`type-eyebrow ${styles.eyebrow}`} data-hero-eyebrow>
          Snedkeri ARV · København · Est. 1962
        </p>
        <h1 id="hero-heading" className={`type-hero ${styles.heading}`}>
          <span className="reveal-line">
            <span data-hero-line>Furniture made</span>
          </span>
          <span className="reveal-line">
            <span data-hero-line>
              to be <em>inherited.</em>
            </span>
          </span>
        </h1>
        <div className={styles.foot} data-hero-foot>
          <Link href="/collection" className={`${styles.cta} text-link`}>
            Explore the collection
          </Link>
          <p className={styles.scrollCue} aria-hidden="true">
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}
