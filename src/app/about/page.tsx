import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";
import styles from "./about.module.css";

export const metadata = pageMetadata({
  title: "The Studio",
  description:
    "ARV is a two-person studio in Sydney — architect Richard Lovell and maker Tom Glover — building solid oak tables for clients around the world.",
  image: {
    url: "/site/about-workshop.jpg",
    width: 2400,
    height: 1170,
    alt: "Richard Lovell and Tom Glover in the ARV workshop",
  },
});

const FACTS = [
  { value: "2", label: "Founders, one studio" },
  { value: "Sydney", label: "Where every piece is made" },
  { value: "Worldwide", label: "Where every piece ships" },
  { value: "100%", label: "Solid oak, every time" },
] as const;

const MATERIALS = [
  {
    image: "/site/craft-wood.jpg",
    title: "Slow wood",
    body: "Solid oak, bought as whole logs and air-dried before a single cut is made. We're particular about what makes it into the workshop.",
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
        <p className="type-eyebrow">The studio</p>
        <h1 className={`type-hero ${styles.heading}`}>
          <span className="reveal-line">
            <span>An architect</span>
          </span>
          <span className="reveal-line">
            <span>
              and a <em>maker.</em>
            </span>
          </span>
        </h1>
        <p className={`type-lede ${styles.lede}`}>
          ARV is run by two people out of a Sydney workshop: an architect and a maker, building
          solid oak tables for clients who mostly never see the workshop in person.
        </p>
      </header>

      <div className={styles.workshopImage} data-parallax>
        <Image
          src="/site/about-workshop.jpg"
          alt="Richard Lovell and Tom Glover in the ARV workshop"
          width={2400}
          height={1170}
          sizes="100vw"
          className={styles.workshopImg}
        />
      </div>

      <section className={`container ${styles.history}`} aria-labelledby="history-heading">
        <h2 id="history-heading" className={`type-display ${styles.historyHeading}`} data-reveal-lines>
          Two disciplines. <em>One table.</em>
        </h2>
        <div className={styles.historyBody}>
          <p className="type-body">
            Richard Lovell is an award-winning architect, trained to think about a room before he
            thinks about a table. Tom Glover is a maker, more interested in how a joint will feel
            in thirty years than how it photographs today. ARV is what happens when those two
            instincts have to agree before anything gets built.
          </p>
          <p className="type-body">
            Every piece starts as a drawing and ends on a bench in Sydney, shaped by the same two
            hands that argued about the drawing. We ship worldwide, and we stand behind
            everything that leaves the workshop — if a piece ever needs attention, get in touch
            and we&apos;ll sort it.
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
          <p className="type-eyebrow">Get in touch</p>
          <h2 id="visit-heading" className={`type-display ${styles.visitHeading}`}>
            We ship further than <em>we can drive.</em>
          </h2>
          <p className={`type-body ${styles.visitBody}`}>
            ARV is based in Sydney, but most conversations start with a photo and a floor plan,
            not a workshop visit. Get in touch and we&apos;ll figure out what&apos;s possible —
            wherever you are.
          </p>
        </div>
        <div className={styles.visitAction}>
          <Button href="/bespoke">Start an enquiry</Button>
        </div>
      </section>
    </div>
  );
}
