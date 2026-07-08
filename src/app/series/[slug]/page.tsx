import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/components/ProjectPage";
import { SERIES, seriesBySlug, worksFor } from "@/data/series";

/* ============================================================
   PAGE-UNIVERS DYNAMIQUE — /series/[slug]
   Rend le même composant ProjectPage que /twins & /transmutations,
   pour les séries Ice & Frost, Landscapes, Textures, Living World.
   ============================================================ */

/* On ne génère QUE les séries hébergées sous /series/… (Twins et
   Transmutations ont déjà leurs propres routes dédiées). */
export function generateStaticParams() {
  return SERIES.filter((s) => s.href.startsWith("/series/")).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const s = seriesBySlug(slug);
  if (!s) return { title: "Series — OneArtPix" };
  return { title: `${s.title} — OneArtPix`, description: s.sub };
}

export default async function SeriesUniverse(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const s = seriesBySlug(slug);
  if (!s || !s.href.startsWith("/series/")) notFound();

  /* Liens "Continue" : deux autres séries + la collection complète */
  const others = SERIES.filter((x) => x.slug !== s.slug).slice(0, 2)
    .map((x) => ({ label: x.title, href: x.href }));

  return (
    <ProjectPage
      eyebrow={s.sub}
      title={s.title}
      intro={s.intro}
      works={worksFor(s)}
      explore={[...others, { label: "All the Collection", href: "/collection" }]}
    />
  );
}
