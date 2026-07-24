"use client";

/* ============================================================
   ONEARTPIX — CODE-BARRES
   Bandes verticales de largeurs inégales, chacune montrant
   un fragment d'une œuvre. On voit la matière, jamais le sujet.
   Au survol, la couleur revient.
   ============================================================ */

import { useState } from "react";

/* Rythme fixe (pas d'aléatoire : évite tout décalage au rendu).
   w = largeur relative · i = index de l'image, null = barre pleine */
const PATTERN: { w: number; i: number | null }[] = [
  { w: 26, i: 0 }, { w: 5, i: null }, { w: 11, i: 1 }, { w: 4, i: null },
  { w: 42, i: 2 }, { w: 7, i: null }, { w: 9, i: 0 }, { w: 3, i: null },
  { w: 18, i: 1 }, { w: 6, i: null }, { w: 31, i: 2 }, { w: 4, i: null },
  { w: 8, i: 0 }, { w: 12, i: 1 }, { w: 5, i: null }, { w: 24, i: 2 },
  { w: 3, i: null }, { w: 15, i: 0 }, { w: 7, i: null }, { w: 38, i: 1 },
  { w: 5, i: null }, { w: 10, i: 2 }, { w: 4, i: null }, { w: 21, i: 0 },
  { w: 6, i: null }, { w: 13, i: 1 }, { w: 3, i: null }, { w: 29, i: 2 },
  { w: 8, i: null }, { w: 16, i: 0 }, { w: 4, i: null }, { w: 11, i: 1 },
  { w: 6, i: null }, { w: 34, i: 2 }, { w: 5, i: null }, { w: 9, i: 0 },
];

export default function ReserveBarcode({ images }: { images: string[] }) {
  const [hot, setHot] = useState(false);
  if (images.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        display: "flex", width: "100%", height: "clamp(180px,26vh,300px)",
        overflow: "hidden", background: "#0b0d11",
        borderTop: "1px solid #1c2129", borderBottom: "1px solid #1c2129",
      }}
    >
      {PATTERN.map((s, k) => {
        /* Barre pleine : simple séparation sombre. */
        if (s.i === null) {
          return <div key={k} style={{ flex: s.w + " 0 0", background: "#0b0d11" }} />;
        }
        const src = images[s.i % images.length];
        return (
          <div
            key={k}
            style={{
              flex: s.w + " 0 0",
              backgroundImage: "url(" + src + ")",
              backgroundSize: "cover",
              /* chaque bande montre une tranche différente */
              backgroundPosition: ((k * 23) % 100) + "% center",
              filter: hot ? "grayscale(0) brightness(1)" : "grayscale(0.75) brightness(0.7)",
              transition: "filter 1.1s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        );
      })}
    </div>
  );
}
