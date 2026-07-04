import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTWORKS, getArtwork } from "@/data/artworks";
import ArtworkDetail from "@/components/ArtworkDetail";

/* ============================================================
   PAGE PRODUIT — /collection/[id]
   Prerendue pour chaque oeuvre (SEO + rapidite)
   ============================================================ */

/* Prerend une page par oeuvre */
export function generateStaticParams() {
  return ARTWORKS.map((a) => ({ id: a.id }));
}

/* SEO par oeuvre */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const art = getArtwork(id);
  if (!art) return { title: "OneArtPix" };
  return {
    title: `${art.title} — OneArtPix`,
    description: art.description,
    openGraph: { title: `${art.title} — OneArtPix`, description: art.description, images: [art.images.main] },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = ARTWORKS.findIndex((a) => a.id === id);
  if (idx === -1) notFound();

  const artwork = ARTWORKS[idx];
  const prevId = ARTWORKS[(idx - 1 + ARTWORKS.length) % ARTWORKS.length].id;
  const nextId = ARTWORKS[(idx + 1) % ARTWORKS.length].id;

  return <ArtworkDetail artwork={artwork} prevId={prevId} nextId={nextId} />;
}
