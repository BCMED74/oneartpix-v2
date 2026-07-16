/* ============================================================
   ONEARTPIX — GALERIE PRIVÉE
   Source unique de vérité pour les dossiers privés.
   Images à déposer dans : public/private-photos/<slug-du-dossier>/
   Pour ajouter un dossier : copier un bloc, changer slug/title/photos.
   ============================================================ */

export type PrivatePhoto = {
  src: string;    // chemin depuis /public  ex: "/private-photos/nouveaux/01.webp"
  title?: string; // légende affichée sous la photo (optionnel)
  note?: string;  // note courte, ex: "Tirage test baryta" (optionnel)
};

export type PrivateFolder = {
  slug: string;      // URL finale : /private/<slug>
  title: string;     // Nom affiché
  subtitle?: string; // Sous-titre discret
  cover: string;     // Image de couverture du dossier
  photos: PrivatePhoto[];
};

/* === LES DOSSIERS === */
/* Remplace ces exemples par tes vrais dossiers.                */

export const privateFolders: PrivateFolder[] = [
  {
    slug: "nouveaux-tirages",
    title: "Nouveaux tirages",
    subtitle: "Sélection en cours · non publiée",
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
    cover: "/private-photos/selection-villa/01.webp",
    photos: [
      { src: "/private-photos/selection-villa/01.webp", title: "Proposition 01", note: "Plexi 120 cm" },
      { src: "/private-photos/selection-villa/02.webp", title: "Proposition 02" },
    ],
  },
];

/* === HELPER === */

export function getPrivateFolder(slug: string): PrivateFolder | undefined {
  return privateFolders.find((f) => f.slug === slug);
}
