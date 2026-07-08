"use client";
import { SERIES, worksFor, coverFor } from "@/data/series";

/* ============================================================
   COLLECTION — index premium des SÉRIES / PROJETS
   Une carte par univers (The Twins, Transmutations, Ice & Frost…),
   chacune ouvre sa page-univers dédiée. C'est la "table des matières".
   NB : <a> natifs (styled-jsx ne style pas les <Link>).
   ============================================================ */

export default function CollectionPage() {
  return (
    <main className="coll">
      <header className="coll-head">
        <p className="eyebrow">The Collection</p>
        <h1 className="coll-title">Series &amp; Projects</h1>
        <p className="coll-intro">
          Each body of work is its own world — chapters in a single, evolving practice.
          Enter any one to explore its pieces.
        </p>
      </header>

      <section className="series-grid">
        {SERIES.map((s) => {
          const n = worksFor(s).length;
          if (n === 0) return null;
          return (
            <a key={s.slug} href={s.href} className="scard">
              <span className="scard-media">
                <img src={coverFor(s)} alt={s.title} loading="lazy" />
              </span>
              <span className="scard-body">
                <span className="scard-sub">{s.sub}</span>
                <span className="scard-title">{s.title}</span>
                <span className="scard-meta">
                  {n} {n > 1 ? "pieces" : "piece"} <i>Enter →</i>
                </span>
              </span>
            </a>
          );
        })}
      </section>

      <style jsx>{`
        .coll{ --white:#F4F2ED; --grey:#9a9892; --dim:#6b6a65; --gold:#C9A96E;
          --hair:rgba(255,255,255,.09); --goldhair:rgba(201,169,110,.55);
          background:#0E1116; color:var(--white); min-height:100vh; width:100%; letter-spacing:-.01em; }

        /* En-tête */
        .coll-head{ max-width:1300px; margin:0 auto;
          padding:clamp(120px,20vh,190px) clamp(24px,5vw,72px) clamp(30px,5vh,56px); }
        .eyebrow{ color:var(--gold); font-size:11px; letter-spacing:.34em; text-transform:uppercase; margin-bottom:16px; }
        .coll-title{ font-weight:300; font-size:clamp(2.4rem,5vw,3.8rem); line-height:1.02; letter-spacing:-.02em; margin-bottom:20px; }
        .coll-intro{ color:var(--grey); font-weight:300; font-size:clamp(14px,1.3vw,16px); line-height:1.8; max-width:56ch; }

        /* Grille de cartes-séries */
        .series-grid{ max-width:1300px; margin:0 auto;
          padding:0 clamp(24px,5vw,72px) clamp(90px,14vh,150px);
          display:grid; grid-template-columns:1fr 1fr; gap:clamp(18px,2vw,32px); }

        .scard{ position:relative; display:block; overflow:hidden; text-decoration:none; color:inherit;
          aspect-ratio:3 / 2; background:#0b0d11; }
        .scard-media{ position:absolute; inset:0; }
        .scard-media img{ width:100%; height:100%; object-fit:cover; display:block; filter:brightness(.6);
          transform:scale(1.005); transition:filter .6s ease, transform 1.1s cubic-bezier(.4,0,.2,1); }
        .scard::after{ content:""; position:absolute; inset:0; pointer-events:none; z-index:1;
          background:linear-gradient(180deg, rgba(14,17,22,.15) 0%, rgba(14,17,22,.2) 45%, rgba(14,17,22,.9) 100%); }
        .scard:hover .scard-media img{ filter:brightness(.82); transform:scale(1.05); }

        .scard-body{ position:absolute; left:0; bottom:0; z-index:2; display:block;
          padding:clamp(22px,3vw,38px); width:100%; }
        .scard-sub{ display:block; color:var(--gold); font-size:10px; letter-spacing:.28em; text-transform:uppercase; margin-bottom:12px; }
        .scard-title{ display:block; font-weight:300; font-size:clamp(1.7rem,3vw,2.6rem); line-height:1.02; letter-spacing:-.02em; margin-bottom:16px; }
        .scard-meta{ display:flex; align-items:center; justify-content:space-between; gap:12px;
          color:var(--dim); font-size:10px; letter-spacing:.24em; text-transform:uppercase; }
        .scard-meta i{ font-style:normal; color:var(--white); border-bottom:1px solid var(--goldhair);
          padding-bottom:4px; transition:color .3s; }
        .scard:hover .scard-meta i{ color:var(--gold); }

        @media (max-width:820px){
          .series-grid{ grid-template-columns:1fr; gap:16px; }
          .scard{ aspect-ratio:4 / 3; }
        }
      `}</style>
    </main>
  );
}
