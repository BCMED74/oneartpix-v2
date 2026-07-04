"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ============================================================
   HERO — OneArtPix (registre Porsche)
   Slideshow plein écran · titre SANS off-white · gold murmure
   ============================================================ */

/* === PHOTOS DU SLIDESHOW === */
const PHOTOS = [
  {
    url: "https://oneartpix.com/wp-content/uploads/2026/05/DSC00341_ED_V3-gigapixel-high-fidelity-v2-2.5x_V2_PRINT-BARYTA_V2_WEBP-scaled.webp",
    title: "The Guardians",
    location: "Kilimanjaro · Tanzania",
  },
  {
    url: "https://oneartpix.com/wp-content/uploads/2026/05/IMG_8198-copy_ED5_Tiff-gigapixel-HF_v2-2.5x_V2_BARYTA-PRINT_WEBP-scaled.webp",
    title: "The Crossing",
    location: "Lake Geneva · Switzerland",
  },
  {
    url: "https://oneartpix.com/wp-content/uploads/2026/04/DSC04290_TOPAZ_ED_V3_TIFF_PRINT-BARYTA-WEBP.webp",
    title: "I See You",
    location: "Mer de Glace · Chamonix",
  },
  {
    url: "https://oneartpix.com/wp-content/uploads/2026/05/DSC00341_ED_V3-gigapixel-high-fidelity-v2-2.5x_V2_PSYCEDELIC_VERSION_WEBP.webp",
    title: "The Guardians · Twin",
    location: "Kilimanjaro · Tanzania",
  },
];

/* Charte */
const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";

export default function Hero() {
  const [current, setCurrent] = useState(0);

  /* === ROTATION AUTOMATIQUE === */
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % PHOTOS.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "560px", maxHeight: "940px", background: "#0E1116" }}
    >
      {/* === IMAGES DE FOND === */}
      {PHOTOS.map((photo, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: i === current ? 1 : 0,
            transitionDuration: "1500ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center",
              transform: i === current ? "scale(1.07)" : "scale(1)",
              transition: "transform 8s ease",
            }}
          />
          {/* Voile : haut (lisibilité nav) + bas (lisibilité titre) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,17,22,0.5) 0%, transparent 15%), linear-gradient(to bottom, transparent 45%, rgba(14,17,22,0.85) 100%)",
            }}
          />
        </div>
      ))}

      {/* === CONTENU (aligné en bas) === */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-28">
        <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12">
          {/* Sur-titre */}
          <p className="mb-5 uppercase" style={{ color: GOLD, fontSize: "10.5px", letterSpacing: "0.34em" }}>
            Fine Art Photography
          </p>

          {/* Titre — SANS, off-white, léger */}
          <h1
            className="mb-7"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              fontWeight: 300,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: WHITE,
              textShadow: "0 2px 30px rgba(0,0,0,0.35)",
            }}
          >
            Where Light
            <br />
            Meets Emotion
          </h1>

          {/* Infos de la photo courante */}
          <div className="flex items-center gap-5 mb-9">
            <div style={{ width: "34px", height: "1px", background: "rgba(201,169,110,0.6)" }} />
            <span style={{ color: "rgba(244,242,237,0.72)", fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase" }}>
              {PHOTOS[current].title} · {PHOTOS[current].location}
            </span>
          </div>

          {/* CTA — 2 boutons : Collection (page complète) · The Twins (carrousel) */}
          <div className="flex items-center" style={{ gap: "34px", flexWrap: "wrap" }}>
            <Link href="/collection" className="inline-flex items-center gap-3" style={{ width: "fit-content" }}>
              <span style={{ color: WHITE, letterSpacing: "0.28em", fontSize: "10.5px", textTransform: "uppercase",
                borderBottom: "1px solid rgba(201,169,110,0.6)", paddingBottom: "4px" }}>
                Collection
              </span>
              <span style={{ color: GOLD, fontSize: "16px" }}>→</span>
            </Link>
            <a href="#collection" className="inline-flex items-center gap-3" style={{ width: "fit-content" }}>
              <span style={{ color: "rgba(244,242,237,0.72)", letterSpacing: "0.28em", fontSize: "10.5px", textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "4px" }}>
                The Twins
              </span>
              <span style={{ color: GOLD, fontSize: "15px" }}>↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* === INDICATEURS === */}
      <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-500"
            style={{
              width: i === current ? "2px" : "1px",
              height: i === current ? "30px" : "14px",
              background: i === current ? GOLD : "rgba(255,255,255,0.28)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}
