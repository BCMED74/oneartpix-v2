import { ARTWORKS, type Artwork } from "@/data/artworks";

/* ============================================================
   SÉRIES / PROJETS — source unique de vérité
   Utilisée par : la page Collection (index premium) et les
   pages-univers (/twins, /transmutations, /series/[slug]).
   Pour déplacer une œuvre : édite ses ids ici.
   ============================================================ */

export type Series = {
  slug: string;                 // segment d'URL
  href: string;                 // chemin complet (/twins, /transmutations ou /series/xxx)
  title: string;
  sub: string;                  // sur-titre
  intro: string;                // texte d'intro de l'univers (paragraphes séparés par \n\n)
  ids?: string[];               // œuvres par id (ordre conservé)
  match?: (a: Artwork) => boolean; // ou par condition (ex. isTwin)
};

export const SERIES: Series[] = [
  {
    slug: "twins", href: "/twins",
    title: "The Twins", sub: "Original & Chromatic Twin",
    intro:
      "Every Twin begins as a single photograph — the Original. Its Chromatic Twin is that very frame reborn in another spectrum: the same instant, seen through a parallel light.\n\nApart, each print stands on its own. Brought together — Reunited — they complete one another: a quiet dialogue between what the eye saw and what light can become.",
    match: (a) => a.isTwin,
  },
  {
    slug: "transmutations", href: "/transmutations",
    title: "Transmutations", sub: "Ongoing project · unique pieces",
    intro:
      "An ongoing project. Each photograph is printed on plexiglass, then physically transformed — molten metal (gold, silver, copper) is poured onto the surface to trace veins of light, or the image is recut into a mosaic of fragments.\n\nThe aim is simple: turn a single photograph into a unique, hand-finished object. Works in progress — each piece is one of a kind, available on request.",
    ids: ["gold-river", "fragments"],
  },
  {
    slug: "ice", href: "/series/ice",
    title: "Ice & Frost", sub: "Studies in cold",
    intro:
      "Cold as a subject in itself — frost blooming on glass, crystalline structures, the geometry that appears when water stops moving.\n\nStudies made in the low, blue light of Swiss winters.",
    ids: ["crystalline", "glacial", "hoarfrost", "first-frost", "dew"],
  },
  {
    slug: "landscapes", href: "/series/landscapes",
    title: "Landscapes & Nature", sub: "Light on the land",
    intro:
      "Light doing the work. Wide, quiet frames where the land, the lake and the sky meet — caught in the few minutes when the light turns.",
    ids: ["daybreak", "riviera", "still-waters", "golden-valley", "above-the-clouds"],
  },
  {
    slug: "textures", href: "/series/textures",
    title: "Textures & Details", sub: "Form, grain & abstraction",
    intro:
      "The close view. Grain, bark, weathered wood — form reduced to line and matter, on the edge of abstraction.",
    ids: ["heartwood", "silver-bark", "driftwood"],
  },
  {
    slug: "living", href: "/series/living",
    title: "The Living World", sub: "Wildlife & nature",
    intro:
      "The living, on its own terms. Wildlife met in the wild, without staging — a manta in the dark, a lion at golden hour.",
    ids: ["manta", "golden-hour", "ember"],
  },
];

/* Œuvres d'une série (par condition ou par ids, ordre conservé) */
export function worksFor(s: Series): Artwork[] {
  if (s.match) return ARTWORKS.filter(s.match);
  return (s.ids ?? [])
    .map((id) => ARTWORKS.find((a) => a.id === id))
    .filter((a): a is Artwork => !!a);
}

/* Image de couverture d'une série (1re œuvre) */
export function coverFor(s: Series): string {
  return worksFor(s)[0]?.images.main ?? "";
}

/* Retrouver une série par son slug */
export function seriesBySlug(slug: string): Series | undefined {
  return SERIES.find((s) => s.slug === slug);
}
