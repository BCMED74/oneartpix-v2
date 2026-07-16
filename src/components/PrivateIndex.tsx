"use client";

/* ============================================================
   ONEARTPIX — INDEX DES DOSSIERS PRIVÉS
   Grille de cartes, une par dossier.
   ============================================================ */

import type { PrivateFolder } from "@/data/private";

export default function PrivateIndex({ folders }: { folders: PrivateFolder[] }) {
  /* === DÉCONNEXION === */
  async function lock() {
    await fetch("/api/private", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <main className="wrap">
      {/* === EN-TÊTE === */}
      <header className="head">
        <p className="eyebrow">Privé</p>
        <h1>Galerie</h1>
        <button className="lock" onClick={lock}>
          Verrouiller
        </button>
      </header>

      {/* === GRILLE DES DOSSIERS === */}
      <div className="grid">
        {folders.map((f) => (
          <a key={f.slug} className="card" href={`/private/${f.slug}`}>
            <div className="thumb">
              <img src={f.cover} alt="" loading="lazy" />
            </div>
            <h2>{f.title}</h2>
            {f.subtitle && <p className="sub">{f.subtitle}</p>}
            <p className="count">
              {f.photos.length} {f.photos.length > 1 ? "images" : "image"}
            </p>
          </a>
        ))}
      </div>

      {/* === STYLES === */}
      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #0e1116;
          color: #f4f2ed;
          padding: 90px 5vw 120px;
        }
        .head {
          position: relative;
          margin-bottom: 64px;
        }
        .eyebrow {
          color: #c9a96e;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        h1 {
          font-size: clamp(32px, 5vw, 54px);
          font-weight: 300;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .lock {
          position: absolute;
          top: 0;
          right: 0;
          background: transparent;
          border: 1px solid #2a2f38;
          color: #6b6a65;
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 9px 18px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .lock:hover {
          border-color: #c9a96e;
          color: #c9a96e;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 48px 36px;
        }
        .card {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .thumb {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #161a21;
          margin-bottom: 20px;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .card:hover .thumb img {
          transform: scale(1.05);
        }
        h2 {
          font-size: 17px;
          font-weight: 400;
          margin: 0 0 6px;
          transition: color 0.3s ease;
        }
        .card:hover h2 {
          color: #c9a96e;
        }
        .sub {
          color: #9a9892;
          font-size: 13px;
          margin: 0 0 8px;
        }
        .count {
          color: #6b6a65;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 0;
        }
        @media (max-width: 640px) {
          .wrap {
            padding: 70px 6vw 90px;
          }
          .lock {
            position: static;
            margin-top: 22px;
          }
          .grid {
            gap: 40px 20px;
          }
        }
      `}</style>
    </main>
  );
}
