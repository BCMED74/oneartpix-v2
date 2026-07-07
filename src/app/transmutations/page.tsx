import type { Metadata } from "next";
import ProjectPage from "@/components/ProjectPage";
import { ARTWORKS, type Artwork } from "@/data/artworks";

/* === TRANSMUTATIONS === univers dédié · pièces uniques (mêmes ids que la collection) === */
export const metadata: Metadata = {
  title: "Transmutations — OneArtPix",
  description: "An ongoing project — photographs transformed into unique, hand-finished objects.",
};

const IDS = ["gold-river", "fragments"];
const works = IDS
  .map((id) => ARTWORKS.find((a) => a.id === id))
  .filter((a): a is Artwork => !!a);

export default function TransmutationsPage() {
  /* Vidéo (optionnelle) :
     video="/transmutations.mp4" videoPoster="/transmutations-poster.jpg" videoCaption="Transmutations — in the studio" */
  return (
    <ProjectPage
      eyebrow="Ongoing project · unique pieces"
      title="Transmutations"
      intro={
        "An ongoing project. Each photograph is printed on plexiglass, then physically transformed — molten metal (gold, silver, copper) is poured onto the surface to trace veins of light, or the image is recut into a mosaic of fragments.\n\nThe aim is simple: turn a single photograph into a unique, hand-finished object. Works in progress — each piece is one of a kind, available on request."
      }
      works={works}
      explore={[
        { label: "The Twins", href: "/twins" },
        { label: "The full Collection", href: "/collection" },
      ]}
    />
  );
}
