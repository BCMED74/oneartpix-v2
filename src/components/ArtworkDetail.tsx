"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { type Artwork, ARTWORKS, EDITIONS, formatCHF, pairPrice } from "@/data/artworks";

/* ============================================================
   ARTWORK DETAIL — page produit d'une œuvre (galerie haut de gamme)
   • Grille 2 colonnes fiable (détection JS, pas Tailwind md:)
   • Image encadrée + mat, photo entière visible
   • Flèches ‹ / › sur les bords de l'image, au survol
   • Switch Original / Twin sous la photo (pas de chevauchement)
   • Sélecteur d'édition · option paire -20% · Inquire (email)
   ============================================================ */

type Props = { artwork: Artwork; prevId: string; nextId: string };

/* Couleurs de la charte */
const GOLD = "#C9A96E";
const INK = "#0a0a0a";
const HAIR = "rgba(201,169,110,0.22)"; // filet gold discret

export default function ArtworkDetail({ artwork, prevId, nextId }: Props) {
  /* === ÉTAT === */
  const [showTwin, setShowTwin] = useState(false);
  const [editionIdx, setEditionIdx] = useState(0);
  const [mode, setMode] = useState<"single" | "pair">("single");
  const [isDesktop, setIsDesktop] = useState(true);
  const [imgHover, setImgHover] = useState(false);

  /* === Détection desktop (grille 2 colonnes fiable) === */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* === Prix === */
  const single = EDITIONS[editionIdx].price;
  const price = mode === "pair" ? pairPrice(single) : single;

  /* === Position dans la collection (index éditorial 01 / 03) === */
  const idx = Math.max(0, ARTWORKS.findIndex((a) => a.id === artwork.id));
  const pad = (n: number) => String(n).padStart(2, "0");

  /* === Email pré-rempli (fonctionne sans backend) === */
  const subject = `OneArtPix — ${artwork.title} · Edition ${EDITIONS[editionIdx].label}`;
  const body =
    `Hello,\n\nI'm interested in the following piece:\n\n` +
    `• Artwork: ${artwork.title} (${artwork.location})\n` +
    `• Edition: ${EDITIONS[editionIdx].label}\n` +
    `• Option: ${mode === "pair" ? "Complete Twins pair (Original + Twin, -20%)" : "Single print"}\n` +
    `• Price: ${formatCHF(price)}\n\n` +
    `Could you please tell me more about availability?\n\nThank you.`;
  const mailto = `mailto:info@oneartpix.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  /* === Bouton segmenté (édition / option) === */
  const seg = (on: boolean): React.CSSProperties => ({
    background: on ? GOLD : "transparent",
    color: on ? INK : GOLD,
    border: `1px solid ${on ? GOLD : "rgba(201,169,110,0.45)"}`,
    fontSize: "11px",
    letterSpacing: "0.15em",
    padding: "9px 15px",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "all 0.25s ease",
    borderRadius: "1px",
  });

  /* === Flèche sur le bord de l'image === */
  const arrow = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    [side]: "14px",
    transform: `translateY(-50%) translateX(${
      imgHover || !isDesktop ? "0" : side === "left" ? "-8px" : "8px"
    })`,
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(10,10,10,0.5)",
    border: `1px solid ${HAIR}`,
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    color: GOLD,
    fontSize: "20px",
    textDecoration: "none",
    borderRadius: "50%",
    opacity: imgHover || !isDesktop ? 1 : 0,
    transition: "opacity 0.35s ease, transform 0.35s ease",
    zIndex: 3,
  });

  /* === Grille (2 col desktop / empilé mobile) === */
  const gridStyle: React.CSSProperties = isDesktop
    ? {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.12fr) minmax(0, 0.88fr)",
        gap: "clamp(2.5rem, 4.5vw, 5rem)",
        alignItems: "start",
      }
    : { display: "flex", flexDirection: "column", gap: "2.25rem" };

  return (
    <section
      style={{
        background: INK,
        minHeight: "100vh",
        paddingTop: "clamp(96px, 12vh, 132px)",
        paddingBottom: "clamp(64px, 10vh, 110px)",
      }}
      className="px-6 md:px-12"
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* ============ BARRE HAUTE : retour + index ============ */}
        <div className="flex items-center justify-between" style={{ marginBottom: "clamp(28px, 4vh, 48px)" }}>
          <Link
            href="/#collection"
            style={{ color: "#8a8a8a", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none" }}
          >
            ← The Collection
          </Link>
          <span style={{ color: "#555", fontSize: "11px", letterSpacing: "0.25em" }}>
            <span style={{ color: GOLD }}>{pad(idx + 1)}</span> / {pad(ARTWORKS.length)}
          </span>
        </div>

        {/* ============ CORPS ============ */}
        <div style={gridStyle}>
          {/* ===================== IMAGE ===================== */}
          <div>
            <div
              className="relative"
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
              style={{
                background: "#0d0d0d",
                border: `1px solid ${HAIR}`,
                boxShadow: "0 30px 80px -40px rgba(0,0,0,0.9)",
                overflow: "hidden",
              }}
            >
              <img
                src={showTwin ? artwork.images.twin : artwork.images.main}
                alt={artwork.title}
                style={{
                  display: "block",
                  width: "100%",
                  maxHeight: isDesktop ? "76vh" : "62vh",
                  objectFit: "contain",
                  margin: "0 auto",
                  transition: "opacity 0.4s ease",
                }}
              />

              {/* Flèches sur les bords */}
              <Link href={`/collection/${prevId}`} aria-label="Previous artwork" style={arrow("left")}>
                ‹
              </Link>
              <Link href={`/collection/${nextId}`} aria-label="Next artwork" style={arrow("right")}>
                ›
              </Link>
            </div>

            {/* Switch Original / Twin (sous la photo, centré) */}
            {artwork.isTwin && (
              <div className="flex items-center justify-center" style={{ gap: "28px", marginTop: "18px" }}>
                {[
                  { on: !showTwin, label: "Original", fn: () => setShowTwin(false) },
                  { on: showTwin, label: "Twin ✦", fn: () => setShowTwin(true) },
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={t.fn}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: t.on ? GOLD : "#666",
                      fontSize: "11px",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      paddingBottom: "6px",
                      borderBottom: `1px solid ${t.on ? GOLD : "transparent"}`,
                      transition: "all 0.25s ease",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===================== DÉTAILS ===================== */}
          <div>
            {/* Lieu */}
            <p style={{ color: GOLD, fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: "14px" }}>
              {artwork.location}
            </p>

            {/* Titre */}
            <h1
              className="font-display"
              style={{ fontSize: "clamp(2.2rem, 3.6vw, 3.4rem)", fontWeight: 300, color: "#F5F3EE", lineHeight: 1.08, marginBottom: "22px" }}
            >
              {artwork.title}
            </h1>

            {/* Description */}
            <p style={{ color: "#9a9a9a", lineHeight: 1.85, fontSize: "15px", marginBottom: "38px", maxWidth: "46ch" }}>
              {artwork.description}
            </p>

            {/* Filet */}
            <div style={{ height: "1px", background: HAIR, marginBottom: "34px" }} />

            {/* Édition */}
            <p style={{ color: "#8a8a8a", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "14px" }}>
              Edition
            </p>
            <div className="flex flex-wrap" style={{ gap: "8px", marginBottom: "30px" }}>
              {EDITIONS.map((ed, i) => (
                <button key={ed.label} onClick={() => setEditionIdx(i)} style={seg(editionIdx === i)}>
                  {ed.label}
                </button>
              ))}
            </div>

            {/* Option seule / paire */}
            {artwork.isTwin && (
              <>
                <p style={{ color: "#8a8a8a", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "14px" }}>
                  Option
                </p>
                <div className="flex flex-wrap" style={{ gap: "8px", marginBottom: "30px" }}>
                  <button onClick={() => setMode("single")} style={seg(mode === "single")}>
                    Single print
                  </button>
                  <button onClick={() => setMode("pair")} style={seg(mode === "pair")}>
                    Complete Twins · –20%
                  </button>
                </div>
              </>
            )}

            {/* Prix */}
            <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: "22px", marginBottom: "30px" }}>
              <span style={{ color: "#8a8a8a", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {mode === "pair" ? "Complete pair" : "This print"}
              </span>
              <p className="font-display" style={{ color: "#F5F3EE", fontSize: "2.4rem", fontWeight: 300, marginTop: "6px", lineHeight: 1 }}>
                {formatCHF(price)}
              </p>
            </div>

            {/* Inquire */}
            
              href={mailto}
              className="block text-center"
              style={{
                background: GOLD,
                border: `1px solid ${GOLD}`,
                color: INK,
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "17px",
                transition: "all 0.3s ease",
              }}
            >
              Inquire about this piece
            </a>

            {/* Méta */}
            <div className="grid grid-cols-3" style={{ gap: "20px", marginTop: "38px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "26px" }}>
              {[
                [artwork.editions, "Edition"],
                ["Signed", "& numbered"],
                ["Made to order", "10 business days"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display" style={{ color: GOLD, fontSize: "1.05rem", fontWeight: 300 }}>{v}</p>
                  <p style={{ color: "#666", fontSize: "10px", letterSpacing: "0.1em", marginTop: "2px" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
