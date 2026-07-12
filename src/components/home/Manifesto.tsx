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
          ARV is the Danish word for inheritance. The studio is two people — architect Richard
          Lovell and maker Tom Glover — building solid oak tables in Sydney for clients around
          the world.
        </p>
        <Link href="/about" className={`${styles.link} text-link`}>
          Read the studio&apos;s story
        </Link>
      </div>
    </section>
  );
}
