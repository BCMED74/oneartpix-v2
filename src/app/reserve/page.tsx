/* ============================================================
   ONEARTPIX — PAGE PUBLIQUE  /reserve
   Deux chemins clairement séparés :
   · demander un accès (nouveau visiteur)
   · entrer avec un code (visiteur invité)
   ============================================================ */

import type { Metadata } from "next";
import path from "path";
import fs from "fs";
import { themeFolders } from "@/data/private";
import ReserveBarcode from "@/components/ReserveBarcode";
import AccessRequest from "@/components/AccessRequest";

export const metadata: Metadata = {
  title: "The Reserve · OneArtPix",
  description:
    "Collections privées OneArtPix, accessibles sur invitation. Séries confidentielles de photographie fine art en édition limitée.",
};

export default function ReservePage() {
  /* On ne retient que les couvertures réellement déposées :
     une image absente laisserait une bande vide dans le motif. */
  const dir = path.join(process.cwd(), "public", "reserve");
  const images = themeFolders()
    .map((f) => f.slug + ".webp")
    .filter((name) => {
      try { return fs.existsSync(path.join(dir, name)); } catch { return false; }
    })
    .map((name) => "/reserve/" + name);

  return (
    <main style={{ minHeight: "100vh", background: "#0e1116", color: "#F4F2ED" }}>

      {/* === EN-TÊTE === */}
      <header style={{ maxWidth: "680px", margin: "0 auto", padding: "120px 5vw 72px", textAlign: "center" }}>
        <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 18px" }}>
          Sur invitation
        </p>
        <h1 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 300, letterSpacing: "-0.01em", margin: "0 0 28px", lineHeight: 1.05 }}>
          The Reserve
        </h1>
        <p style={{ color: "#9a9892", fontSize: "17px", lineHeight: 1.8, margin: 0 }}>
          Une part du travail ne rejoint jamais la collection publique. Ces séries
          restent en réserve, montrées à qui les demande.
        </p>
      </header>

      {/* === CODE-BARRES (pleine largeur) === */}
      <ReserveBarcode images={images} />

      {/* === LES DEUX CHEMINS === */}
      <section style={{ padding: "88px 5vw 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* --- 1. Déjà invité --- */}
        <div style={{ width: "100%", maxWidth: "480px", border: "1px solid #2a2f38", padding: "36px 32px", textAlign: "center", marginBottom: "72px" }}>
          <p style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 14px" }}>
            Déjà invité
          </p>
          <p style={{ color: "#9a9892", fontSize: "14px", lineHeight: 1.7, margin: "0 0 26px" }}>
            Vous avez reçu un code d’accès&nbsp;? Entrez directement dans la réserve.
          </p>
          <a href="/private" style={{ display: "inline-block", border: "1px solid #C9A96E", color: "#F4F2ED", fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", padding: "15px 40px" }}>
            Entrer avec un code
          </a>
        </div>

        {/* --- séparateur --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", width: "100%", maxWidth: "480px", marginBottom: "64px" }}>
          <span style={{ flex: 1, height: "1px", background: "#2a2f38" }} />
          <span style={{ color: "#5a5955", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase" }}>ou</span>
          <span style={{ flex: 1, height: "1px", background: "#2a2f38" }} />
        </div>

        {/* --- 2. Nouvelle demande --- */}
        <AccessRequest scope="RESERVE" title="Demander un accès" />

      </section>

      <div style={{ height: "100px" }} />

    </main>
  );
}
