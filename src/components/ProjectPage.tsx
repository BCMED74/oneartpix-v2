"use client";
import Link from "next/link";
import { type Artwork } from "@/data/artworks";

/* ============================================================
   PROJECT PAGE — page "univers" dédiée à un projet
   (The Twins, Transmutations…).
   Hero plein écran + texte d'intro + vidéo optionnelle +
   ŒUVRES EN ÉDITORIAL ALTERNÉ (grand visuel / texte minimal).
   • Œuvre "Twin" (isTwin)  → DIPTYQUE superposé : Original + Chromatic Twin
   • Œuvre unique           → image seule
   L'image commande, le texte chuchote — jamais "blog".
   ============================================================ */

type NavLink = { label: string; href: string };

type Props = {
  eyebrow: string;         // sur-titre (ex. "Original & Chromatic Twin")
  title: string;           // titre du projet
  intro: string;           // texte d'intro du hero (paragraphes séparés par \n\n)
  works: Artwork[];        // UNIQUEMENT les œuvres de ce projet
  heroImage?: string;      // image plein cadre du hero (défaut = 1re œuvre)
  video?: string;          // chemin vidéo dans /public (optionnel) ex "/twins.mp4"
  videoPoster?: string;    // image d'aperçu de la vidéo (optionnel)
  videoCaption?: string;   // légende sous la vidéo (optionnel)
  explore?: NavLink[];     // liens vers les autres univers / la collection
};

