import Link from "next/link";
import styles from "./manifesto.module.css";

export function Manifesto() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="manifesto-heading">
      <p className="type-eyebrow">The idea</p>
      <h2 id="manifesto-heading" className={`type-display ${styles.statement}`} data-reveal-lines>
        A table is a promise: that what we take from the forest will{" "}
        <em>outlive the person who takes it.</em>
      </h2>
      <div className={styles.aside}>
        <p className="type-body">
          ARV is the Danish word for inheritance. Since 1962 our workshop in Christianshavn has
          built oak tables for one buyer and two generations of strangers — the people who will
          own each piece after you.
        </p>
        <Link href="/about" className={`${styles.link} text-link`}>
          Read the workshop&apos;s story
        </Link>
      </div>
    </section>
  );
}
