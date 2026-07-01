/* ============================================================
   DONNÉES PARTAGÉES — OneArtPix
   Utilisé par le carrousel (Collection) ET les pages produit
   ============================================================ */

export type Artwork = {
  id: string;
  title: string;
  location: string;
  year: string;
  editions: string;
  isTwin: boolean;
  images: { main: string; twin: string };
  description: string;
};

/* === Tarifs par numéro d'édition === */
export const EDITIONS = [
  { label: "1/5", price: 1200 },
  { label: "2/5", price: 1800 },
  { label: "3/5", price: 3000 },
  { label: "4/5", price: 5000 },
  { label: "5/5", price: 8000 },
];

/* === Remise pour la paire complète (Original + Twin) === */
export const TWIN_DISCOUNT = 0.2; // -20%

/* === Prix formaté façon suisse : 1200 -> "1'200 CHF" === */
export const formatCHF = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") + " CHF";

/* === Prix de la paire complète pour une édition donnée === */
export const pairPrice = (single: number) =>
  Math.round(single * 2 * (1 - TWIN_DISCOUNT));

/* === Catalogue === */
export const ARTWORKS: Artwork[] = [
  {
    id: "the-guardians",
    title: "The Guardians",
    location: "Kilimanjaro · Tanzania",
    year: "2024",
    editions: "5 + 2 AP",
    isTwin: true,
    images: {
      main: "https://oneartpix.com/wp-content/uploads/2026/05/DSC00341_ED_V3-gigapixel-high-fidelity-v2-2.5x_V2_PRINT-BARYTA_V2_WEBP-scaled.webp",
      twin: "https://oneartpix.com/wp-content/uploads/2026/05/DSC00341_ED_V3-gigapixel-high-fidelity-v2-2.5x_V2_PSYCEDELIC_VERSION_WEBP.webp",
    },
    description:
      "Ancient tropical forest at the foot of Kilimanjaro. A moment suspended between earth and sky.",
  },
  {
    id: "the-crossing",
    title: "The Crossing",
    location: "Lake Geneva · Switzerland",
    year: "2024",
    editions: "5 + 2 AP",
    isTwin: true,
    images: {
      main: "https://oneartpix.com/wp-content/uploads/2026/05/IMG_8198-copy_ED5_Tiff-gigapixel-HF_v2-2.5x_V2_BARYTA-PRINT_WEBP-scaled.webp",
      twin: "https://oneartpix.com/wp-content/uploads/2026/05/IMG_8198_ED5_Tiff-gigapixel-HF_v2-2.5x_V2_BARYTA-PRINT-V2cont_PSYCHEDELIC_V3_WEBP-scaled.webp",
    },
    description:
      "A stolen moment at lunchtime. A lone foilboarder defying gravity between water and sky.",
  },
  {
    id: "i-see-you",
    title: "I See You",
    location: "Mer de Glace · Chamonix",
    year: "2024",
    editions: "5 + 2 AP",
    isTwin: true,
    images: {
      main: "https://oneartpix.com/wp-content/uploads/2026/04/DSC04290_TOPAZ_ED_V3_TIFF_PRINT-BARYTA-WEBP.webp",
      twin: "https://oneartpix.com/wp-content/uploads/2026/04/DSC04290_TOPAZ_ED_V2_PSYCHEDELIC_VERSION-WEBP.webp",
    },
    description:
      "The oldest glacier in the Alps — slowly disappearing. A window into something ancient and indifferent.",
  },
];

export const getArtwork = (id: string) => ARTWORKS.find((a) => a.id === id);
