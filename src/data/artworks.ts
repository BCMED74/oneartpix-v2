/* ============================================================
   DONNÉES PARTAGÉES — OneArtPix
   Lexique : Original · Chromatic Twin · Reunited
   3 tiers : Prestige (5+2 AP) · Collector (10+2 AP) · Unique (1/1)
   ============================================================ */

export type Artwork = {
  id: string;
  title: string;
  location: string;
  year: string;
  editions: string;
  isTwin: boolean;
  images: { main: string; twin: string };
  room?: string[];              // photos de mise en situation (in-situ) — optionnel
  sold?: string[];              // éditions déjà vendues, ex: ["1/5"] — barré + grisé
  description: string;
};

/* === TIERS === */
export const TIERS = {
  prestige: {
    key: "prestige",
    name: "Prestige Edition",
    editions: "5 + 2 AP",
    format: "70 – 120 cm · long edge",
    material: "Acrylic-plexi / Baryta on Dibond",
  },
  collector: {
    key: "collector",
    name: "Collector Edition",
    editions: "10 + 2 AP",
    format: "40 – 90 cm · long edge",
    material: "Baryta on Dibond",
  },
  unique: {
    key: "unique",
    name: "Unique Piece",
    editions: "1 / 1",
    format: "Bespoke · made to measure",
    material: "Museum-grade · on request",
  },
} as const;

export type TierKey = keyof typeof TIERS;

/* === Tarifs (prix "From"). price = 0 -> "Price on request" === */
export const EDITIONS_PRESTIGE = [
  { label: "1/5", price: 1200 },
  { label: "2/5", price: 1800 },
  { label: "3/5", price: 3000 },
  { label: "4/5", price: 5000 },
  { label: "5/5", price: 8000 },
];

/* PRIX COLLECTOR — à confirmer par Brice */
export const EDITIONS_COLLECTOR = [
  { label: "1/10", price: 600 },
  { label: "2/10", price: 750 },
  { label: "3/10", price: 950 },
  { label: "4/10", price: 1200 },
  { label: "5/10", price: 1500 },
  { label: "6/10", price: 1900 },
  { label: "7/10", price: 2400 },
  { label: "8/10", price: 3000 },
  { label: "9/10", price: 3800 },
  { label: "10/10", price: 4800 },
];

/* UNIQUE — 1/1, prix sur demande */
export const EDITIONS_UNIQUE = [{ label: "1/1", price: 0 }];

export const editionsFor = (tier: TierKey) =>
  tier === "prestige" ? EDITIONS_PRESTIGE : tier === "collector" ? EDITIONS_COLLECTOR : EDITIONS_UNIQUE;

/* === Prix formaté façon suisse : 1200 -> "1'200" === */
export const formatCHF = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

/* === Reunited = SOMME des deux visions (aucune remise) === */
export const pairPrice = (single: number) => single * 2;

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

  /* ===== NOUVELLES ŒUVRES — Lac Léman (Twins) ===== */
  {
    id: "passage",
    title: "Passage",
    location: "Lake Geneva · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: true,
    images: {
      main: "/ONEARTPIX_OLI04528_ED_WEBP__from_PNG_.webp",
      twin: "/ONEARTPIX_OLI04528_ED_CHROMATIC_WEBP__from_PNG_.webp",
    },
    description:
      "A lone sailboat drifts through the morning haze of Lake Geneva. Stillness carried by the faintest breath of wind.",
  },
  {
    id: "the-threshold",
    title: "The Threshold",
    location: "Lake Geneva · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: true,
    images: {
      main: "/ONEARTPIX_OLI04576_ED_WEBP__fromPNG_.webp",
      twin: "/ONEARTPIX_OLI04576_ED_CHROMATIC_WEBP__FROM_png_.webp",
    },
    description:
      "A weathered pontoon and its ladder, poised at the edge of still water. The quiet line where the lake begins.",
  },

  /* ===== THE COLLECTION — œuvres Solo (image unique, pas de Twin) ===== */
  /* Titres · lieux · textes = provisoires (classe, à affiner par Brice) */
  {
    id: "heartwood",
    title: "Heartwood",
    location: "Valais · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_DSC01354_ED_WEBP.webp",
      twin: "/ONEARTPIX_DSC01354_ED_WEBP.webp",
    },
    description:
      "The slow architecture of ancient wood. A century written in grain and shadow.",
  },
  {
    id: "riviera",
    title: "Riviera",
    location: "Camogli · Italy",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    sold: ["1/5"],                 // 1re édition vendue
    images: {
      main: "/ONEARTPIX_DSC02648_ED_WEBP.webp",
      twin: "/ONEARTPIX_DSC02648_ED_WEBP.webp",
    },
    description:
      "A Ligurian morning above the shore. Colour, light, and the slow rhythm of the sea.",
  },
  {
    id: "daybreak",
    title: "Daybreak",
    location: "Corsica · France",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_DSC07002_ED_WEBP.webp",
      twin: "/ONEARTPIX_DSC07002_ED_WEBP.webp",
    },
    description:
      "First light breaking over the ridgeline. The valley waking in gold and mist.",
  },
  {
    id: "crystalline",
    title: "Crystalline",
    location: "Alpine ice · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_OLI03449_V2_WEBP.webp",
      twin: "/ONEARTPIX_OLI03449_V2_WEBP.webp",
    },
    description:
      "Ice caught mid-formation. Geometry drawn by cold alone.",
  },
  {
    id: "glacial",
    title: "Glacial",
    location: "Frozen lake · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_DSC00077_ED_COLLECTION_WEBP.webp",
      twin: "/ONEARTPIX_DSC00077_ED_COLLECTION_WEBP.webp",
    },
    description:
      "The frozen surface of a mountain lake. Fracture, bubble, and deep blue silence.",
  },
  {
    id: "hoarfrost",
    title: "Hoarfrost",
    location: "Winter · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_DSC03285_ED_WEBP.webp",
      twin: "/ONEARTPIX_DSC03285_ED_WEBP.webp",
    },
    description:
      "The edge where frost meets shadow. Winter, reduced to its essence.",
  },
  {
    id: "first-frost",
    title: "First Frost",
    location: "Dawn · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_OLI03372_ED_WEBP.webp",
      twin: "/ONEARTPIX_OLI03372_ED_WEBP.webp",
    },
    description:
      "Dawn light across a field of frost. The first breath of the cold season.",
  },
  {
    id: "silver-bark",
    title: "Silver Bark",
    location: "Forest · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_OLI03878_ED_WEBP.webp",
      twin: "/ONEARTPIX_OLI03878_ED_WEBP.webp",
    },
    description:
      "Bark reduced to pure line and texture. Nature's own quiet abstraction.",
  },
];

export const getArtwork = (id: string) => ARTWORKS.find((a) => a.id === id);
