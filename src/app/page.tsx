import { commerce } from "@/lib/commerce";
import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { FeaturedWorks } from "@/components/home/FeaturedWorks";
import { CraftStory } from "@/components/scrolly-section/CraftStory";
import { EditorialBreak } from "@/components/home/EditorialBreak";
import { CategoryIndex } from "@/components/home/CategoryIndex";

export default async function Home() {
  const featured = await commerce.getProducts({ featured: true });

  return (
    <>
      <Hero />
      <Manifesto />
      <FeaturedWorks products={featured} />
      <CraftStory />
      <CategoryIndex />
      <EditorialBreak />
    </>
  );
}
