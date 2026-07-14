import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { pageMetadata } from "@/lib/seo";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import styles from "./bespoke.module.css";

export const metadata = pageMetadata({
  title: "Bespoke",
  description:
    "Commission a custom solid oak table from ARV. Tell us what you're imagining — a room, a dimension, a timber — and we'll draw it with you.",
  image: {
    url: "/site/editorial-2.jpg",
    width: 1400,
    height: 1750,
    alt: "A bespoke oak table with turned legs",
  },
});

const PROCESS = [
  {
    index: "01",
    title: "The conversation",
    body: "You tell us about the room, the household, the habits. A photo and a floor plan are worth more than a hundred emails.",
  },
  {
    index: "02",
    title: "The drawing",
    body: "Richard draws; you argue; the drawing gets better. Nothing is built until everyone has stopped arguing.",
  },
  {
    index: "03",
    title: "The build",
    body: "Tom builds it in the Sydney workshop from slow-dried oak, and it ships to you — wherever you are.",
  },
] as const;

export default async function BespokePage() {
  const products = await commerce.getProducts();
  const pieces = products.map((product) => product.title);

  return (
    <div className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <p className="type-eyebrow">Bespoke</p>
        <h1 className={`type-hero ${styles.heading}`}>
          <span className="reveal-line">
            <span>Commission</span>
          </span>
          <span className="reveal-line">
            <span>
              your <em>own.</em>
            </span>
          </span>
        </h1>
        <p className={`type-lede ${styles.lede}`}>
          Every table in the catalogue can be resized, rethought, or used as the first sketch of
          something entirely yours. Start the conversation below.
        </p>
      </header>

      <div className={`container ${styles.layout}`}>
        <section aria-label="Enquiry form" className={styles.formColumn}>
          <EnquiryForm pieces={pieces} />
        </section>

        <aside className={styles.aside}>
          <div className={styles.asideImage} data-reveal>
            <Image
              src="/site/editorial-2.jpg"
              alt="A bespoke oak table with turned legs in an arched room"
              width={1400}
              height={1750}
              sizes="(max-width: 900px) 100vw, 38vw"
            />
          </div>
          <ol role="list" className={styles.process}>
            {PROCESS.map((step) => (
              <li key={step.index} className={styles.step}>
                <p className={styles.stepIndex} aria-hidden="true">
                  {step.index}
                </p>
                <h2 className="type-subtitle">{step.title}</h2>
                <p className={`type-body ${styles.stepBody}`}>{step.body}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
