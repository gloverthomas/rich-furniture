import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "The Workshop",
  description:
    "Snedkeri ARV is a third-generation joinery in Christianshavn, Copenhagen. Slow-dried hardwood, hand-cut joints, furniture built to be inherited.",
};

const FACTS = [
  { value: "1962", label: "Founded on Værkstedsvej" },
  { value: "3", label: "Generations of joiners" },
  { value: "14", label: "Hands in the workshop" },
  { value: "3 yrs", label: "Every plank air-dried" },
] as const;

const MATERIALS = [
  {
    image: "/site/craft-wood.jpg",
    title: "Slow wood",
    body: "Oak, ash and walnut bought as whole logs and dried in our own yard. We reject nine of every ten logs we are offered.",
  },
  {
    image: "/site/craft-joinery.jpg",
    title: "Honest joints",
    body: "Wedged tenons and hand-cut dovetails. If a joint cannot be seen, it can still be felt — in the fourth decade, mostly.",
  },
  {
    image: "/site/craft-finish.jpg",
    title: "Living surfaces",
    body: "Linseed oil and beeswax, never lacquer. The surface improves with your fingerprints; we simply give it a head start.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <p className="type-eyebrow">The workshop</p>
        <h1 className={`type-hero ${styles.heading}`}>
          <span className="reveal-line">
            <span>Three generations</span>
          </span>
          <span className="reveal-line">
            <span>
              of <em>stubbornness.</em>
            </span>
          </span>
        </h1>
        <p className={`type-lede ${styles.lede}`}>
          Snedkeri ARV has occupied the same workshop in Christianshavn since 1962. The machines
          have changed twice. The standard has not changed at all.
        </p>
      </header>

      <div className={styles.workshopImage} data-parallax>
        <Image
          src="/site/about-workshop.jpg"
          alt="An Otto pedestal table styled in a Copenhagen living room"
          width={1400}
          height={1750}
          sizes="100vw"
          className={styles.workshopImg}
        />
      </div>

      <section className={`container ${styles.history}`} aria-labelledby="history-heading">
        <h2 id="history-heading" className={`type-display ${styles.historyHeading}`} data-reveal-lines>
          Founded by a man who refused to <em>sand away</em> his tool marks.
        </h2>
        <div className={styles.historyBody}>
          <p className="type-body">
            Jørgen Arv-Nielsen believed a piece of furniture should admit how it was made. His
            tables kept their plane tracks and showed their wedged tenons like signatures.
            Copenhagen called it unfinished. Then Copenhagen called it honest. Then Copenhagen
            simply called it ARV.
          </p>
          <p className="type-body">
            Today his granddaughter Astrid runs the floor with six joiners. Every piece that
            leaves Værkstedsvej is stamped with the year, the joiner&apos;s initials, and a number
            in a ledger that now spans four shelves. When a piece changes hands — estate sales,
            inheritances, the occasional divorce — we are often asked to re-oil it. We always say
            yes. It is our furniture; you are only its current custodian.
          </p>
        </div>

        <dl className={styles.facts}>
          {FACTS.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className="type-eyebrow">{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="materials" className={styles.materials} aria-labelledby="materials-heading">
        <div className={`container ${styles.materialsInner}`}>
          <header className={styles.materialsHeader}>
            <p className="type-eyebrow">Materials &amp; method</p>
            <h2 id="materials-heading" className="type-display">
              What we will not compromise
            </h2>
          </header>
          <div className={styles.materialGrid}>
            {MATERIALS.map((material, i) => (
              <article key={material.title} className={styles.material} data-reveal>
                <div className={styles.materialFrame}>
                  <Image
                    src={material.image}
                    alt=""
                    width={1400}
                    height={1750}
                    sizes="(max-width: 820px) 100vw, 33vw"
                    className={styles.materialImg}
                  />
                </div>
                <p className={styles.materialIndex} aria-hidden="true">
                  0{i + 1}
                </p>
                <h3 className="type-subtitle">{material.title}</h3>
                <p className={`type-body ${styles.materialBody}`}>{material.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workshop" className={`container ${styles.visit}`} aria-labelledby="visit-heading">
        <div>
          <p className="type-eyebrow">Visit</p>
          <h2 id="visit-heading" className={`type-display ${styles.visitHeading}`}>
            The door is open on <em>Fridays.</em>
          </h2>
          <p className={`type-body ${styles.visitBody}`}>
            Værkstedsvej 14, Christianshavn. Come smell the linseed oil, argue about tables, and
            see your commission on the bench. Coffee is black; opinions are free.
          </p>
        </div>
        <div className={styles.visitAction}>
          <Button href="/collection" variant="outline">
            Browse the collection
          </Button>
        </div>
      </section>
    </div>
  );
}
