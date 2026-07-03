"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ARTWORKS } from "@/data/artworks";

/* ============================================================
   COLLECTION — carrousel PLEIN ÉCRAN adaptatif (registre Porsche)
   Ne montre QUE les Twins (les Solos vivent sur /collection)
   Desktop (≥1024) : panneaux qui s'agrandissent, hauteur ~écran
   Mobile/tablette : bande défilante, grandes photos
   ============================================================ */

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";

type Tile = { key: string; href: string; img: string; title: string; location: string; twin: boolean };
/* Le carrousel d'accueil ne montre QUE les Twins (les Solos vivent sur /collection) */
const TILES: Tile[] = ARTWORKS.filter((art) => art.isTwin).flatMap((art) => {
  const original: Tile = {
    key: art.id, href: `/collection/${art.id}`, img: art.images.main,
    title: art.title, location: art.location, twin: false,
  };
  if (!art.isTwin) return [original];
  const twin: Tile = {
    key: `${art.id}-twin`, href: `/collection/${art.id}?v=twin`, img: art.images.twin,
    title: art.title, location: art.location, twin: true,
  };
  return [original, twin];
});

export default function Collection() {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)"); // tablette → mode défilant
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const twinBadge = (
    <div className="absolute top-4 right-4"
      style={{ background: "rgba(14,17,22,0.55)", border: "1px solid rgba(201,169,110,0.4)",
        color: GOLD, fontSize: "8px", letterSpacing: "0.22em", padding: "4px 10px", textTransform: "uppercase" }}>
      Twin ✦
    </div>
  );

  return (
    <section id="collection" className="py-24 md:py-32" style={{ background: "#0E1116", width: "100%", overflow: "hidden" }}>
      {/* EN-TÊTE */}
      <div className="mb-12 md:mb-16 px-6 md:px-12">
        <p className="mb-4 uppercase" style={{ color: GOLD, fontSize: "10.5px", letterSpacing: "0.34em" }}>
          Curated Selection
        </p>
        <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 300, color: WHITE, letterSpacing: "-0.02em" }}>
          The Twins Collection
        </h2>
        <p className="mt-4" style={{ color: "#6b6a65", fontSize: "12px", letterSpacing: "0.14em" }}>
          Each work exists as an Original &amp; its Chromatic Twin · 5 editions · 2 artist proofs
        </p>
      </div>

      {/* ============ DESKTOP : bande plein écran ============ */}
      {isDesktop ? (
        <div
          style={{ display: "flex", gap: "4px", width: "100%", height: "clamp(460px, 74vh, 880px)" }}
          onMouseLeave={() => setActive(0)}
        >
          {TILES.map((tile, i) => (
            <Link
              key={tile.key}
              href={tile.href}
              onMouseEnter={() => setActive(i)}
              className="relative overflow-hidden block"
              style={{
                flexGrow: active === i ? 3.2 : 1, flexBasis: 0, minWidth: 0, cursor: "pointer",
                transition: "flex-grow 0.6s cubic-bezier(0.4, 0, 0.2, 1)", background: "#0b0d11",
              }}
            >
              <img src={tile.img} alt={tile.twin ? `${tile.title} — Chromatic Twin` : tile.title}
                className="w-full h-full object-cover"
                style={{ transition: "filter 0.6s ease", filter: active === i ? "none" : "brightness(0.5)" }} />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                style={{ background: "linear-gradient(to top, rgba(14,17,22,0.92) 0%, transparent 55%)" }}>
                <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", marginBottom: "8px" }}>
                  {tile.location}
                </p>
                <h3 style={{ fontSize: "1.6rem", fontWeight: 300, color: WHITE, letterSpacing: "-0.01em", whiteSpace: "nowrap",
                  opacity: active === i ? 1 : 0, transition: "opacity 0.4s ease 0.15s" }}>
                  {tile.title}{tile.twin && <span style={{ color: GOLD, fontSize: "0.9rem" }}> · Twin</span>}
                </h3>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "16px", width: "fit-content",
                  color: WHITE, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase",
                  opacity: active === i ? 1 : 0, transition: "opacity 0.4s ease 0.2s" }}>
                  Discover <span style={{ color: GOLD }}>→</span>
                </span>
              </div>
              {tile.twin && twinBadge}
            </Link>
          ))}
        </div>
      ) : (
        /* ============ MOBILE / TABLETTE : défilant, grandes photos ============ */
        <div>
          <div className="flex px-6"
            style={{ gap: "14px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "12px", WebkitOverflowScrolling: "touch" }}>
            {TILES.map((tile) => (
              <Link key={tile.key} href={tile.href} className="relative overflow-hidden block"
                style={{ flex: "0 0 82%", maxWidth: "440px", scrollSnapAlign: "center",
                  height: "clamp(420px, 62vh, 620px)", background: "#0b0d11" }}>
                <img src={tile.img} alt={tile.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col justify-end p-6"
                  style={{ background: "linear-gradient(to top, rgba(14,17,22,0.92) 0%, transparent 55%)" }}>
                  <p style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {tile.location}
                  </p>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 300, color: WHITE }}>
                    {tile.title}{tile.twin && <span style={{ color: GOLD, fontSize: "0.9rem" }}> · Twin</span>}
                  </h3>
                </div>
                {tile.twin && twinBadge}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-center" style={{ color: "#5a5955", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase" }}>
            Swipe · Tap to open →
          </p>
        </div>
      )}

      {/* LIEN VERS LA PAGE COMPLÈTE */}
      <div className="px-6 md:px-12" style={{ marginTop: "clamp(40px,6vh,64px)" }}>
        <Link href="/collection" style={{ display: "inline-flex", alignItems: "center", gap: "12px",
          color: WHITE, fontSize: "10.5px", letterSpacing: "0.26em", textTransform: "uppercase",
          textDecoration: "none", borderBottom: "1px solid rgba(201,169,110,0.55)", paddingBottom: "8px" }}>
          View the full collection <span style={{ color: GOLD }}>→</span>
        </Link>
      </div>
    </section>
  );
}
