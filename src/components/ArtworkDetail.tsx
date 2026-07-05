"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { type Artwork, ARTWORKS, TIERS, type TierKey, editionsFor, pairPrice } from "@/data/artworks";
import { FORM_ENDPOINT, FORM_READY, EMAIL } from "@/data/site";

/* ============================================================
   ARTWORK DETAIL — fiche produit
   • Edition Tier = 3 onglets (Prestige / Collector / Unique)
   • Détail du tier choisi = bloc épuré SOUS "Inquire"
   • Inquire → formulaire en POP-UP (pré-rempli + message, email)
   ============================================================ */

type Props = { artwork: Artwork; prevId: string; nextId: string };

const swiss = (n: number) => new Intl.NumberFormat("de-CH").format(Math.round(n));
const WHITE = "#F4F2ED";

export default function ArtworkDetail({ artwork, prevId, nextId }: Props) {
  const [tierKey, setTierKey] = useState<TierKey>("prestige");
  const [showTwin, setShowTwin] = useState(false);
  const [editionIdx, setEditionIdx] = useState(0);
  const [mode, setMode] = useState<"single" | "pair">("single");
  const [galleryIdx, setGalleryIdx] = useState(0); // index de la galerie in-situ (0 = l'œuvre)

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const scrollMore = (dir: number) => moreRef.current?.scrollBy({ left: dir * 330, behavior: "smooth" });

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

  /* Galerie in-situ : revenir à l'image de l'œuvre quand la version change */
  useEffect(() => { setGalleryIdx(0); }, [showTwin, mode]);

  const tier = TIERS[tierKey];
  const editions = editionsFor(tierKey);
  /* Édition par défaut = 1re NON vendue */
  useEffect(() => {
    const firstAvail = editions.findIndex((ed) => !(artwork.sold ?? []).includes(ed.label));
    setEditionIdx(firstAvail === -1 ? 0 : firstAvail);
  }, [tierKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const single = editions[editionIdx].price;
 const onRequest = single === 0 || !!artwork.onRequest;
  const price = mode === "pair" ? pairPrice(single) : single;
  const idx = Math.max(0, ARTWORKS.findIndex((a) => a.id === artwork.id));
  const pad = (n: number) => String(n).padStart(2, "0");

  const pickTier = (k: TierKey) => {
    setTierKey(k); setEditionIdx(0);
    if (k === "unique") setMode("single");
  };

  const imgSrc = mode === "single" && showTwin ? artwork.images.twin : artwork.images.main;

  /* === GALERIE IN-SITU === image de l'œuvre (réactive aux toggles) + photos de mise en situation */
  const room = artwork.room ?? [];
  const gallery = [imgSrc, ...room];              // [0] = l'œuvre, [1..] = in-situ
  const bigSrc = gallery[galleryIdx] ?? imgSrc;   // image affichée en grand
  /* === MINI-CARROUSEL === les autres œuvres de la collection */
  const others = ARTWORKS.filter((a) => a.id !== artwork.id);
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
      name: form.name, email: form.email, phone: form.phone, message: form.message,
    };
    if (FORM_READY) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) { setSent(true); setSending(false); return; }
      } catch { /* repli mailto ci-dessous */ }
    }
    const subject = encodeURIComponent(`Inquiry — ${artwork.title} · ${editions[editionIdx].label}`);
    const body = encodeURIComponent(
      `Artwork: ${payload.artwork}\nTier: ${payload.tier}\nEdition: ${payload.edition}\nVersion: ${payload.version}\nPrice: ${payload.price}\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSending(false);
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
        <img key={bigSrc} src={bigSrc} alt={artwork.title} className="art" />
        <span className="caption">{artwork.location}</span>

        {/* Galerie de l'œuvre : flèches + compteur + vignettes (actif dès qu'il y a plusieurs images) */}
        {gallery.length > 1 && (
          <>
            <button className="garrow l" aria-label="Previous image"
              onClick={() => setGalleryIdx((i) => (i - 1 + gallery.length) % gallery.length)}>‹</button>
            <button className="garrow r" aria-label="Next image"
              onClick={() => setGalleryIdx((i) => (i + 1) % gallery.length)}>›</button>
            <span className="counter">{galleryIdx + 1} / {gallery.length}</span>
            <div className="thumbs">
              {gallery.map((g, i) => (
                <button key={i} className={"thumb" + (galleryIdx === i ? " on" : "")}
                  onClick={() => setGalleryIdx(i)} aria-label={i === 0 ? "The artwork" : `View ${i + 1}`}>
                  <img src={g} alt="" />
                </button>
              ))}
            </div>
          </>
        )}
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

        {/* Edition Tier — 3 onglets */}
        <p className="lbl">Edition Tier</p>
        <div className="toggle">
          <button className={tierKey === "prestige" ? "on" : ""} onClick={() => pickTier("prestige")}>Prestige Edition</button>
          <button className={tierKey === "collector" ? "on" : ""} onClick={() => pickTier("collector")}>Collector Edition</button>
          <button className={tierKey === "unique" ? "on" : ""} onClick={() => pickTier("unique")}>Unique Piece</button>
        </div>

        {/* Édition */}
        <p className="lbl">Edition</p>
        <div className="editions">
          {editions.map((ed, i) => {
            const isSold = (artwork.sold ?? []).includes(ed.label);
            return (
              <button key={ed.label} disabled={isSold}
                className={"ed" + (editionIdx === i ? " on" : "") + (isSold ? " sold" : "")}
                onClick={() => { if (!isSold) setEditionIdx(i); }}>
                {ed.label.replace("/", " / ")}{isSold && <em> · Sold</em>}
              </button>
            );
          })}
        </div>

        {/* Version */}
        {artwork.isTwin && mode === "single" && (
          <>
            <p className="lbl">Version</p>
            <div className="toggle">
              <button className={showTwin ? "" : "on"} onClick={() => setShowTwin(false)}>Original</button>
              <button className={showTwin ? "on" : ""} onClick={() => setShowTwin(true)}>Chromatic Twin ✦</button>
            </div>
          </>
        )}

        {/* Présentation — masqué pour Unique */}
        {artwork.isTwin && tierKey !== "unique" && (
          <>
            <p className="lbl">Presentation</p>
            <div className="toggle">
              <button className={mode === "single" ? "on" : ""} onClick={() => setMode("single")}>Single Print</button>
              <button className={mode === "pair" ? "on" : ""} onClick={() => setMode("pair")}>Reunited — the complete work</button>
            </div>
          </>
        )}

        {/* Prix */}
        <div className="price-wrap">
          <p className="eyebrow">{mode === "pair" ? "Reunited — the complete work" : "This piece"}</p>
          {onRequest ? (
            <p className="price"><span className="req">Price on request</span></p>
          ) : (
            <p className="price"><span className="from">From</span> {swiss(price)}<small>CHF</small></p>
          )}
        </div>

        {/* CTA */}
        <button className="cta" onClick={() => { setSent(false); setOpen(true); }}>
          Inquire about this piece <i>→</i>
        </button>

        {/* Détail du tier choisi — épuré */}
        <div className="detail-card">
          <p className="dc-name">{tier.name}</p>
          <div className="dc-grid">
            <div><span>Edition</span><b>{tier.editions}</b></div>
            <div><span>Size</span><b>{tier.format}</b></div>
            <div><span>Support</span><b>{tier.material}</b></div>
            <div><span>Signature</span><b>Signed &amp; numbered</b></div>
            <div><span>Certificate</span><b>Blockchain · Verisart</b></div>
            <div><span>Delivery</span><b>Made to order · 10 days</b></div>
          </div>
        </div>

        {/* ===== EXPLORE THE COLLECTION — vignettes uniformes + flèches de défilement ===== */}
        {others.length > 0 && (
          <div className="more">
            <div className="more-head">
              <p className="more-lbl">Explore the Collection</p>
              <div className="more-nav">
                <button className="more-arrow" aria-label="Scroll left" onClick={() => scrollMore(-1)}>‹</button>
                <button className="more-arrow" aria-label="Scroll right" onClick={() => scrollMore(1)}>›</button>
              </div>
            </div>
            <div className="more-row" ref={moreRef}>
              {others.map((a) => (
                <Link key={a.id} href={`/collection/${a.id}`} className="more-tile">
                  <span className="more-frame"><img src={a.images.main} alt={a.title} /></span>
                  <span className="more-name">{a.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
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
                  <label style={{ ...flabel, marginTop: "16px" }}>Phone · optional</label>
                  <input style={field} type="tel" placeholder="+41 …"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <label style={{ ...flabel, marginTop: "16px" }}>Your Message</label>
                  <textarea style={{ ...field, resize: "none" }} rows={4} placeholder="Tell me about your project, framing, delivery…"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <button className="send" type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send Request"}
                  </button>
                  <p style={{ textAlign: "center", marginTop: "16px", color: "#5a5955", fontSize: "10px", letterSpacing: "0.08em" }}>
                    or email directly · <a href={`mailto:${EMAIL}`} style={{ color: "var(--gold)", textDecoration: "none" }}>{EMAIL}</a>
                  </p>
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
        .visual{position:relative; overflow:hidden; background:#0b0d11; min-width:0;}
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

        /* Flèches galerie sur la grande image + compteur */
        .garrow{position:absolute; top:50%; transform:translateY(-50%); z-index:3; width:48px; height:48px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; color:var(--white); font-size:22px; cursor:pointer;
          background:rgba(14,17,22,.42); border:1px solid var(--hair);
          -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
          opacity:0; transition:opacity .35s ease, border-color .3s, color .3s;}
        .garrow.l{left:20px;} .garrow.r{right:20px;}
        .visual:hover .garrow{opacity:1;}
        .garrow:hover{border-color:var(--goldhair); color:var(--gold);}
        .counter{position:absolute; z-index:3; top:clamp(20px,3vh,30px); right:clamp(20px,3vw,32px);
          font-size:10.5px; letter-spacing:.24em; color:var(--grey); background:rgba(14,17,22,.4);
          padding:5px 11px; -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);}

        /* Vignettes galerie in-situ */
        .thumbs{position:absolute; z-index:3; left:50%; transform:translateX(-50%); bottom:clamp(20px,3.5vh,34px);
          display:flex; gap:10px;}
        .thumb{width:58px; height:58px; padding:0; overflow:hidden; cursor:pointer; opacity:.7;
          background:#0b0d11; border:1px solid rgba(255,255,255,.28); transition:opacity .3s, border-color .3s;}
        .thumb img{width:100%; height:100%; object-fit:cover; display:block;}
        .thumb:hover{opacity:1;} .thumb.on{opacity:1; border-color:var(--goldhair);}

        .detail{display:flex; flex-direction:column; justify-content:center; min-width:0;
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

        .editions{display:flex; flex-wrap:wrap; gap:20px; margin-bottom:28px;}
        .ed{background:none; border:none; cursor:pointer; color:var(--dim); font-family:inherit; font-weight:400;
          font-size:13px; letter-spacing:.04em; padding:0 0 8px; border-bottom:1px solid transparent; transition:.25s;}
        .ed:hover{color:var(--grey);} .ed.on{color:var(--white); border-bottom-color:var(--goldhair);}
        .ed.sold{color:#4a4a47; text-decoration:line-through; cursor:not-allowed;}
        .ed.sold em{font-style:normal; text-decoration:none; color:var(--gold); font-size:8.5px;
          letter-spacing:.2em; text-transform:uppercase; margin-left:6px; vertical-align:middle;}

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

        .detail-card{margin-top:26px; padding:26px 28px; background:rgba(255,255,255,0.02);}
        .dc-name{color:var(--gold); font-size:10px; letter-spacing:.26em; text-transform:uppercase; margin-bottom:20px;}
        .dc-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:22px 20px;}
        .dc-grid span{display:block; font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:var(--dim); margin-bottom:6px;}
        .dc-grid b{font-weight:400; font-size:12.5px; color:var(--white); line-height:1.4;}

        /* Carrousel "Explore the Collection" — max ~4 vignettes, reste via flèches */
        .more{margin-top:40px; border-top:1px solid var(--hair); padding-top:26px; max-width:680px;}
        .more-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;}
        .more-lbl{font-size:9.5px; letter-spacing:.3em; text-transform:uppercase; color:var(--dim);}
        .more-nav{display:flex; gap:8px;}
        .more-arrow{width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center;
          border:1px solid rgba(255,255,255,.22); background:rgba(255,255,255,.02); color:var(--white);
          cursor:pointer; font-size:18px; font-family:inherit; transition:.25s;}
        .more-arrow:hover{border-color:var(--goldhair); color:var(--gold); background:rgba(201,169,110,.08);}
        .more-row{display:flex; gap:16px; overflow-x:auto; padding-bottom:8px; scroll-snap-type:x proximity; -webkit-overflow-scrolling:touch;}
        .more-row::-webkit-scrollbar{height:0;}
        .more-tile{flex:0 0 auto; width:150px; text-decoration:none; scroll-snap-align:start;}
        .more-frame{display:block; width:150px; height:100px; overflow:hidden; background:#0b0d11;}
        .more-frame img{width:100%; height:100%; object-fit:cover; display:block; filter:brightness(.72); transition:filter .4s ease, transform .5s ease;}
        .more-tile:hover .more-frame img{filter:brightness(1); transform:scale(1.04);}
        .more-name{display:block; margin-top:10px; font-size:11px; letter-spacing:.12em; color:var(--grey);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:color .25s;}
        .more-tile:hover .more-name{color:var(--white);}

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
          .detail{padding:36px 24px 56px; justify-content:flex-start;}
          .toprow{margin-bottom:28px;} .title{font-size:clamp(2rem,9vw,2.8rem);}
          .price{font-size:2.1rem;} .dc-grid{grid-template-columns:repeat(2,1fr);}
          .frow{grid-template-columns:1fr;}
          .thumb{width:48px; height:48px;}
          .garrow{opacity:.92; width:42px; height:42px; font-size:20px;}
          .more-tile{width:130px;} .more-frame{width:130px; height:86px;}
        }
        @media (max-width:380px){ .editions{gap:16px;} }
      `}</style>
    </section>
  );
}
