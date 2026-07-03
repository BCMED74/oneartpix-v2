"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { type Artwork, ARTWORKS, EDITIONS, pairPrice } from "@/data/artworks";

/* ============================================================
   ARTWORK DETAIL — fiche produit (registre Porsche + lexique verrouillé)
   • Original / Chromatic Twin  ·  Reunited = somme (aucune remise)
   • Prix préfixé "From"  ·  ligne Tier · Format · Material
   • Bandeau Certificate + Blockchain (Verisart)
   • Reunited sélectionné → sélecteur Version masqué
   • The Absolute Piece (acquisition de l'édition entière → 1/1)
   ============================================================ */

type Props = { artwork: Artwork; prevId: string; nextId: string };

const swiss = (n: number) => new Intl.NumberFormat("de-CH").format(Math.round(n));

export default function ArtworkDetail({ artwork, prevId, nextId }: Props) {
  const [showTwin, setShowTwin] = useState(false);
  const [editionIdx, setEditionIdx] = useState(0);
  const [mode, setMode] = useState<"single" | "pair">("single");

  /* Pré-sélection Chromatic Twin via ?v=twin */
  useEffect(() => {
    if (typeof window !== "undefined" && artwork.isTwin) {
      if (new URLSearchParams(window.location.search).get("v") === "twin") setShowTwin(true);
    }
  }, [artwork.isTwin]);

  const single = EDITIONS[editionIdx].price;
  const price = mode === "pair" ? pairPrice(single) : single;
  const idx = Math.max(0, ARTWORKS.findIndex((a) => a.id === artwork.id));
  const pad = (n: number) => String(n).padStart(2, "0");

  /* Image affichée : Reunited → Original */
  const imgSrc = mode === "single" && showTwin ? artwork.images.twin : artwork.images.main;

  /* Email pré-rempli */
  const subject = `OneArtPix — ${artwork.title} · Edition ${EDITIONS[editionIdx].label}`;
  const body =
    `Hello,\n\nI'm interested in the following piece:\n\n` +
    `• Artwork: ${artwork.title} (${artwork.location})\n` +
    `• Edition: ${EDITIONS[editionIdx].label}\n` +
    `• Version: ${mode === "pair" ? "Reunited — Original + Chromatic Twin" : showTwin ? "Chromatic Twin" : "Original"}\n` +
    `• Tier: ${artwork.tier} · ${artwork.material}\n` +
    `• From: CHF ${swiss(price)}\n\n` +
    `Could you please tell me more about availability?\n\nThank you.`;
  const mailto = `mailto:info@oneartpix.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  /* Email — The Absolute Piece */
  const absoluteBody =
    `Hello,\n\nI would like to enquire about acquiring the complete edition of ` +
    `"${artwork.title}" — The Absolute Piece (1/1).\n\nThank you.`;
  const absoluteMailto = `mailto:info@oneartpix.com?subject=${encodeURIComponent(
    `OneArtPix — The Absolute Piece · ${artwork.title}`
  )}&body=${encodeURIComponent(absoluteBody)}`;

  return (
    <section className="oap-detail">
      {/* IMAGE */}
      <div className="visual">
        <img src={imgSrc} alt={artwork.title} className="art" />
        <span className="caption">{artwork.location}</span>
        <Link href={`/collection/${prevId}`} aria-label="Previous artwork" className="arrow l">‹</Link>
        <Link href={`/collection/${nextId}`} aria-label="Next artwork" className="arrow r">›</Link>
      </div>

      {/* DÉTAILS */}
      <div className="detail">
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

        {/* Version — masqué quand Reunited */}
        {artwork.isTwin && mode === "single" && (
          <>
            <p className="lbl">Version</p>
            <div className="toggle">
              <button className={showTwin ? "" : "on"} onClick={() => setShowTwin(false)}>Original</button>
              <button className={showTwin ? "on" : ""} onClick={() => setShowTwin(true)}>Chromatic Twin ✦</button>
            </div>
          </>
        )}

        {/* Présentation */}
        {artwork.isTwin && (
          <>
            <p className="lbl">Presentation</p>
            <div className="toggle">
              <button className={mode === "single" ? "on" : ""} onClick={() => setMode("single")}>Single Print</button>
              <button className={mode === "pair" ? "on" : ""} onClick={() => setMode("pair")}>Reunited — the complete work</button>
            </div>
          </>
        )}

        {/* Tier · Format · Material */}
        <div className="specs">
          <div><span>Tier</span><b>{artwork.tier}</b></div>
          <div><span>Format</span><b>{artwork.format}</b></div>
          <div><span>Material</span><b>{artwork.material}</b></div>
        </div>

        {/* Prix (From) */}
        <div className="price-wrap">
          <p className="eyebrow">{mode === "pair" ? "Reunited — the complete work" : "This print"}</p>
          <p className="price"><span className="from">From</span> {swiss(price)}<small>CHF</small></p>
        </div>

        {/* CTA */}
        <a href={mailto} className="cta">Inquire about this piece <i>→</i></a>

        {/* The Absolute Piece */}
        <a href={absoluteMailto} className="absolute">
          The Absolute Piece — acquire the full edition · 1/1 · price on request <i>→</i>
        </a>

        {/* Bandeau */}
        <div className="meta">
          <div><b>{artwork.editions}</b><span>Edition</span></div>
          <div><b>Signed</b><span>Numbered</span></div>
          <div><b>Certificate</b><span>Blockchain · Verisart</span></div>
          <div><b>10 days</b><span>Made to order</span></div>
        </div>
      </div>

      <style jsx>{`
        .oap-detail{
          --white:#F4F2ED; --grey:#9a9892; --dim:#6b6a65;
          --gold:#C9A96E; --hair:rgba(255,255,255,.09); --goldhair:rgba(201,169,110,.55);
          background:#0E1116; color:var(--white); width:100%;
          display:grid; grid-template-columns:1.35fr .9fr; min-height:100vh; letter-spacing:-.01em;
        }
        .eyebrow{font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--dim); font-weight:400;}
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

        .detail{display:flex; flex-direction:column; justify-content:center;
          padding:clamp(96px,8vh,120px) clamp(32px,4vw,72px) clamp(48px,7vh,80px);}
        .toprow{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:34px;}
        .back{font-size:10.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--grey); text-decoration:none;}
        .back:hover{color:var(--white);}
        .index{font-size:10.5px; letter-spacing:.26em; color:var(--dim);}
        .index b{color:var(--white); font-weight:500;}
        .kicker{font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;}
        .title{font-weight:300; font-size:clamp(2rem,3.6vw,3.3rem); line-height:1.04; letter-spacing:-.02em; margin-bottom:18px;}
        .lede{color:var(--grey); font-weight:300; line-height:1.8; font-size:15px; max-width:44ch; margin-bottom:0;}
        .rule{height:1px; background:var(--hair); margin:32px 0;}
        .lbl{font-size:9.5px; letter-spacing:.3em; text-transform:uppercase; color:var(--dim); margin-bottom:14px;}

        .editions{display:flex; flex-wrap:wrap; gap:24px; margin-bottom:30px;}
        .ed{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:13px; letter-spacing:.04em; padding:0 0 8px; border-bottom:1px solid transparent; transition:.25s;}
        .ed:hover{color:var(--grey);} .ed.on{color:var(--white); border-bottom-color:var(--goldhair);}

        .toggle{display:flex; flex-wrap:wrap; gap:24px; margin-bottom:30px;}
        .toggle button{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; padding:0 0 8px;
          border-bottom:1px solid transparent; transition:.25s;}
        .toggle button:hover{color:var(--grey);} .toggle button.on{color:var(--white); border-bottom-color:var(--goldhair);}

        .specs{display:flex; flex-wrap:wrap; gap:14px 40px; margin:6px 0 30px; padding:18px 0;
          border-top:1px solid var(--hair); border-bottom:1px solid var(--hair);}
        .specs span{display:block; font-size:9px; letter-spacing:.26em; text-transform:uppercase; color:var(--dim); margin-bottom:5px;}
        .specs b{font-weight:400; font-size:12.5px; color:var(--white); letter-spacing:.02em;}

        .price-wrap{margin-bottom:26px;}
        .price{font-weight:300; font-size:2.5rem; line-height:1; margin-top:8px; letter-spacing:-.01em; color:var(--white);}
        .price .from{font-size:.85rem; color:var(--gold); letter-spacing:.14em; text-transform:uppercase; margin-right:8px; vertical-align:middle;}
        .price small{font-size:.9rem; color:var(--grey); letter-spacing:.08em; margin-left:8px; font-weight:400;}

        .cta{display:flex; align-items:center; justify-content:center; gap:12px; background:var(--white); color:#0E1116;
          font-size:10.5px; letter-spacing:.26em; text-transform:uppercase; font-weight:500; padding:18px;
          text-decoration:none; transition:background .3s;}
        .cta:hover{background:var(--gold);} .cta i{font-style:normal; transition:transform .3s;} .cta:hover i{transform:translateX(4px);}

        .absolute{display:flex; align-items:center; justify-content:center; gap:8px; margin-top:16px;
          color:var(--dim); font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; text-decoration:none; transition:color .3s;}
        .absolute:hover{color:var(--gold);} .absolute i{font-style:normal;}

        .meta{display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:36px;
          border-top:1px solid var(--hair); padding-top:24px;}
        .meta b{font-weight:400; font-size:.9rem; color:var(--white);}
        .meta span{display:block; font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); margin-top:4px;}

        @media (max-width:900px){
          .oap-detail{grid-template-columns:1fr;}
          .art{min-height:60vh; height:60vh;}
          .arrow{opacity:.92; transform:translateY(-50%); width:44px; height:44px; font-size:18px;}
          .arrow.l{transform:translateY(-50%);} .arrow.r{transform:translateY(-50%);}
          .detail{padding:36px 24px 56px; justify-content:flex-start;}
          .toprow{margin-bottom:28px;} .title{font-size:clamp(2rem,9vw,2.8rem);}
          .price{font-size:2.1rem;} .meta{grid-template-columns:repeat(2,1fr); gap:20px 16px;}
        }
        @media (max-width:380px){ .editions{gap:18px;} }
      `}</style>
    </section>
  );
}
