/* ============================================================
   ONEARTPIX — GALERIE PRIVÉE
   Images : public/private-photos/<slug>/

   scope  = la portée qui donne accès à ce dossier
   family = theme (thématiques) | client | perso
   ============================================================ */

export type PrivatePhoto = {
  src: string;
  title?: string;
  note?: string;
};

export type PrivateFolder = {
  slug: string;
  title: string;
  subtitle?: string;
  scope: string;
  family: "theme" | "client" | "perso";
  cover: string;
  photos: PrivatePhoto[];
};

/* === LES DOSSIERS === */

export const privateFolders: PrivateFolder[] = [
  {
    slug: "nouveaux-tirages",
    title: "Nouveaux tirages",
    subtitle: "Sélection en cours · non publiée",
    scope: "PRIVE",
    family: "perso",
    cover: "/private-photos/nouveaux-tirages/01.webp",
    photos: [
      { src: "/private-photos/nouveaux-tirages/01.webp", title: "Sans titre 01" },
      { src: "/private-photos/nouveaux-tirages/02.webp", title: "Sans titre 02" },
      { src: "/private-photos/nouveaux-tirages/03.webp", title: "Sans titre 03" },
    ],
  },
  {
    slug: "selection-villa",
    title: "Sélection villa",
    subtitle: "Proposition sur mesure",
    scope: "VILLA",
    family: "client",
    cover: "/private-photos/selection-villa/01.webp",
    photos: [
      { src: "/private-photos/selection-villa/01.webp", title: "Proposition 01", note: "Plexi 120 cm" },
      { src: "/private-photos/selection-villa/02.webp", title: "Proposition 02" },
    ],
  },
];

/* === HELPERS === */

export function getPrivateFolder(slug: string): PrivateFolder | undefined {
  return privateFolders.find((f) => f.slug === slug);
}

export function allScopes(): string[] {
  return Array.from(new Set(privateFolders.map((f) => f.scope))).sort();
}
