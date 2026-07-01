"use client";
import { useEffect, useState } from "react";

/* === PHOTO DATA === */
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

/* === HERO SECTION === */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setPrev(current);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % PHOTOS.length);
        setTransitioning(false);
      }, 1200);
    }, 7000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
    >
      {/* === BACKGROUND IMAGES === */}
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
              transform: i === current ? "scale(1.05)" : "scale(1)",
              transition: "transform 8s ease",
            }}
          />
          {/* === OVERLAY === */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.6) 100%)",
            }}
          />
        </div>
      ))}

      {/* === CONTENT === */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 px-12">
        {/* Tagline */}
        <p
          className="mb-4 tracking-widest uppercase"
          style={{
            color: "#C9A96E",
            fontSize: "11px",
            letterSpacing: "0.4em",
          }}
        >
          Fine Art Photography
        </p>

        {/* Main title */}
        <h1
          className="font-display mb-6"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            fontWeight: 300,
            lineHeight: 1.0,
            letterSpacing: "0.05em",
            color: "#ffffff",
            textShadow: "0 4px 40px rgba(0,0,0,0.5)",
          }}
        >
          Where Light
          <br />
          <em style={{ color: "#C9A96E", fontStyle: "italic" }}>
            Meets Emotion
          </em>
        </h1>

        {/* Current photo info */}
        <div className="flex items-center gap-6 mb-8">
          <div
            className="w-8 h-px"
            style={{ background: "#C9A96E" }}
          />
          <span
            className="font-display"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              letterSpacing: "0.2em",
            }}
          >
            {PHOTOS[current].title} — {PHOTOS[current].location}
          </span>
        </div>

        {/* CTA */}
        <a
          href="#collection"
          className="inline-flex items-center gap-4 group"
          style={{ width: "fit-content" }}
        >
          <span
            className="text-xs tracking-widest uppercase transition-colors duration-300"
            style={{
              color: "#C9A96E",
              letterSpacing: "0.3em",
              fontSize: "11px",
              borderBottom: "1px solid rgba(201,169,110,0.4)",
              paddingBottom: "2px",
            }}
          >
            Discover the Collection
          </span>
          <span style={{ color: "#C9A96E", fontSize: "18px" }}>→</span>
        </a>
      </div>

      {/* === SLIDE INDICATORS === */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3"
      >
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-500"
            style={{
              width: i === current ? "2px" : "1px",
              height: i === current ? "32px" : "16px",
              background:
                i === current
                  ? "#C9A96E"
                  : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* === SCROLL INDICATOR === */}
      <div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <div
          className="w-px animate-bounce"
          style={{
            height: "40px",
            background:
              "linear-gradient(to bottom, transparent, rgba(201,169,110,0.5))",
          }}
        />
      </div>
    </section>
  );
}
