import type { Metadata } from "next";
import ProjectPage from "@/components/ProjectPage";
import { ARTWORKS } from "@/data/artworks";

/* === THE TWINS === univers dédié · uniquement les œuvres isTwin === */
export const metadata: Metadata = {
  title: "The Twins — OneArtPix",
  description: "Original & Chromatic Twin — parallel visions of the same instant.",
};

const works = ARTWORKS.filter((a) => a.isTwin);

export default function TwinsPage() {
  /* Vidéo (optionnelle) : dépose ton .mp4 dans /public, puis ajoute au composant ci-dessous :
     video="/twins.mp4" videoPoster="/twins-poster.jpg" videoCaption="The Twins — the film" */
  return (
    <ProjectPage
      eyebrow="Original & Chromatic Twin"
      title="The Twins"
      intro={
        "Every Twin begins as a single photograph — the Original. Its Chromatic Twin is that very frame reborn in another spectrum: the same instant, seen through a parallel light.\n\nApart, each print stands on its own. Brought together — Reunited — they complete one another: a quiet dialogue between what the eye saw and what light can become."
      }
      works={works}
      explore={[
        { label: "Transmutations", href: "/transmutations" },
        { label: "The full Collection", href: "/collection" },
      ]}
    />
  );
}
