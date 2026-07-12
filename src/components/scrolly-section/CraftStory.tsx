import Image from "next/image";
import styles from "./craft-story.module.css";

const CHAPTERS = [
  {
    index: "01",
    eyebrow: "The tree",
    title: "We can name the forest.",
    body: "Every plank starts life as a whole log, chosen and sawn before it ever reaches the workshop. We stack, sticker and air-dry it ourselves before a single cut is made. Slow wood moves less. Slow wood lasts.",
    image: { src: "/site/craft-wood.jpg", alt: "Richard sourcing timber in the workshop" },
  },
  {
    index: "02",
    eyebrow: "The joint",
    title: "No screw where a joint will do.",
    body: "Wedged through-tenons, hand-cut dovetails, tusk tenons that knock apart and move house with you. Metal fixings work loose over decades; wood locked into wood only tightens. Our joints are the ornament — there is no other decoration in the catalogue.",
    image: { src: "/site/craft-joinery.jpg", alt: "Tom shaping a piece by hand in the workshop" },
  },
  {
    index: "03",
    eyebrow: "The surface",
    title: "Finished with oil, time and use.",
    body: "Cold-pressed linseed oil, beeswax, and nothing else. No lacquer film to scratch and cloud. The surface is the wood itself — it darkens, polishes under hands, and takes on the record of your household. In thirty years it will look better than today.",
    image: { src: "/site/craft-finish.jpg", alt: "Richard Lovell and Tom Glover in the ARV workshop" },
  },
] as const;

export function CraftStory() {
  return (
    <section className={styles.section} aria-labelledby="craft-heading" data-craft>
      <header className={`container ${styles.header}`}>
        <p className="type-eyebrow">The method</p>
        <h2 id="craft-heading" className="type-display">
          An architect and a maker. <em>One standard.</em>
        </h2>
      </header>

      <div className={`container ${styles.layout}`}>
        <div className={styles.visualColumn}>
          <div className={styles.visualStack} data-craft-stack>
            {CHAPTERS.map((chapter, i) => (
              <div
                key={chapter.index}
                className={styles.visual}
                data-craft-visual={i}
                aria-hidden="true"
              >
                <Image
                  src={chapter.image.src}
                  alt=""
                  width={1400}
                  height={1750}
                  sizes="(max-width: 900px) 0px, 45vw"
                  className={styles.visualImage}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chapters}>
          {CHAPTERS.map((chapter, i) => (
            <article key={chapter.index} className={styles.chapter} data-craft-chapter={i}>
              <div className={styles.mobileVisual}>
                <Image
                  src={chapter.image.src}
                  alt={chapter.image.alt}
                  width={1400}
                  height={1750}
                  sizes="(max-width: 900px) 100vw, 0px"
                  className={styles.visualImage}
                />
              </div>
              <p className={styles.index} aria-hidden="true">
                {chapter.index}
              </p>
              <p className="type-eyebrow">{chapter.eyebrow}</p>
              <h3 className={`type-title ${styles.chapterTitle}`}>{chapter.title}</h3>
              <p className={`type-body ${styles.chapterBody}`}>{chapter.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
