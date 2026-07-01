"use client";
import { useState } from "react";

/* === ARTWORK DATA === */
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

/* === COLLECTION SECTION === */
export default function Collection() {
  const [selected, setSelected] = useState<(typeof ARTWORKS)[0] | null>(null);
  const [showTwin, setShowTwin] = useState(false);

  return (
    <section
      id="collection"
      className="py-32 px-8"
      style={{ background: "#0a0a0a" }}
    >
      {/* === HEADER === */}
      <div className="max-w-screen-2xl mx-auto mb-20">
        <p
          className="mb-4 tracking-widest uppercase"
          style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.4em" }}
        >
          Curated Selection
        </p>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300, color: "#fff" }}
        >
          The <em style={{ color: "#C9A96E" }}>Collection</em>
        </h2>
        <p
          className="mt-4"
          style={{ color: "#888", fontSize: "13px", letterSpacing: "0.15em" }}
        >
          5 editions · 2 artist proofs · Signed & numbered · Made to order
        </p>
      </div>

      {/* === GRID === */}
      <div
        className="max-w-screen-2xl mx-auto grid gap-1"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))" }}
      >
        {ARTWORKS.map((art) => (
          <div
            key={art.id}
            className="relative overflow-hidden group"
            style={{ aspectRatio: "4/3", cursor: "pointer", background: "#111" }}
            onClick={() => { setSelected(art); setShowTwin(false); }}
          >
            <img
              src={art.images.main}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: "scale(1.02)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)",
              }}
            >
              <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "8px" }}>
                {art.location}
              </p>
              <h3
                className="font-display mb-4"
                style={{ fontSize: "1.8rem", fontWeight: 300, color: "#fff" }}
              >
                {art.title}
              </h3>
              <span
                style={{
                  display: "inline-block",
                  color: "#C9A96E",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(201,169,110,0.5)",
                  padding: "8px 20px",
                  width: "fit-content",
                }}
              >
                Discover
              </span>
            </div>

            {/* Twin badge */}
            {art.isTwin && (
              <div
                className="absolute top-4 right-4"
                style={{
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.4)",
                  color: "#C9A96E",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                  padding: "4px 10px",
                  textTransform: "uppercase",
                }}
              >
                Twin
              </div>
            )}
          </div>
        ))}
      </div>

      {/* === MODAL === */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-5xl w-full max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#111", border: "1px solid rgba(201,169,110,0.1)" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
              <div>
                <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>{selected.location}</p>
                <h3 className="font-display mt-1" style={{ fontSize: "1.8rem", fontWeight: 300, color: "#fff" }}>{selected.title}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: "#888", fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}>×</button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <img
                  src={showTwin ? selected.images.twin : selected.images.main}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                {/* Twin toggle */}
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

              {/* Info */}
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

                {/* CTA */}
                <div className="mt-8">
                  <a
                    href="#contact"
                    onClick={() => setSelected(null)}
                    className="block text-center py-4 transition-all duration-300"
                    style={{
                      background: "transparent",
                      border: "1px solid #C9A96E",
                      color: "#C9A96E",
                      fontSize: "11px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#C9A96E";
                      (e.currentTarget as HTMLElement).style.color = "#0a0a0a";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#C9A96E";
                    }}
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
