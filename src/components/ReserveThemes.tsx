"use client";

/* ============================================================
   ONEARTPIX — THE RESERVE (public)
   Grille de thématiques. Au clic, le formulaire de demande
   d'accès s'ouvre pour la portée choisie.
   Images publiques : public/reserve/<slug>.webp
   ============================================================ */

import { useState } from "react";
import AccessRequest from "@/components/AccessRequest";

const GOLD = "#C9A96E";
const WHITE = "#F4F2ED";
const GREY = "#9a9892";
const DIM = "#6b6a65";
const LINE = "#2a2f38";

type Theme = { slug: string; title: string; subtitle?: string; scope: string };

export default function ReserveThemes({ themes }: { themes: Theme[] }) {
  const [open, setOpen] = useState<Theme | null>(null);

  return (
    <div>

      {/* === GRILLE DES THÉMATIQUES === */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "40px 28px" }}>
        {themes.map(function (t) {
          const on = open !== null && open.scope === t.scope;
          return (
            <button key={t.slug} onClick={() => setOpen(on ? null : t)}
              style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              <div style={{ aspectRatio: "4 / 5", overflow: "hidden", background: "#161a21", border: on ? "1px solid " + GOLD : "1px solid transparent", marginBottom: "18px" }}>
                <img src={"/reserve/" + t.slug + ".webp"} alt="" loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: on ? "none" : "grayscale(0.35) brightness(0.85)", transition: "filter .5s ease" }} />
              </div>
              <p style={{ color: on ? GOLD : WHITE, fontSize: "17px", fontWeight: 400, margin: "0 0 6px", transition: "color .3s ease" }}>{t.title}</p>
              {t.subtitle ? <p style={{ color: GREY, fontSize: "13px", margin: "0 0 8px" }}>{t.subtitle}</p> : null}
              <p style={{ color: DIM, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                {on ? "— Fermer" : "Sur demande"}
              </p>
            </button>
          );
        })}
      </div>

      {/* === FORMULAIRE DE DEMANDE === */}
      {open !== null ? (
        <div style={{ marginTop: "72px", paddingTop: "56px", borderTop: "1px solid " + LINE }}>
          <AccessRequest scope={open.scope} title={open.title} />
        </div>
      ) : null}

    </div>
  );
}
