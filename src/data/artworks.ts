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
  onRequest?: boolean;          // true => "Price on request" (contact pour infos)
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
      main: "/guardians.webp",
      twin: "/guardians-twin.webp",
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
      main: "/crossing.webp",
      twin: "/crossing-twin.webp",
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
      main: "/i-see-you.webp",
      twin: "/i-see-you-twin.webp",
    },
    description:
      "Ancient ice cave — a gateway into the depths of the Mer de Glace, the largest glacier in France (7 km long), born of the Leschaux and Géant glaciers.",
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

  /* ===== THE COLLECTION — œuvres Solo ===== */
  {
    id: "heartwood",
    title: "Heartwood",
    location: "Languedoc-Roussillon · France",
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
    title: "Bagni Lido",
    location: "Camogli · Italy · Riviera Ligure",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    sold: ["1/5"],
    images: {
main: "/ONEARTPIX_DSC07002_ED_WEBP.webp",
      twin: "/ONEARTPIX_DSC07002_ED_WEBP.webp",
    },
    description:
      "Bagni Lido Camogli — Tigullio beaches, the most beautiful sea on the Eastern Riviera.",
  },
  {
    id: "daybreak",
    title: "Daybreak",
    location: "Piana · Corsica · France",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
   main: "/ONEARTPIX_DSC07002_ED_WEBP.webp",
      twin: "/ONEARTPIX_DSC07002_ED_WEBP.webp",
    },
    description:
      "Magnificent sunrise over the pink-granite Corsican mountains of the Piana Valley, from the Osini Pass.",
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
    location: "La Gruyère · Switzerland",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/ONEARTPIX_OLI03878_ED_WEBP.webp",
      twin: "/ONEARTPIX_OLI03878_ED_WEBP.webp",
    },
    description:
      "Ice crystallised into fine silver filaments — a frozen abstraction that echoes the grain of ancient wood.",
  },
  /* ===== THE LIVING WORLD ===== */
  {
    id: "manta",
    title: "Double Manta",
    location: "Hanifaru Bay · Maldives",
    year: "2025",
    editions: "5 + 2 AP",
    isTwin: false,
    images: {
      main: "/manta.webp",
      twin: "/manta.webp",
    },
    description:
      "Hanifaru Bay, a unique site in the Maldives and a hotspot for reef manta rays (Mobula alfredi). The shape of the bay and the ocean currents converge into an abundance of plankton, drawing hundreds of mantas.",
  },
  /* ===== TRANSMUTATIONS — pièces uniques (photo transformée) ===== */
  {
    id: "gold-river", title: "Gold River", location: "Plexiglass · Molten Gold",
    year: "2025", editions: "1 / 1", isTwin: false, onRequest: true,
    images: { main: "/gold-river.webp", twin: "/gold-river.webp" },
    room: ["/the-summit.webp", "/insitu-gold-river.webp"],
    description: "Unique piece — a black-mountain photograph printed on plexiglass, hand-finished with molten gold traced into a single luminous vein. One of a kind.",
  },
  {
    id: "fragments", title: "Fragments", location: "Photographic Mosaic",
    year: "2025", editions: "1 / 1", isTwin: false, onRequest: true,
    images: { main: "/gold-river-mosaic.webp", twin: "/gold-river-mosaic.webp" },
    room: ["/the-summit.webp"],
    description: "Unique piece — the same summit, recut and reassembled into a mosaic of coloured fragments. One of a kind.",
  },

  /* ===== NOUVELLES ŒUVRES — Price on request ===== */
  {
    id: "golden-hour", title: "Golden Hour", location: "Alpine Lake · Switzerland",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/golden-hour.webp", twin: "/golden-hour.webp" },
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
  {
    id: "ember", title: "Ember", location: "Flora · Study",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/ember.webp", twin: "/ember.webp" },
    room: ["/insitu-ember.webp"],
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
  {
    id: "still-waters", title: "Still Waters", location: "Lake Skadar · Montenegro",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/still-waters.webp", twin: "/still-waters.webp" },
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
  {
    id: "golden-valley", title: "Golden Valley", location: "Durmitor · Montenegro",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/golden-valley.webp", twin: "/golden-valley.webp" },
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
  {
    id: "above-the-clouds", title: "Above the Clouds", location: "Kilimanjaro · Tanzania",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/above-the-clouds.webp", twin: "/above-the-clouds.webp" },
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
  {
    id: "driftwood", title: "Driftwood", location: "Nature · Detail",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/driftwood.webp", twin: "/driftwood.webp" },
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
  {
    id: "dew", title: "Dew", location: "Nature · Detail",
    year: "2025", editions: "5 + 2 AP", isTwin: false, onRequest: true,
    images: { main: "/dew.webp", twin: "/dew.webp" },
    description: "Limited-edition fine art print. Contact for details, sizes and availability.",
  },
];

export const getArtwork = (id: string) => ARTWORKS.find((a) => a.id === id);
