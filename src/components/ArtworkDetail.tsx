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
        .arrow{position:absolute; top:50%; z-index:3; width:50px; height:50px;
