"use client";
import Link from "next/link";
import { ARTWORKS } from "@/data/artworks";

/* ============================================================
   THE COLLECTION — page galerie complète (/collection)
   Grille de TOUTES les œuvres (Twins + Solos), registre slate/gold.
   Chaque tuile → /collection/[id]. Les Twins affichent un discret
   marqueur ✦ ; les éditions vendues affichent "1/5 · Sold".
   Pour n'afficher QUE les Solos : remplacer WORKS par
   ARTWORKS.filter((a) => !a.isTwin)
   ============================================================ */

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const WORKS = ARTWORKS; // ← tout le catalogue (Twins + Solos)

export default function CollectionPage() {
  return (
    <main className="oap-coll">
      {/* EN-TÊTE */}
      <header className="head">
        <p className="eyebrow">The Complete Works</p>
        <h1 className="title">The Collection</h1>
        <p className="sub">
          Limited-edition fine art prints · signed &amp; numbered · blockchain certificate
        </p>
      </header>

      {/* GRILLE */}
      <div className="grid">
        {WORKS.map((art) => {
          const sold = art.sold ?? [];
          return (
            <Link key={art.id} href={`/collection/${art.id}`} className="tile">
              <div className="frame">
                <img src={art.images.main} alt={art.title} loading="lazy" />
                {art.isTwin && <span className="tag">The Twins ✦</span>}
              </div>
              <div className="meta">
                <div className="line">
                  <h3>{art.title}</h3>
                  {sold.length > 0 && <span className="sold">{sold[0]} · Sold</span>}
                </div>
                <p className="loc">{art.location}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .oap-coll{
          --white:#F4F2ED; --grey:#9a9892; --dim:#6b6a65; --gold:#C9A96E;
          --hair:rgba(255,255,255,.09); --goldhair:rgba(201,169,110,.55);
          background:#0E1116; color:var(--white); width:100%; min-height:100vh;
          padding:clamp(120px,16vh,180px) clamp(24px,5vw,72px) clamp(80px,12vh,140px);
          letter-spacing:-.01em;
        }
        .head{max-width:1400px; margin:0 auto clamp(48px,7vh,80px);}
        .eyebrow{color:var(--gold); font-size:10.5px; letter-spacing:.34em; text-transform:uppercase; margin-bottom:16px;}
        .title{font-weight:300; font-size:clamp(2.4rem,5vw,4rem); letter-spacing:-.02em; line-height:1;}
        .sub{margin-top:18px; color:var(--dim); font-size:12px; letter-spacing:.14em;}

        .grid{
          max-width:1400px; margin:0 auto; display:grid; gap:clamp(20px,2.4vw,40px);
          grid-template-columns:repeat(3, 1fr);
        }
        .tile{text-decoration:none; color:inherit; display:block;}
        .frame{position:relative; overflow:hidden; background:#0b0d11; aspect-ratio:4/3;}
        .frame img{
          width:100%; height:100%; object-fit:cover; display:block;
          filter:brightness(.68); transform:scale(1.005);
          transition:filter .6s ease, transform .9s cubic-bezier(.4,0,.2,1);
        }
        .tile:hover .frame img{filter:brightness(1); transform:scale(1.05);}
        .tag{position:absolute; top:14px; right:14px; background:rgba(14,17,22,.55);
          border:1px solid rgba(201,169,110,.4); color:var(--gold);
          font-size:8px; letter-spacing:.22em; text-transform:uppercase; padding:4px 10px;}
        .meta{padding:18px 2px 0;}
        .line{display:flex; align-items:baseline; justify-content:space-between; gap:12px;}
        .meta h3{font-weight:300; font-size:1.25rem; letter-spacing:-.01em; color:var(--white);}
        .sold{flex:0 0 auto; color:var(--gold); font-size:8.5px; letter-spacing:.2em;
          text-transform:uppercase; text-decoration:line-through; text-decoration-color:rgba(201,169,110,.5);}
        .loc{margin-top:8px; color:var(--dim); font-size:10px; letter-spacing:.24em; text-transform:uppercase;}

        @media (max-width:1024px){ .grid{grid-template-columns:repeat(2,1fr);} }
        @media (max-width:640px){
          .grid{grid-template-columns:1fr; gap:32px;}
          .meta h3{font-size:1.15rem;}
        }
      `}</style>
    </main>
  );
}
