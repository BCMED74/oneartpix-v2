"use client";
import { useEffect, useState } from "react";

/* ============================================================
   HERO SECTION — OneArtPix
   Slideshow plein écran · titre calé responsive · hauteur maîtrisée
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

export default function Hero() {
  const [current, setCurrent] = useState(0);

  /* === ROTATION AUTOMATIQUE === */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % PHOTOS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      /* hauteur maîtrisée : plein écran, mais jamais démesurée sur grand moniteur */
      style={{ height: "100svh", minHeight: "560px", maxHeight: "900px" }}
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
              transform: i === current ? "scale(1.06)" : "scale(1)",
              transition: "transform 8s ease",
            }}
          />
          {/* Voile dégradé pour la lisibilité du texte */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.7) 100%)",
            }}
          />
        </div>
      ))}

      {/* === CONTENU (aligné en bas, largeur maîtrisée) === */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24">
        <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12">
          {/* Sur-titre */}
          <p className="mb-4 tracking-widest uppercase"
             style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.4em" }}>
            Fine Art Photography
          </p>

          {/* Titre principal — taille calée pour ne pas exploser sur grand écran */}
          <h1 className="font-display mb-6"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "0.03em",
                color: "#ffffff",
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
              }}>
            Where Light
            <br />
            <em style={{ color: "#C9A96E", fontStyle: "italic" }}>Meets Emotion</em>
          </h1>

          {/* Infos de la photo courante */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-8 h-px" style={{ background: "#C9A96E" }} />
            <span className="font-display"
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", letterSpacing: "0.2em" }}>
              {PHOTOS[current].title} — {PHOTOS[current].location}
            </span>
          </div>

          {/* Bouton */}
          <a href="#collection" className="inline-flex items-center gap-4" style={{ width: "fit-content" }}>
            <span style={{
              color: "#C9A96E", letterSpacing: "0.3em", fontSize: "11px",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(201,169,110,0.4)", paddingBottom: "2px",
            }}>
              Discover the Collection
            </span>
            <span style={{ color: "#C9A96E", fontSize: "18px" }}>→</span>
          </a>
        </div>
      </div>

      {/* === INDICATEURS DE SLIDE === */}
      <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-500"
            style={{
              width: i === current ? "2px" : "1px",
              height: i === current ? "32px" : "16px",
              background: i === current ? "#C9A96E" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}
