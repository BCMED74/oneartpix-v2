"use client";
import { useState, useEffect, useCallback } from "react";

/* ============================================================
   COLLECTION — OneArtPix
   Carrousel "film-strip" : photogrammes qui s'agrandissent au survol
   (desktop) · bande défilante (mobile) · fiche (modal) avec
   navigation ← / → (souris + clavier) · toggle Original / Twin
   ============================================================ */

/* === DONNÉES DES ŒUVRES === */
const ARTWORKS = [
  {
    id: "guardians",
    title: "The Guardians",
    location: "Kilimanjaro · Tanzania",
    year: "2024",
    editions: "5 + 2 AP",
    startingPrice: "1'200 CHF",
    isTwin: true,
    images: {
      main: "https://oneartpix.com/wp-content/uploads/2026/05/DSC00341_ED_V3-gigapixel-high-fidelity-v2-2.5x_V2_PRINT-BARYTA_V2_WEBP-scaled.webp",
      twin: "https://oneartpix.com/wp-content/uploads/2026/05/DSC00341_ED_V3-gigapixel-high-fidelity-v2-2.5x_V2_PSYCEDELIC_VERSION_WEBP.webp",
    },
    description:
      "Ancient tropical forest at the foot of Kilimanjaro. A moment suspended between earth and sky.",
  },
  {
    id: "crossing",
    title: "The Crossing",
    location: "Lake Geneva · Switzerland",
    year: "2024",
    editions: "5 + 2 AP",
    startingPrice: "1'200 CHF",
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
    startingPrice: "1'200 CHF",
    isTwin: true,
    images: {
      main: "https://oneartpix.com/wp-content/uploads/2026/04/DSC04290_TOPAZ_ED_V3_TIFF_PRINT-BARYTA-WEBP.webp",
      twin: "https://oneartpix.com/wp-content/uploads/2026/04/DSC04290_TOPAZ_ED_V2_PSYCHEDELIC_VERSION-WEBP.webp",
    },
    description:
      "The oldest glacier in the Alps — slowly disappearing. A window into something ancient and indifferent.",
  },
];

type Artwork = (typeof ARTWORKS)[number];

/* === Bande de perforations (look pellicule) === */
const perforations: React.CSSProperties = {
  height: "12px",
  background:
    "repeating-linear-gradient(to right, transparent 0 12px, rgba(255,255,255,0.06) 12px 26px)",
};

/* === Flèche de navigation de la fiche === */
const navArrowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 60,
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(10,10,10,0.6)",
  border: "1px solid rgba(201,169,110,0.4)",
  color: "#C9A96E",
  fontSize: "22px",
  cursor: "pointer",
  transition: "background 0.3s, color 0.3s",
};

