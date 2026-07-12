import type { Metadata } from "next";

interface PageMetadataInput {
  title: string;
  description: string;
  image: { url: string; width: number; height: number; alt: string };
}

/**
 * Explicit per-page Open Graph/Twitter metadata. Next.js does not fall back
 * to a parent segment's openGraph.images when a child sets its own
 * openGraph object, so every page needs its own image, not just title/description.
 */
export function pageMetadata({ title, description, image }: PageMetadataInput): Metadata {
  const images = [{ url: image.url, width: image.width, height: image.height, alt: image.alt }];
  // openGraph/twitter titles don't run through the root layout's title
  // template, so the "— ARV" suffix has to be added explicitly here.
  const fullTitle = `${title} — ARV`;

  return {
    title,
    description,
    openGraph: { title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
  };
}
