"use client";

/* ============================================================
   ONEARTPIX — CODE-BARRES
   Bandes verticales de largeurs inégales, chacune montrant un
   fragment d'une œuvre. Le motif parcourt TOUTES les images
   disponibles, sans jamais révéler un sujet entier.
   Au survol, la couleur revient.
   ============================================================ */

import { useState } from "react";

/* Largeurs relatives. 0 = séparation sombre, sinon largeur de bande.
   Rythme fixe (aucun aléatoire : évite tout décalage au rendu).   */
const WIDTHS = [
  26, 0, 11, 0, 42, 0, 9, 0, 18, 0, 31, 0, 8, 12, 0, 24,
  0, 15, 0, 38, 0, 10, 0, 21, 0, 13, 0, 29, 0, 16, 0, 11,
  0, 34, 0, 9, 0, 19, 0, 27, 0, 7, 0, 23, 0, 14, 0, 36,
];

/* Décalages de cadrage : chaque bande montre une zone différente. */
const SHIFTS = [8, 62, 31, 88, 17, 74, 45, 96, 23, 57, 12, 81, 39, 68, 5, 92];

export default function ReserveBarcode({ images }: { images: string[] }) {
  const [hot, setHot] = useState(false);
  if (images.length === 0) return null;

  let bar = 0; // compte uniquement les bandes photo

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
      {WIDTHS.map((w, k) => {
        /* --- séparation --- */
        if (w === 0) {
          return <div key={k} style={{ flex: "5 0 0", background: "#0b0d11" }} />;
        }

        /* --- bande photo : on parcourt toute la liste --- */
        const src = images[bar % images.length];
        const shift = SHIFTS[bar % SHIFTS.length];
        bar++;

        return (
          <div
            key={k}
            style={{
              flex: w + " 0 0",
              backgroundImage: "url(" + src + ")",
              backgroundSize: "cover",
              backgroundPosition: shift + "% center",
              filter: hot ? "grayscale(0) brightness(1)" : "grayscale(0.75) brightness(0.7)",
              transition: "filter 1.1s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        );
      })}
    </div>
  );
}
