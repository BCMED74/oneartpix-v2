"use client";

/* ============================================================
   ONEARTPIX — GRILLE D'UN DOSSIER PRIVÉ
   Grille de photos + lightbox plein écran (clic pour agrandir,
   flèches ‹ › et Échap au clavier).
   ============================================================ */

import { useEffect, useState } from "react";
import type { PrivateFolder } from "@/data/private";

export default function PrivateGrid({ folder }: { folder: PrivateFolder }) {
  const [open, setOpen] = useState<number | null>(null);

  /* === CLAVIER : Échap / flèches === */
  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setOpen((i) => (i === null ? null : (i + 1) % folder.photos.length));
      if (e.key === "ArrowLeft")
        setOpen((i) =>
          i === null ? null : (i - 1 + folder.photos.length) % folder.photos.length
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, folder.photos.length]);

  return (
    <main className="wrap">
      {/* === EN-TÊTE === */}
      <header className="head">
        <a className="back" href="/private">
          ‹ Galerie
        </a>
        <h1>{folder.title}</h1>
        {folder.subtitle && <p className="sub">{folder.subtitle}</p>}
      </header>

      {/* === GRILLE === */}
      <div className="grid">
        {folder.photos.map((p, i) => (
          <figure key={p.src} className="item" onClick={() => setOpen(i)}>
            <div className="frame">
              <img src={p.src} alt={p.title || ""} loading="lazy" />
            </div>
            {(p.title || p.note) && (
              <figcaption>
                {p.title && <span className="t">{p.title}</span>}
                {p.note && <span className="n">{p.note}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* === LIGHTBOX === */}
      {open !== null && (
        <div className="lb" onClick={() => setOpen(null)}>
          <img src={folder.photos[open].src} alt="" />
          <span className="counter">
            {open + 1} / {folder.photos.length}
          </span>
        </div>
      )}

      {/* === STYLES === */}
      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #0e1116;
          color: #f4f2ed;
          padding: 90px 5vw 120px;
        }
        .head {
          margin-bottom: 56px;
        }
        .back {
          display: inline-block;
          color: #6b6a65;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 22px;
          transition: color 0.3s ease;
        }
        .back:hover {
          color: #c9a96e;
        }
        h1 {
          font-size: clamp(28px, 4.4vw, 46px);
          font-weight: 300;
          margin: 0 0 8px;
        }
        .sub {
          color: #9a9892;
          font-size: 14px;
          margin: 0;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 44px 28px;
        }
        .item {
          margin: 0;
          cursor: zoom-in;
        }
        .frame {
          aspect-ratio: 3 / 2;
          background: #161a21;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .frame img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .item:hover .frame img {
          transform: scale(1.03);
        }
        figcaption {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .t {
          font-size: 14px;
          color: #f4f2ed;
        }
        .n {
          font-size: 11px;
          color: #6b6a65;
          letter-spacing: 0.1em;
        }

        /* --- Lightbox --- */
        .lb {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(8, 10, 13, 0.97);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
          animation: fade 0.3s ease;
        }
        .lb img {
          max-width: 92vw;
          max-height: 88vh;
          object-fit: contain;
        }
        .counter {
          position: absolute;
          bottom: 28px;
          color: #6b6a65;
          font-size: 11px;
          letter-spacing: 0.2em;
        }
        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (max-width: 640px) {
          .wrap {
            padding: 70px 6vw 90px;
          }
          .grid {
            gap: 34px 16px;
          }
        }
      `}</style>
    </main>
  );
}
