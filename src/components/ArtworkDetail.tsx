"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { type Artwork, ARTWORKS, TIERS, type TierKey, editionsFor, pairPrice } from "@/data/artworks";

/* ============================================================
   ARTWORK DETAIL — fiche produit
   • 3 tiers cliquables : Prestige / Collector / Unique Piece
   • Inquire → formulaire en POP-UP (pré-rempli + commentaire, email)
   • Bandeaux détaillés (taille + support) pour les 3 tiers
   • Unique = 1/1, prix sur demande · Reunited masqué
   ============================================================ */

type Props = { artwork: Artwork; prevId: string; nextId: string };

const swiss = (n: number) => new Intl.NumberFormat("de-CH").format(Math.round(n));
const GOLD = "#C9A96E", WHITE = "#F4F2ED";

export default function ArtworkDetail({ artwork, prevId, nextId }: Props) {
  const [tierKey, setTierKey] = useState<TierKey>("prestige");
  const [showTwin, setShowTwin] = useState(false);
  const [editionIdx, setEditionIdx] = useState(0);
  const [mode, setMode] = useState<"single" | "pair">("single");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && artwork.isTwin) {
      if (new URLSearchParams(window.location.search).get("v") === "twin") setShowTwin(true);
    }
  }, [artwork.isTwin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const tier = TIERS[tierKey];
  const editions = editionsFor(tierKey);
  const single = editions[editionIdx].price;
  const onRequest = single === 0;
  const price = mode === "pair" ? pairPrice(single) : single;
  const idx = Math.max(0, ARTWORKS.findIndex((a) => a.id === artwork.id));
  const pad = (n: number) => String(n).padStart(2, "0");

  const pickTier = (k: TierKey) => {
    setTierKey(k); setEditionIdx(0);
    if (k === "unique") setMode("single");
  };

  const imgSrc = mode === "single" && showTwin ? artwork.images.twin : artwork.images.main;
  const versionLabel = mode === "pair" ? "Reunited — Original + Chromatic Twin" : showTwin ? "Chromatic Twin" : "Original";
  const priceLabel = onRequest ? "Price on request" : `From CHF ${swiss(price)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const payload = {
      artwork: `${artwork.title} (${artwork.location})`,
      tier: `${tier.name} — ${tier.editions} · ${tier.format} · ${tier.material}`,
      edition: editions[editionIdx].label,
      version: versionLabel,
      price: priceLabel,
      name: form.name, email: form.email, message: form.message,
    };
    try {
      await fetch("https://formspree.io/f/info@oneartpix.com", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    } catch { /* silencieux */ }
    setSending(false); setSent(true);
  };

  const tierOption = (k: TierKey) => {
    const t = TIERS[k]; const on = tierKey === k;
    return (
      <button key={k} className={"tier" + (on ? " on" : "")} onClick={() => pickTier(k)}>
        <span className="tier-name">{t.name}</span>
        <span className="tier-spec">{t.editions} · {t.format} · {t.material}</span>
      </button>
    );
  };

  const banner = (k: TierKey) => {
    const t = TIERS[k];
    return (
      <div className="banner" key={k}>
        <p className="b-tier">{t.name}</p>
        <div className="bgrid">
          <div><b>{t.editions}</b><span>Edition</span></div>
          <div><b>{t.format}</b><span>Size</span></div>
          <div><b>{t.material}</b><span>Support</span></div>
          <div><b>Verisart</b><span>Certificate · Blockchain</span></div>
        </div>
      </div>
    );
  };

  const field: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 0, padding: "13px 15px", color: WHITE, fontSize: "14px", outline: "none", fontFamily: "inherit",
  };
  const flabel: React.CSSProperties = { display: "block", marginBottom: "8px", color: "#6b6a65", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase" };

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

        <p className="lbl">Edition Tier</p>
        <div className="tiers">
          {tierOption("prestige")}
          {tierOption("collector")}
          {tierOption("unique")}
        </div>

        <p className="lbl">Edition</p>
        <div className="editions">
          {editions.map((ed, i) => (
            <button key={ed.label} className={"ed" + (editionIdx === i ? " on" : "")} onClick={() => setEditionIdx(i)}>
              {ed.label.replace("/", " / ")}
            </button>
          ))}
        </div>

        {artwork.isTwin && mode === "single" && (
          <>
            <p className="lbl">Version</p>
            <div className="toggle">
              <button className={showTwin ? "" : "on"} onClick={() => setShowTwin(false)}>Original</button>
              <button className={showTwin ? "on" : ""} onClick={() => setShowTwin(true)}>Chromatic Twin ✦</button>
            </div>
          </>
        )}

        {artwork.isTwin && tierKey !== "unique" && (
          <>
            <p className="lbl">Presentation</p>
            <div className="toggle">
              <button className={mode === "single" ? "on" : ""} onClick={() => setMode("single")}>Single Print</button>
              <button className={mode === "pair" ? "on" : ""} onClick={() => setMode("pair")}>Reunited — the complete work</button>
            </div>
          </>
        )}

        <div className="price-wrap">
          <p className="eyebrow">{mode === "pair" ? "Reunited — the complete work" : "This piece"}</p>
          {onRequest ? (
            <p className="price"><span className="req">Price on request</span></p>
          ) : (
            <p className="price"><span className="from">From</span> {swiss(price)}<small>CHF</small></p>
          )}
        </div>

        <button className="cta" onClick={() => { setSent(false); setOpen(true); }}>
          Inquire about this piece <i>→</i>
        </button>

        {banner("prestige")}
        {banner("collector")}
        {banner("unique")}
      </div>

      {/* ===== POP-UP FORMULAIRE ===== */}
      {open && (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal-card">
            <button className="close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
            {sent ? (
              <p className="ok">✦ Message received.<br />I will be in touch shortly.</p>
            ) : (
              <>
                <p className="m-kick">Inquire</p>
                <h3 className="m-title">{artwork.title}</h3>

                <div className="summary">
                  <div><span>Tier</span><b>{tier.name}</b></div>
                  <div><span>Edition</span><b>{editions[editionIdx].label}</b></div>
                  {artwork.isTwin && <div><span>Version</span><b>{mode === "pair" ? "Reunited" : showTwin ? "Chromatic Twin" : "Original"}</b></div>}
                  <div><span>Price</span><b>{priceLabel}</b></div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="frow">
                    <div>
                      <label style={flabel}>Your Name</label>
                      <input style={field} type="text" required placeholder="Jane Doe"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={flabel}>Your Email</label>
                      <input style={field} type="email" required placeholder="jane@example.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <label style={{ ...flabel, marginTop: "16px" }}>Your Message</label>
                  <textarea style={{ ...field, resize: "none" }} rows={4} placeholder="Tell me about your project, framing, delivery…"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <button className="send" type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send Request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

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
        .toprow{display:flex; justify-content:space-between; align-items:baseline; margin-bottom:30px;}
        .back{font-size:10.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--grey); text-decoration:none;}
        .back:hover{color:var(--white);}
        .index{font-size:10.5px; letter-spacing:.26em; color:var(--dim);}
        .index b{color:var(--white); font-weight:500;}
        .kicker{font-size:10.5px; letter-spacing:.32em; text-transform:uppercase; color:var(--gold); margin-bottom:16px;}
        .title{font-weight:300; font-size:clamp(2rem,3.6vw,3.3rem); line-height:1.04; letter-spacing:-.02em; margin-bottom:18px;}
        .lede{color:var(--grey); font-weight:300; line-height:1.8; font-size:15px; max-width:44ch; margin-bottom:40px;}
        .lbl{font-size:9.5px; letter-spacing:.3em; text-transform:uppercase; color:var(--dim); margin-bottom:14px;}

        .tiers{display:flex; flex-direction:column; gap:10px; margin-bottom:32px;}
        .tier{display:flex; flex-direction:column; align-items:flex-start; gap:5px; text-align:left; cursor:pointer;
          background:rgba(255,255,255,0.015); border:1px solid var(--hair); border-left:2px solid transparent;
          padding:15px 18px; transition:.25s; font-family:inherit;}
        .tier:hover{border-color:rgba(201,169,110,0.3);}
        .tier.on{border-color:var(--goldhair); border-left:2px solid var(--gold); background:rgba(201,169,110,0.05);}
        .tier-name{font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--white);}
        .tier.on .tier-name{color:var(--gold);}
        .tier-spec{font-size:11px; letter-spacing:.02em; color:var(--dim);}

        .editions{display:flex; flex-wrap:wrap; gap:20px; margin-bottom:28px;}
        .ed{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:13px; letter-spacing:.04em; padding:0 0 8px; border-bottom:1px solid transparent; transition:.25s;}
        .ed:hover{color:var(--grey);} .ed.on{color:var(--white); border-bottom-color:var(--goldhair);}

        .toggle{display:flex; flex-wrap:wrap; gap:24px; margin-bottom:28px;}
        .toggle button{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; padding:0 0 8px;
          border-bottom:1px solid transparent; transition:.25s;}
        .toggle button:hover{color:var(--grey);} .toggle button.on{color:var(--white); border-bottom-color:var(--goldhair);}

        .price-wrap{margin-bottom:26px; padding-top:6px;}
        .price{font-weight:300; font-size:2.5rem; line-height:1; margin-top:8px; letter-spacing:-.01em; color:var(--white);}
        .price .from{font-size:.85rem; color:var(--gold); letter-spacing:.14em; text-transform:uppercase; margin-right:8px; vertical-align:middle;}
        .price .req{font-size:1.5rem; color:var(--gold); letter-spacing:.02em;}
        .price small{font-size:.9rem; color:var(--grey); letter-spacing:.08em; margin-left:8px; font-weight:400;}

        .cta{display:flex; align-items:center; justify-content:center; gap:12px; background:var(--white); color:#0E1116;
          font-size:10.5px; letter-spacing:.26em; text-transform:uppercase; font-weight:500; padding:18px;
          border:none; cursor:pointer; font-family:inherit; transition:background .3s;}
        .cta:hover{background:var(--gold);} .cta i{font-style:normal; transition:transform .3s;} .cta:hover i{transform:translateX(4px);}

        .banner{margin-top:26px;}
        .b-tier{color:var(--gold); font-size:10px; letter-spacing:.24em; text-transform:uppercase; margin-bottom:14px;}
        .bgrid{display:grid; grid-template-columns:repeat(4,1fr); gap:16px;}
        .bgrid b{font-weight:400; font-size:.82rem; color:var(--white); line-height:1.35; display:block;}
        .bgrid span{display:block; font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); margin-top:5px;}

        .modal{position:fixed; inset:0; z-index:100; display:flex; align-items:center; justify-content:center;
          padding:24px; background:rgba(6,8,11,0.72); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);}
        .modal-card{position:relative; width:100%; max-width:560px; max-height:90vh; overflow-y:auto;
          background:#12161c; border:1px solid rgba(201,169,110,0.25); padding:clamp(28px,5vw,48px);}
        .close{position:absolute; top:16px; right:20px; background:none; border:none; color:var(--grey);
          font-size:22px; cursor:pointer; line-height:1;}
        .m-kick{color:var(--gold); font-size:10px; letter-spacing:.32em; text-transform:uppercase; margin-bottom:10px;}
        .m-title{color:var(--white); font-weight:300; font-size:1.6rem; letter-spacing:-.01em; margin-bottom:22px;}
        .summary{display:grid; grid-template-columns:1fr 1fr; gap:12px 20px; margin-bottom:26px;
          padding:16px 18px; background:rgba(255,255,255,0.02);}
        .summary span{display:block; font-size:8.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); margin-bottom:3px;}
        .summary b{font-weight:400; font-size:12.5px; color:var(--white);}
        .frow{display:grid; grid-template-columns:1fr 1fr; gap:16px;}
        .send{width:100%; margin-top:22px; padding:16px; background:var(--white); border:1px solid var(--white); color:#0E1116;
          font-size:10.5px; letter-spacing:.3em; text-transform:uppercase; font-weight:500; cursor:pointer; font-family:inherit; transition:.3s;}
        .send:hover{background:var(--gold); border-color:var(--gold);}
        .ok{color:var(--gold); text-align:center; padding:44px 0; font-size:15px; letter-spacing:.14em; line-height:1.7;}

        @media (max-width:900px){
          .oap-detail{grid-template-columns:1fr;}
          .art{min-height:60vh; height:60vh;}
          .arrow{opacity:.92; transform:translateY(-50%); width:44px; height:44px; font-size:18px;}
          .arrow.l{transform:translateY(-50%);} .arrow.r{transform:translateY(-50%);}
          .detail{padding:36px 24px 56px; justify-content:flex-start;}
          .toprow{margin-bottom:28px;} .title{font-size:clamp(2rem,9vw,2.8rem);}
          .price{font-size:2.1rem;} .bgrid{grid-template-columns:repeat(2,1fr); gap:18px 16px;}
          .frow{grid-template-columns:1fr;}
        }
        @media (max-width:380px){ .editions{gap:16px;} }
      `}</style>
    </section>
  );
}
