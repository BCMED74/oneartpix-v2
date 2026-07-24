/* ============================================================
   ONEARTPIX — GALERIE PRIVÉE
   Images : public/private-photos/<slug>/

   scope  = la portée qui donne accès à ce dossier
   family = theme (The Reserve) | client | perso
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

  /* --- PERSO --- */
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

  /* --- CLIENTS --- */
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

  /* --- THE RESERVE (thématiques) --- */
  {
    slug: "snow",
    title: "Snow",
    subtitle: "Silence · altitude",
    scope: "SNOW",
    family: "theme",
    cover: "/private-photos/snow/01.webp",
    photos: [
      { src: "/private-photos/snow/01.webp", title: "Snow 01" },
      { src: "/private-photos/snow/02.webp", title: "Snow 02" },
      { src: "/private-photos/snow/03.webp", title: "Snow 03" },
    ],
  },
  {
    slug: "green",
    title: "Green",
    subtitle: "Forêts · canopées",
    scope: "GREEN",
    family: "theme",
    cover: "/private-photos/green/01.webp",
    photos: [
      { src: "/private-photos/green/01.webp", title: "Green 01" },
      { src: "/private-photos/green/02.webp", title: "Green 02" },
      { src: "/private-photos/green/03.webp", title: "Green 03" },
    ],
  },
  {
    slug: "sea-water",
    title: "Sea & Water",
    subtitle: "Mouvement · surface",
    scope: "SEA",
    family: "theme",
    cover: "/private-photos/sea-water/01.webp",
    photos: [
      { src: "/private-photos/sea-water/01.webp", title: "Sea 01" },
      { src: "/private-photos/sea-water/02.webp", title: "Sea 02" },
      { src: "/private-photos/sea-water/03.webp", title: "Sea 03" },
    ],
  },
  {
    slug: "africa",
    title: "Africa",
    subtitle: "Lumière · immensité",
    scope: "AFRICA",
    family: "theme",
    cover: "/private-photos/africa/01.webp",
    photos: [
      { src: "/private-photos/africa/01.webp", title: "Africa 01" },
      { src: "/private-photos/africa/02.webp", title: "Africa 02" },
      { src: "/private-photos/africa/03.webp", title: "Africa 03" },
    ],
  },
  {
    slug: "wildlife",
    title: "Wildlife",
    subtitle: "Regards · présence",
    scope: "WILDLIFE",
    family: "theme",
    cover: "/private-photos/wildlife/01.webp",
    photos: [
      { src: "/private-photos/wildlife/01.webp", title: "Wildlife 01" },
      { src: "/private-photos/wildlife/02.webp", title: "Wildlife 02" },
      { src: "/private-photos/wildlife/03.webp", title: "Wildlife 03" },
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

/* Les thématiques visibles publiquement sur The Reserve. */
export function themeFolders(): PrivateFolder[] {
  return privateFolders.filter((f) => f.family === "theme");
}
