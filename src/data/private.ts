/* ============================================================
   ONEARTPIX — PRIVATE GALLERY
   Photos : public/private-photos/<slug>/

   scope        = access key that opens this folder
   family       = theme (The Reserve) | client | perso
   downloadable = enables ZIP download (reads the hd/ folder)
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
  downloadable?: boolean;
  cover: string;
  photos: PrivatePhoto[];
};

/* === FOLDERS === */

export const privateFolders: PrivateFolder[] = [

  /* ---------- PERSONAL ---------- */
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
    slug: "montagne",
    title: "Montagne",
    subtitle: "Sortie entre amis",
    scope: "MONTAGNE",
    family: "perso",
    downloadable: true,
    cover: "/private-photos/montagne/web/01.webp",
    photos: [
      { src: "/private-photos/montagne/web/01.webp" },
      { src: "/private-photos/montagne/web/02.webp" },
      { src: "/private-photos/montagne/web/03.webp" },
    ],
  },

  /* ---------- CLIENTS ---------- */
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

  /* ---------- THE RESERVE ---------- */
  /* Single scope: one code opens all seven territories.
     Covers reuse the public /reserve images: no duplicate upload. */
  {
    slug: "mountains-snow",
    title: "Mountains & Snow",
    subtitle: "Silence · altitude",
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/mountains-snow.webp",
    photos: [
      { src: "/private-photos/mountains-snow/01.webp", title: "Snow 01" },
      { src: "/private-photos/mountains-snow/02.webp", title: "Snow 02" },
      { src: "/private-photos/mountains-snow/03.webp", title: "Snow 03" },
    ],
  },
  {
    slug: "green",
    title: "Green",
    subtitle: "Forêts · canopées",
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/green.webp",
    photos: [
      { src: "/private-photos/green/01.webp", title: "Green 01" },
      { src: "/private-photos/green/02.webp", title: "Green 02" },
      { src: "/private-photos/green/03.webp", title: "Green 03" },
    ],
  },
  {
    slug: "botanica",
    title: "Botanica",
    subtitle: "Lumière traversante · matière",
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/botanica.webp",
    photos: [
      { src: "/private-photos/botanica/01.webp", title: "Botanica 01" },
      { src: "/private-photos/botanica/02.webp", title: "Botanica 02" },
    ],
  },
  {
    slug: "grain",
    title: "Grain",
    subtitle: "Bois · veines · usure",
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/grain.webp",
    photos: [
      { src: "/private-photos/grain/01.webp", title: "Grain 01" },
      { src: "/private-photos/grain/02.webp", title: "Grain 02" },
    ],
  },
  {
    slug: "sea-water",
    title: "Sea & Water",
    subtitle: "Mouvement · surface",
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/sea-water.webp",
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
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/africa.webp",
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
    scope: "RESERVE",
    family: "theme",
    cover: "/reserve/wildlife.webp",
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

/* Themes shown publicly on The Reserve. */
export function themeFolders(): PrivateFolder[] {
  return privateFolders.filter((f) => f.family === "theme");
}