export default function ProjectPage({
  eyebrow, title, intro, works, heroImage, video, videoPoster, videoCaption, explore = [],
}: Props) {
  const hero = heroImage ?? works[0]?.images.main ?? "";
  const paragraphs = intro.split("\n\n");
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="proj">
      {/* ===== HERO plein écran ===== */}
      <header className="phero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="phero-in">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="ptitle">{title}</h1>
          {paragraphs.map((p, i) => (
            <p key={i} className="pintro">{p}</p>
          ))}
        </div>
        <span className="scrollcue" aria-hidden="true">↓</span>
      </header>

      {/* ===== VIDÉO (affichée seulement si une vidéo est fournie) ===== */}
      {video && (
        <section className="pvideo">
          <div className="pvideo-frame">
            <video src={video} poster={videoPoster} controls preload="metadata" playsInline />
          </div>
          {videoCaption && <p className="pvideo-cap">{videoCaption}</p>}
        </section>
      )}

      {/* ===== ŒUVRES — ÉDITORIAL ALTERNÉ ===== */}
      <section className="pworks">
        {works.map((art, i) => {
          const sold = art.sold ?? [];
          const isTwin = art.isTwin && !!art.images.twin;
          return (
            <article key={art.id} className={"work" + (i % 2 ? " flip" : "")}>
              {/* Média : DIPTYQUE (twin) ou image seule (unique) */}
              <div className="media">
                {isTwin ? (
                  <div className="diptych">
                    <Link href={`/collection/${art.id}`} className="dip a" aria-label={`${art.title} — Original`}>
                      <img src={art.images.main} alt={`${art.title} — Original`} loading="lazy" />
                      <span className="dip-tag">Original</span>
                    </Link>
                    <Link href={`/collection/${art.id}?v=twin`} className="dip b" aria-label={`${art.title} — Chromatic Twin`}>
                      <img src={art.images.twin} alt={`${art.title} — Chromatic Twin`} loading="lazy" />
                      <span className="dip-tag">Chromatic Twin ✦</span>
                    </Link>
                  </div>
                ) : (
                  <Link href={`/collection/${art.id}`} className="work-img" aria-label={art.title}>
                    <img src={art.images.main} alt={art.title} loading="lazy" />
                  </Link>
                )}
              </div>

              {/* Texte minimal */}
              <div className="work-txt">
                <span className="work-no">{pad(i + 1)} — {art.location}</span>
                <h2 className="work-title">{art.title}</h2>
                <p className="work-desc">{art.description}</p>
                {sold.length > 0 && <p className="work-sold">{sold[0]} · Sold</p>}
                <Link href={`/collection/${art.id}`} className="work-cta">
                  {isTwin ? "Discover the pair" : "Discover the piece"} <i>→</i>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* ===== CONTINUER — liens vers les autres univers / la collection ===== */}
      {explore.length > 0 && (
        <section className="pmore">
          <p className="pm-eyebrow">Continue</p>
          <div className="pm-links">
            {explore.map((l) => (
              <Link key={l.href} href={l.href} className="pm-link">
                {l.label} <i>→</i>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .proj{ --white:#F4F2ED; --grey:#9a9892; --dim:#6b6a65; --gold:#C9A96E;
          --hair:rgba(255,255,255,.09); --goldhair:rgba(201,169,110,.55);
          background:#0E1116; color:var(--white); width:100%; min-height:100vh; letter-spacing:-.01em; }

        /* ===== HERO plein cadre ===== */
        .phero{ position:relative; min-height:88vh; display:flex; flex-direction:column; justify-content:flex-end;
          padding:clamp(120px,20vh,220px) clamp(24px,6vw,96px) clamp(56px,9vh,110px);
          background-size:cover; background-position:center; }
        .phero::after{ content:""; position:absolute; inset:0; pointer-events:none;
          background:linear-gradient(180deg, rgba(14,17,22,.55) 0%, rgba(14,17,22,.22) 34%, rgba(14,17,22,.92) 100%); }
        .phero-in{ position:relative; z-index:2; max-width:760px; }
        .eyebrow{ color:var(--gold); font-size:11px; letter-spacing:.34em; text-transform:uppercase; margin-bottom:18px; }
        .ptitle{ font-weight:300; font-size:clamp(2.6rem,6vw,4.6rem); line-height:1; letter-spacing:-.02em; margin-bottom:26px; }
        .pintro{ color:#d8d6d0; font-weight:300; font-size:clamp(14px,1.35vw,16px); line-height:1.85; max-width:60ch; margin-top:14px; }
        .scrollcue{ position:absolute; z-index:2; left:50%; bottom:26px; transform:translateX(-50%);
          color:var(--grey); font-size:18px; animation:bob 2.4s ease-in-out infinite; }
        @keyframes bob{ 0%,100%{ transform:translateX(-50%) translateY(0);} 50%{ transform:translateX(-50%) translateY(7px);} }

        /* ===== VIDÉO ===== */
        .pvideo{ max-width:1200px; margin:0 auto; padding:clamp(56px,9vh,110px) clamp(24px,5vw,72px) 0; }
        .pvideo-frame{ position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; background:#0b0d11; border:1px solid var(--hair); }
        .pvideo-frame video{ width:100%; height:100%; object-fit:cover; display:block; }
        .pvideo-cap{ margin-top:16px; text-align:center; color:var(--dim); font-size:10.5px; letter-spacing:.24em; text-transform:uppercase; }

        /* ===== ŒUVRES — éditorial alterné ===== */
        .pworks{ max-width:1300px; margin:0 auto;
          padding:clamp(70px,11vh,150px) clamp(24px,5vw,72px) clamp(40px,6vh,80px);
          display:flex; flex-direction:column; gap:clamp(80px,14vh,180px); }
        .work{ display:grid; grid-template-columns:1.45fr .9fr; gap:clamp(28px,5vw,72px); align-items:center; }
        .work.flip{ grid-template-columns:.9fr 1.45fr; }         /* le VISUEL reste toujours le grand côté */
        .media{ grid-column:1; } .work-txt{ grid-column:2; }
        .work.flip .media{ grid-column:2; } .work.flip .work-txt{ grid-column:1; }

        /* Image seule (œuvres uniques) */
        .work-img{ display:block; overflow:hidden; background:#0b0d11; box-shadow:0 24px 70px rgba(0,0,0,.45); }
        .work-img img{ width:100%; height:auto; display:block;   /* ratio naturel → œuvre entière */
          filter:brightness(.94); transition:filter .6s ease, transform 1s cubic-bezier(.4,0,.2,1); }
        .work-img:hover img{ filter:brightness(1); transform:scale(1.03); }

        /* Diptyque SUPERPOSÉ & décalé (œuvres Twin) : deux tirages plus grands
           qui se chevauchent, l'un plus haut que l'autre = effet "galerie". */
        .diptych{ display:flex; align-items:flex-start; }
        .dip{ position:relative; overflow:hidden; background:#0b0d11; box-shadow:0 32px 74px rgba(0,0,0,.55); }
        .dip img{ width:100%; height:auto; display:block; filter:brightness(.92);
          transition:filter .6s ease, transform 1s cubic-bezier(.4,0,.2,1); }
        .dip:hover img{ filter:brightness(1); transform:scale(1.04); }
        .dip.a{ width:58%; z-index:1; }
        .dip.b{ width:58%; margin-left:-16%; margin-top:11%; z-index:2; }  /* chevauche + descend */
        .dip:hover{ z-index:3; }                                            /* l'image survolée passe devant */
        .dip-tag{ position:absolute; left:10px; bottom:10px; z-index:2; color:var(--gold);
          font-size:8px; letter-spacing:.2em; text-transform:uppercase; padding:4px 9px;
          background:rgba(14,17,22,.55); border:1px solid rgba(201,169,110,.4);
          -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); }

        /* Texte minimal */
        .work-txt{ min-width:0; }
        .work-no{ display:block; color:var(--dim); font-size:10px; letter-spacing:.26em; text-transform:uppercase; margin-bottom:18px; }
        .work-title{ font-weight:300; font-size:clamp(1.9rem,3.6vw,3rem); line-height:1.03; letter-spacing:-.02em; margin-bottom:20px; }
        .work-desc{ color:var(--grey); font-weight:300; font-size:15px; line-height:1.85; max-width:44ch; margin-bottom:26px; }
        .work-sold{ color:var(--gold); font-size:9px; letter-spacing:.24em; text-transform:uppercase;
          text-decoration:line-through; text-decoration-color:rgba(201,169,110,.5); margin-bottom:22px; }
        .work-cta{ text-decoration:none; color:var(--white); font-size:10.5px; letter-spacing:.26em; text-transform:uppercase; font-weight:500;
          display:inline-flex; align-items:center; gap:12px; padding:15px 30px; border:1px solid var(--goldhair);
          transition:background .3s, color .3s, border-color .3s; }
        .work-cta i{ font-style:normal; color:var(--gold); transition:transform .3s, color .3s; }
        .work-cta:hover{ background:var(--gold); border-color:var(--gold); color:#0E1116; }
        .work-cta:hover i{ color:#0E1116; transform:translateX(4px); }

        /* ===== CONTINUER ===== */
        .pmore{ max-width:1300px; margin:0 auto; padding:clamp(30px,5vh,60px) clamp(24px,5vw,72px) clamp(80px,12vh,140px);
          border-top:1px solid var(--hair); }
        .pm-eyebrow{ color:var(--dim); font-size:9.5px; letter-spacing:.3em; text-transform:uppercase; margin:8px 0 22px; }
        .pm-links{ display:flex; flex-wrap:wrap; gap:clamp(20px,4vw,64px); }
        .pm-link{ text-decoration:none; color:var(--white); font-weight:300; font-size:clamp(1.3rem,2.6vw,1.9rem);
          letter-spacing:-.01em; display:inline-flex; align-items:center; gap:12px; transition:color .3s; }
        .pm-link i{ font-style:normal; color:var(--gold); transition:transform .3s; }
        .pm-link:hover{ color:var(--gold); } .pm-link:hover i{ transform:translateX(6px); }

        /* ===== MOBILE : on empile, visuel toujours au-dessus du texte ===== */
        @media (max-width:820px){
          .work{ grid-template-columns:1fr; gap:24px; }
          .work.flip{ grid-template-columns:1fr; }
          .media, .work-txt, .work.flip .media, .work.flip .work-txt{ grid-column:auto; }
          .dip.a, .dip.b{ width:60%; }
          .dip.b{ margin-left:-20%; margin-top:9%; }
          .phero{ min-height:74vh; }
        }
      `}</style>
    </main>
  );
}
