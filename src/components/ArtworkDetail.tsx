"use client";
import { useState } from "react";
import Link from "next/link";
import { type Artwork, EDITIONS, formatCHF, pairPrice } from "@/data/artworks";

/* ============================================================
   ARTWORK DETAIL — page produit d'une œuvre
   Toggle Original/Twin · sélecteur d'édition · paire -20% ·
   Inquire (email pré-rempli) · navigation ← / → entre œuvres
   ============================================================ */

type Props = { artwork: Artwork; prevId: string; nextId: string };

export default function ArtworkDetail({ artwork, prevId, nextId }: Props) {
  const [showTwin, setShowTwin] = useState(false);
  const [editionIdx, setEditionIdx] = useState(0);
  const [mode, setMode] = useState<"single" | "pair">("single"); // seule ou paire

  const single = EDITIONS[editionIdx].price;
  const price = mode === "pair" ? pairPrice(single) : single;

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

  const btn = (activeCond: boolean): React.CSSProperties => ({
    background: activeCond ? "#C9A96E" : "transparent",
    color: activeCond ? "#0a0a0a" : "#C9A96E",
    border: "1px solid #C9A96E",
    fontSize: "11px",
    letterSpacing: "0.15em",
    padding: "10px 16px",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "all 0.25s",
  });

  return (
    <section style={{ background: "#0a0a0a", minHeight: "100vh" }} className="pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* === BARRE HAUTE : retour + navigation entre œuvres === */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/#collection"
                style={{ color: "#888", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            ← The Collection
          </Link>
          <div className="flex gap-3">
            <Link href={`/collection/${prevId}`} aria-label="Previous artwork"
                  style={{ border: "1px solid rgba(201,169,110,0.4)", color: "#C9A96E", padding: "6px 14px", fontSize: "16px", textDecoration: "none" }}>
              ‹
            </Link>
            <Link href={`/collection/${nextId}`} aria-label="Next artwork"
                  style={{ border: "1px solid rgba(201,169,110,0.4)", color: "#C9A96E", padding: "6px 14px", fontSize: "16px", textDecoration: "none" }}>
              ›
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* === IMAGE === */}
          <div className="relative" style={{ aspectRatio: "4/3", background: "#111" }}>
            <img
              src={showTwin ? artwork.images.twin : artwork.images.main}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
            {artwork.isTwin && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button onClick={() => setShowTwin(false)} style={btn(!showTwin)}>Original</button>
                <button onClick={() => setShowTwin(true)} style={btn(showTwin)}>Twin ✦</button>
              </div>
            )}
          </div>

          {/* === DÉTAILS === */}
          <div>
            <p style={{ color: "#C9A96E", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "10px" }}>
              {artwork.location}
            </p>
            <h1 className="font-display"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>
              {artwork.title}
            </h1>
            <p style={{ color: "#888", lineHeight: 1.8, marginBottom: "36px" }}>{artwork.description}</p>

            {/* Sélecteur d'édition */}
            <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "12px" }}>
              Edition
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {EDITIONS.map((ed, i) => (
                <button key={ed.label} onClick={() => setEditionIdx(i)} style={btn(editionIdx === i)}>
                  {ed.label}
                </button>
              ))}
            </div>

            {/* Choix seule / paire */}
            {artwork.isTwin && (
              <>
                <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Option
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <button onClick={() => setMode("single")} style={btn(mode === "single")}>
                    Single print
                  </button>
                  <button onClick={() => setMode("pair")} style={btn(mode === "pair")}>
                    Complete Twins · –20%
                  </button>
                </div>
              </>
            )}

            {/* Prix */}
            <div className="mb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
              <span style={{ color: "#888", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {mode === "pair" ? "Complete pair" : "This print"}
              </span>
              <p className="font-display" style={{ color: "#fff", fontSize: "2rem", fontWeight: 300, marginTop: "4px" }}>
                {formatCHF(price)}
              </p>
            </div>

            {/* Inquire */}
            <a href={mailto}
               className="block text-center py-4 transition-all duration-300"
               style={{
                 background: "#C9A96E", border: "1px solid #C9A96E", color: "#0a0a0a",
                 fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none",
               }}>
              Inquire about this piece
            </a>

            {/* Méta */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              {[
                [artwork.editions, "Edition"],
                ["Signed", "& numbered"],
                ["Made to order", "10 business days"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display" style={{ color: "#C9A96E", fontSize: "1rem", fontWeight: 300 }}>{v}</p>
                  <p style={{ color: "#555", fontSize: "10px", letterSpacing: "0.1em" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