export default function Collection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showTwin, setShowTwin] = useState(false);
  const [active, setActive] = useState(0);      // photogramme agrandi (desktop)
  const [isDesktop, setIsDesktop] = useState(true);

  const selected: Artwork | null = selectedIndex !== null ? ARTWORKS[selectedIndex] : null;

  /* === Détection desktop vs mobile === */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* === Ouverture / fermeture / navigation de la fiche === */
  const openModal = (i: number) => { setSelectedIndex(i); setShowTwin(false); };
  const closeModal = useCallback(() => setSelectedIndex(null), []);
  const goPrev = useCallback(() => {
    setSelectedIndex((n) => (n === null ? n : (n - 1 + ARTWORKS.length) % ARTWORKS.length));
    setShowTwin(false);
  }, []);
  const goNext = useCallback(() => {
    setSelectedIndex((n) => (n === null ? n : (n + 1) % ARTWORKS.length));
    setShowTwin(false);
  }, []);

  /* === Navigation clavier : Échap ferme, ← / → changent d'œuvre === */
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, closeModal, goPrev, goNext]);

  return (
    <section id="collection" className="py-24 md:py-32" style={{ background: "#0a0a0a" }}>
      {/* === EN-TÊTE === */}
      <div className="max-w-screen-2xl mx-auto mb-14 md:mb-16 px-6 md:px-12">
        <p className="mb-4 tracking-widest uppercase"
           style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.4em" }}>
          Curated Selection
        </p>
        <h2 className="font-display"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)", fontWeight: 300, color: "#fff" }}>
          The <em style={{ color: "#C9A96E" }}>Collection</em>
        </h2>
        <p className="mt-4" style={{ color: "#888", fontSize: "13px", letterSpacing: "0.15em" }}>
          5 editions · 2 artist proofs · Signed &amp; numbered · Made to order
        </p>
      </div>

      {/* ==========================================================
          DESKTOP — Pellicule : photogrammes qui s'agrandissent
          ========================================================== */}
      {isDesktop ? (
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div style={perforations} />

          <div
            className="flex"
            style={{ gap: "3px", height: "clamp(300px, 44vh, 460px)", background: "#000" }}
            onMouseLeave={() => setActive(0)}
          >
            {ARTWORKS.map((art, i) => (
              <div
                key={art.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => openModal(i)}
                className="relative overflow-hidden"
                style={{
                  flexGrow: active === i ? 3 : 1,
                  flexBasis: 0,
                  minWidth: 0,
                  cursor: "pointer",
                  transition: "flex-grow 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "#111",
                }}
              >
                <img
                  src={art.images.main}
                  alt={art.title}
                  className="w-full h-full object-cover"
                  style={{
                    transition: "transform 0.7s ease, filter 0.6s ease",
                    transform: "scale(1.0)",
                    filter: active === i ? "none" : "brightness(0.6)",
                  }}
                />

                <div
                  className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }}
                >
                  <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {art.location}
                  </p>
                  <h3 className="font-display"
                      style={{
                        fontSize: "1.7rem", fontWeight: 300, color: "#fff",
                        whiteSpace: "nowrap",
                        opacity: active === i ? 1 : 0,
                        transition: "opacity 0.4s ease 0.15s",
                      }}>
                    {art.title}
                  </h3>
                  <span
                    style={{
                      display: "inline-block", marginTop: "16px", width: "fit-content",
                      color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase",
                      border: "1px solid rgba(201,169,110,0.5)", padding: "8px 20px",
                      opacity: active === i ? 1 : 0,
                      transition: "opacity 0.4s ease 0.2s",
                    }}
                  >
                    Discover
                  </span>
                </div>

                {art.isTwin && (
                  <div className="absolute top-4 right-4"
                       style={{
                         background: "rgba(10,10,10,0.6)", border: "1px solid rgba(201,169,110,0.4)",
                         color: "#C9A96E", fontSize: "8px", letterSpacing: "0.2em",
                         padding: "4px 10px", textTransform: "uppercase",
                       }}>
                    Twin
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={perforations} />

          <p className="mt-5 text-center" style={{ color: "#555", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Hover to expand · Click to explore
          </p>
        </div>
      ) : (
        /* ==========================================================
           MOBILE — Bande défilante (swipe horizontal)
           ========================================================== */
        <div>
          <div
            className="flex px-6"
            style={{
              gap: "12px", overflowX: "auto", scrollSnapType: "x mandatory",
              paddingBottom: "10px", WebkitOverflowScrolling: "touch",
            }}
          >
            {ARTWORKS.map((art, i) => (
              <div
                key={art.id}
                onClick={() => openModal(i)}
                className="relative overflow-hidden"
                style={{
                  flex: "0 0 82%", scrollSnapAlign: "center",
                  aspectRatio: "4/5", background: "#111", cursor: "pointer",
                }}
              >
                <img src={art.images.main} alt={art.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end p-6"
                     style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }}>
                  <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {art.location}
                  </p>
                  <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 300, color: "#fff" }}>
                    {art.title}
                  </h3>
                </div>
                {art.isTwin && (
                  <div className="absolute top-4 right-4"
                       style={{
                         background: "rgba(10,10,10,0.6)", border: "1px solid rgba(201,169,110,0.4)",
                         color: "#C9A96E", fontSize: "8px", letterSpacing: "0.2em",
                         padding: "4px 10px", textTransform: "uppercase",
                       }}>
                    Twin
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center" style={{ color: "#555", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Swipe · Tap to explore
          </p>
        </div>
      )}

      {/* ==========================================================
          FICHE (modal) — flèches ← / → + toggle Original / Twin
          ========================================================== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
          onClick={closeModal}
        >
          {/* Flèche précédente */}
          <button
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={{ ...navArrowStyle, left: "16px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,0.6)"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; }}
          >
            ‹
          </button>

          {/* Flèche suivante */}
          <button
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={{ ...navArrowStyle, right: "16px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,0.6)"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; }}
          >
            ›
          </button>

          <div
            className="max-w-5xl w-full max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#111", border: "1px solid rgba(201,169,110,0.1)" }}
          >
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
              <div>
                <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>{selected.location}</p>
                <h3 className="font-display mt-1" style={{ fontSize: "1.8rem", fontWeight: 300, color: "#fff" }}>{selected.title}</h3>
              </div>
              <button onClick={closeModal} style={{ color: "#888", fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <img
                  src={showTwin ? selected.images.twin : selected.images.main}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                {selected.isTwin && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <button
                      onClick={() => setShowTwin(false)}
                      style={{
                        background: !showTwin ? "#C9A96E" : "transparent",
                        color: !showTwin ? "#0a0a0a" : "#C9A96E",
                        border: "1px solid #C9A96E",
                        fontSize: "9px", letterSpacing: "0.2em", padding: "6px 14px", cursor: "pointer", textTransform: "uppercase",
                      }}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setShowTwin(true)}
                      style={{
                        background: showTwin ? "#C9A96E" : "transparent",
                        color: showTwin ? "#0a0a0a" : "#C9A96E",
                        border: "1px solid #C9A96E",
                        fontSize: "9px", letterSpacing: "0.2em", padding: "6px 14px", cursor: "pointer", textTransform: "uppercase",
                      }}
                    >
                      Twin ✦
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col justify-between">
                <div>
                  <p style={{ color: "#888", lineHeight: 1.8, marginBottom: "32px" }}>{selected.description}</p>
                  <div className="space-y-3">
                    {[
                      ["Edition", selected.editions],
                      ["Starting price", selected.startingPrice],
                      ["Year", selected.year],
                      ["Preparation", "10 business days"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                        <span style={{ color: "#888", fontSize: "12px", letterSpacing: "0.1em" }}>{label}</span>
                        <span style={{ color: "#fff", fontSize: "12px" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="#contact"
                    onClick={closeModal}
                    className="block text-center py-4 transition-all duration-300"
                    style={{
                      background: "transparent", border: "1px solid #C9A96E", color: "#C9A96E",
                      fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#0a0a0a"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; }}
                  >
                    Inquire about this piece
                  </a>
                  {selected.isTwin && (
                    <p className="mt-4 text-center" style={{ color: "#888", fontSize: "11px", letterSpacing: "0.1em" }}>
                      Also available as a complete pair — <span style={{ color: "#C9A96E" }}>20% off</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
