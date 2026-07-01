"use client";
import { useState } from "react";
import Link from "next/link";
import { type Artwork, ARTWORKS, EDITIONS, pairPrice } from "@/data/artworks";

/* ============================================================
   ARTWORK DETAIL — page produit (registre Ferrari / Porsche)
   • Fond slate #0E1116 · titre en sans épuré · gold en murmure
   • Image plein bord + léger zoom cinématographique (Ken Burns)
   • Flèches ‹ / › sur les bords de l'image au survol
   • Responsive mobile via media queries (empilé, image en tête)
   • Style scopé au composant via styled-jsx (:hover, @keyframes, @media)
   ============================================================ */

type Props = { artwork: Artwork; prevId: string; nextId: string };

/* Format Suisse : 1'200 */
const swiss = (n: number) => new Intl.NumberFormat("de-CH").format(Math.round(n));

export default function ArtworkDetail({ artwork, prevId, nextId }: Props) {
  /* === ÉTAT === */
  const [showTwin, setShowTwin] = useState(false);
  const [editionIdx, setEditionIdx] = useState(0);
  const [mode, setMode] = useState<"single" | "pair">("single");

  /* === Prix === */
  const single = EDITIONS[editionIdx].price;
  const price = mode === "pair" ? pairPrice(single) : single;

  /* === Index éditorial 01 / 03 === */
  const idx = Math.max(0, ARTWORKS.findIndex((a) => a.id === artwork.id));
  const pad = (n: number) => String(n).padStart(2, "0");

  /* === Email pré-rempli (fonctionne sans backend) === */
  const subject = `OneArtPix — ${artwork.title} · Edition ${EDITIONS[editionIdx].label}`;
  const body =
    `Hello,\n\nI'm interested in the following piece:\n\n` +
    `• Artwork: ${artwork.title} (${artwork.location})\n` +
    `• Edition: ${EDITIONS[editionIdx].label}\n` +
    `• Version: ${showTwin ? "Psychedelic Twin" : "Original"}\n` +
    `• Option: ${mode === "pair" ? "Complete Twins pair (Original + Twin, -20%)" : "Single print"}\n` +
    `• Price: CHF ${swiss(price)}\n\n` +
    `Could you please tell me more about availability?\n\nThank you.`;
  const mailto = `mailto:info@oneartpix.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className="oap-detail">
      {/* ===================== IMAGE ===================== */}
      <div className="visual">
        <img
          src={showTwin ? artwork.images.twin : artwork.images.main}
          alt={artwork.title}
          className="art"
        />
        <span className="caption">{artwork.location}</span>
        <Link href={`/collection/${prevId}`} aria-label="Previous artwork" className="arrow l">‹</Link>
        <Link href={`/collection/${nextId}`} aria-label="Next artwork" className="arrow r">›</Link>
      </div>

      {/* ===================== DÉTAILS ===================== */}
      <div className="detail">
        {/* Retour + index */}
        <div className="toprow">
          <Link href="/#collection" className="back">← Collection</Link>
          <span className="index"><b>{pad(idx + 1)}</b> / {pad(ARTWORKS.length)}</span>
        </div>

        <p className="kicker">Limited Edition · Fine Art Print</p>
        <h1 className="title">{artwork.title}</h1>
        <p className="lede">{artwork.description}</p>

        <div className="rule" />

        {/* Édition */}
        <p className="lbl">Edition</p>
        <div className="editions">
          {EDITIONS.map((ed, i) => (
            <button key={ed.label} className={"ed" + (editionIdx === i ? " on" : "")} onClick={() => setEditionIdx(i)}>
              {ed.label.replace("/", " / ")}
            </button>
          ))}
        </div>

        {/* Version (si Twin) */}
        {artwork.isTwin && (
          <>
            <p className="lbl">Version</p>
            <div className="toggle">
              <button className={showTwin ? "" : "on"} onClick={() => setShowTwin(false)}>Original</button>
              <button className={showTwin ? "on" : ""} onClick={() => setShowTwin(true)}>Psychedelic Twin ✦</button>
            </div>
          </>
        )}

        {/* Présentation (si Twin) */}
        {artwork.isTwin && (
          <>
            <p className="lbl">Presentation</p>
            <div className="toggle">
              <button className={mode === "single" ? "on" : ""} onClick={() => setMode("single")}>Single print</button>
              <button className={mode === "pair" ? "on" : ""} onClick={() => setMode("pair")}>Complete Twins · –20%</button>
            </div>
          </>
        )}

        {/* Prix */}
        <div className="price-wrap">
          <p className="eyebrow">{mode === "pair" ? "Complete pair" : "This print"}</p>
          <p className="price">{swiss(price)}<small>CHF</small></p>
        </div>

        {/* CTA */}
        <a href={mailto} className="cta">Inquire about this piece <i>→</i></a>

        {/* Méta */}
        <div className="meta">
          <div><b>{artwork.editions}</b><span>Edition</span></div>
          <div><b>Signed</b><span>Numbered</span></div>
          <div><b>10 days</b><span>Made to order</span></div>
        </div>
      </div>

      {/* ===================== STYLE (scopé) ===================== */}
      <style jsx>{`
        /* --- charte --- */
        .oap-detail{
          --white:#F4F2ED; --grey:#9a9892; --dim:#6b6a65;
          --gold:#C9A96E; --hair:rgba(255,255,255,.09); --goldhair:rgba(201,169,110,.55);
          background:#0E1116; color:var(--white); width:100%;
          display:grid; grid-template-columns:1.35fr .9fr; min-height:100vh;
          letter-spacing:-.01em;
        }
        .eyebrow{font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--dim); font-weight:400;}

        /* --- image cinématographique --- */
        .visual{position:relative; overflow:hidden; background:#0b0d11;}
        .art{width:100%; height:100%; min-height:100vh; object-fit:cover; display:block;
             transform:scale(1.04); animation:kenburns 28s ease-out forwards;}
        @keyframes kenburns{to{transform:scale(1.12);}}
        .visual::after{content:""; position:absolute; inset:0; pointer-events:none;
          background:
            linear-gradient(180deg, rgba(14,17,22,.55), transparent 16%),
            linear-gradient(90deg, transparent 62%, rgba(14,17,22,.5)),
            linear-gradient(0deg, rgba(14,17,22,.55), transparent 42%);}
        .caption{position:absolute; left:clamp(24px,3vw,42px); bottom:clamp(24px,4vh,38px); z-index:2;
          font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--grey);}
        .arrow{position:absolute; top:50%; z-index:3; width:50px; height:50px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; color:var(--white); font-size:20px;
          text-decoration:none; background:rgba(14,17,22,.4); border:1px solid var(--hair);
          -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
          opacity:0; transition:opacity .45s ease, transform .45s ease, border-color .3s, color .3s;}
        .arrow.l{left:20px; transform:translateY(-50%) translateX(-6px);}
        .arrow.r{right:20px; transform:translateY(-50%) translateX(6px);}
        .visual:hover .arrow{opacity:1; transform:translateY(-50%);}
        .arrow:hover{border-color:var(--goldhair); color:var(--gold);}

        /* --- panneau détails --- */
        .detail{display:flex; flex-direction:column; justify-content:center;
          padding:clamp(96px,8vh,120px) clamp(32px,4vw,72px) clamp(48px,7vh,80px);}
        .toprow{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:38px;}
        .back{font-size:10.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--grey); text-decoration:none;}
        .back:hover{color:var(--white);}
        .index{font-size:10.5px; letter-spacing:.26em; color:var(--dim);}
        .index b{color:var(--white); font-weight:500;}

        .kicker{font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--gold); margin-bottom:18px;}
        .title{font-weight:300; font-size:clamp(2rem,3.8vw,3.5rem); line-height:1.04; letter-spacing:-.02em; margin-bottom:20px;}
        .lede{color:var(--grey); font-weight:300; line-height:1.85; font-size:15px; max-width:42ch; margin-bottom:0;}
        .rule{height:1px; background:var(--hair); margin:36px 0;}

        .lbl{font-size:9.5px; letter-spacing:.3em; text-transform:uppercase; color:var(--dim); margin-bottom:16px;}

        .editions{display:flex; flex-wrap:wrap; gap:24px; margin-bottom:34px;}
        .ed{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:13px; letter-spacing:.04em; padding:0 0 8px; border-bottom:1px solid transparent; transition:.25s;}
        .ed:hover{color:var(--grey);}
        .ed.on{color:var(--white); border-bottom-color:var(--goldhair);}

        .toggle{display:flex; flex-wrap:wrap; gap:24px; margin-bottom:34px;}
        .toggle button{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; padding:0 0 8px;
          border-bottom:1px solid transparent; transition:.25s;}
        .toggle button:hover{color:var(--grey);}
        .toggle button.on{color:var(--white); border-bottom-color:var(--goldhair);}

        .price-wrap{margin-bottom:30px;}
        .price{font-weight:300; font-size:2.6rem; line-height:1; margin-top:8px; letter-spacing:-.01em;}
        .price small{font-size:.95rem; color:var(--grey); letter-spacing:.08em; margin-left:8px; font-weight:400;}

        .cta{display:flex; align-items:center; justify-content:center; gap:12px; background:var(--white); color:#0E1116;
          font-size:10.5px; letter-spacing:.26em; text-transform:uppercase; font-weight:500; padding:18px;
          text-decoration:none; transition:background .3s;}
        .cta:hover{background:var(--gold);}
        .cta i{font-style:normal; transition:transform .3s;}
        .cta:hover i{transform:translateX(4px);}

        .meta{display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:44px;
          border-top:1px solid var(--hair); padding-top:24px;}
        .meta b{font-weight:400; font-size:.95rem; color:var(--white);}
        .meta span{display:block; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--dim); margin-top:4px;}

        /* ===================== MOBILE ===================== */
        @media (max-width:900px){
          .oap-detail{grid-template-columns:1fr;}
          .art{min-height:60vh; height:60vh;}
          .arrow{opacity:.92; transform:translateY(-50%); width:44px; height:44px; font-size:18px;}
          .arrow.l{transform:translateY(-50%);} .arrow.r{transform:translateY(-50%);}
          .detail{padding:36px 24px 56px; justify-content:flex-start;}
          .toprow{margin-bottom:28px;}
          .title{font-size:clamp(2rem,9vw,2.8rem);}
          .price{font-size:2.2rem;}
        }
        @media (max-width:380px){
          .editions{gap:18px;} .meta{gap:10px;}
        }
      `}</style>
    </section>
  );
}
