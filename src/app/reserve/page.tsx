/* ============================================================
   ONEARTPIX — PAGE PUBLIQUE  /reserve
   Composition centrée : titre, code-barres pleine largeur,
   demande d'accès. Aucune catégorie n'est révélée.
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
          restent en réserve, montrées à qui les demande. Laissez vos coordonnées :
          un accès temporaire de quinze jours vous sera transmis.
        </p>
      </header>

      {/* === CODE-BARRES (pleine largeur) === */}
      <ReserveBarcode images={images} />

      {/* === DEMANDE D'ACCÈS (centrée) === */}
      <section style={{ padding: "88px 5vw 140px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AccessRequest scope="RESERVE" title="Demander un accès" />

        <p style={{ color: "#6b6a65", fontSize: "12px", marginTop: "40px", textAlign: "center" }}>
          Vous avez déjà un code ? <a href="/private" style={{ color: "#C9A96E", textDecoration: "none" }}>Entrer</a>
        </p>
      </section>

    </main>
  );
}
