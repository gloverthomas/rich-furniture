import Image from "next/image";
import styles from "./editorial-break.module.css";

export function EditorialBreak() {
  return (
    <section className={styles.section} aria-label="A word from the workshop">
      <div className={styles.media} data-parallax>
        <Image
          src="/site/editorial-1.jpg"
          alt="Morning light across a quiet living room"
          width={2400}
          height={1400}
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.scrim} aria-hidden="true" />
      </div>
      <blockquote className={`container ${styles.quote}`}>
        <p className={styles.quoteText} data-reveal-lines>
          &ldquo;A table should stand the way the tree once stood — without ever thinking
          about it.&rdquo;
        </p>
        <cite className={`type-eyebrow ${styles.cite}`}>Richard Lovell &amp; Tom Glover, ARV Studio</cite>
      </blockquote>
    </section>
  );
}
