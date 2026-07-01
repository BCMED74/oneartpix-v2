"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ARTWORKS } from "@/data/artworks";

/* ============================================================
   COLLECTION — carrousel "film-strip"
   Desktop : photogrammes qui s'agrandissent au survol
   Mobile  : bande défilante (swipe)
   Clic sur une œuvre → page produit dédiée /collection/[id]
   ============================================================ */

const perforations: React.CSSProperties = {
  height: "12px",
  background:
    "repeating-linear-gradient(to right, transparent 0 12px, rgba(255,255,255,0.06) 12px 26px)",
};

export default function Collection() {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

      {/* ================= DESKTOP : pellicule ================= */}
      {isDesktop ? (
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div style={perforations} />

          <div className="flex" style={{ gap: "3px", height: "clamp(300px, 44vh, 460px)", background: "#000" }}
               onMouseLeave={() => setActive(0)}>
            {ARTWORKS.map((art, i) => (
              <Link
                key={art.id}
                href={`/collection/${art.id}`}
                onMouseEnter={() => setActive(i)}
                className="relative overflow-hidden block"
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
                    transition: "filter 0.6s ease",
                    filter: active === i ? "none" : "brightness(0.6)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                     style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }}>
                  <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {art.location}
                  </p>
                  <h3 className="font-display"
                      style={{ fontSize: "1.7rem", fontWeight: 300, color: "#fff", whiteSpace: "nowrap",
                               opacity: active === i ? 1 : 0, transition: "opacity 0.4s ease 0.15s" }}>
                    {art.title}
                  </h3>
                  <span style={{
                    display: "inline-block", marginTop: "16px", width: "fit-content",
                    color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase",
                    border: "1px solid rgba(201,169,110,0.5)", padding: "8px 20px",
                    opacity: active === i ? 1 : 0, transition: "opacity 0.4s ease 0.2s",
                  }}>
                    Discover
                  </span>
                </div>
                {art.isTwin && (
                  <div className="absolute top-4 right-4"
                       style={{ background: "rgba(10,10,10,0.6)", border: "1px solid rgba(201,169,110,0.4)",
                                color: "#C9A96E", fontSize: "8px", letterSpacing: "0.2em", padding: "4px 10px", textTransform: "uppercase" }}>
                    Twin
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div style={perforations} />
          <p className="mt-5 text-center" style={{ color: "#555", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Hover to expand · Click to open
          </p>
        </div>
      ) : (
        /* ================= MOBILE : bande défilante ================= */
        <div>
          <div className="flex px-6"
               style={{ gap: "12px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "10px", WebkitOverflowScrolling: "touch" }}>
            {ARTWORKS.map((art) => (
              <Link
                key={art.id}
                href={`/collection/${art.id}`}
                className="relative overflow-hidden block"
                style={{ flex: "0 0 82%", scrollSnapAlign: "center", aspectRatio: "4/5", background: "#111" }}
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
                       style={{ background: "rgba(10,10,10,0.6)", border: "1px solid rgba(201,169,110,0.4)",
                                color: "#C9A96E", fontSize: "8px", letterSpacing: "0.2em", padding: "4px 10px", textTransform: "uppercase" }}>
                    Twin
                  </div>
                )}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-center" style={{ color: "#555", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Swipe · Tap to open
          </p>
        </div>
      )}
    </section>
  );
}
